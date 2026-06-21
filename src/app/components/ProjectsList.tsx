import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { useLocale } from '../i18n/useLocale';
import { projectsForList } from '../projects';
import type { ProjectItem } from '../projects';
import { ProjectPlaceholder } from './ProjectPlaceholder';

type ProjectsListProps = {
  scrollRef: RefObject<HTMLDivElement | null>;
  inset: number;
  previewSize: number;
  previewAnchorX: number;
  previewAnchorY: number;
  isMobile: boolean;
  onOpenProject: (src: string) => void;
};

function formatTags(tags: readonly string[]) {
  return tags.join(' | ');
}

type CenteredPreviewState = {
  project: ProjectItem;
};

const PREVIEW_GAP_PX = 20;

function centeredPreviewEqual(
  a: CenteredPreviewState | null,
  b: CenteredPreviewState | null,
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.project.id === b.project.id;
}

export function ProjectsList({
  scrollRef,
  inset,
  previewSize,
  previewAnchorX,
  previewAnchorY,
  isMobile,
  onOpenProject,
}: ProjectsListProps) {
  const { projects, messages } = useLocale();
  const items = useMemo(() => projectsForList(projects), [projects]);
  const [centeredPreview, setCenteredPreview] = useState<CenteredPreviewState | null>(null);
  const [listPadY, setListPadY] = useState(inset + 48);
  const [previewLeft, setPreviewLeft] = useState(0);
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const centeredPreviewRef = useRef<CenteredPreviewState | null>(null);

  const setItemRef = useCallback((id: string, node: HTMLButtonElement | null) => {
    if (node) itemRefs.current.set(id, node);
    else itemRefs.current.delete(id);
  }, []);

  const updateCenteredPreview = useCallback(() => {
    if (isMobile) {
      if (centeredPreviewRef.current !== null) {
        centeredPreviewRef.current = null;
        setCenteredPreview(null);
      }
      return;
    }

    const scrollRoot = scrollRef.current;
    if (!scrollRoot || items.length === 0) {
      if (centeredPreviewRef.current !== null) {
        centeredPreviewRef.current = null;
        setCenteredPreview(null);
      }
      return;
    }

    const viewportCenter =
      scrollRoot.getBoundingClientRect().top + scrollRoot.clientHeight / 2;

    let closest: {
      project: ProjectItem;
      distance: number;
      button: HTMLButtonElement;
    } | null = null;

    for (const project of items) {
      const button = itemRefs.current.get(project.id);
      if (!button) continue;

      const rect = button.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = Math.abs(center - viewportCenter);

      if (!closest || distance < closest.distance) {
        closest = { project, distance, button };
      }
    }

    if (!closest) {
      if (centeredPreviewRef.current !== null) {
        centeredPreviewRef.current = null;
        setCenteredPreview(null);
      }
      return;
    }

    const next: CenteredPreviewState = { project: closest.project };

    if (!centeredPreviewEqual(centeredPreviewRef.current, next)) {
      centeredPreviewRef.current = next;
      setCenteredPreview(next);
    }
  }, [isMobile, items, scrollRef]);

  useLayoutEffect(() => {
    const scrollRoot = scrollRef.current;
    scrollRoot?.scrollTo({ top: 0, behavior: 'auto' });
  }, [scrollRef]);

  useLayoutEffect(() => {
    const measureListPadding = () => {
      const scrollRoot = scrollRef.current;
      const firstButton = itemRefs.current.get(items[0]?.id ?? '');
      if (!scrollRoot || !firstButton) return;

      const halfItem = firstButton.getBoundingClientRect().height / 2;
      const pad = Math.max(inset + 48, scrollRoot.clientHeight / 2 - halfItem);
      setListPadY((prev) => (Math.abs(prev - pad) < 0.5 ? prev : pad));
    };

    const measurePreviewLeft = () => {
      let maxTitleHalfWidth = 0;

      for (const project of items) {
        const button = itemRefs.current.get(project.id);
        const title = button?.querySelector<HTMLElement>('.projects-list__title');
        if (!title) continue;
        maxTitleHalfWidth = Math.max(maxTitleHalfWidth, title.offsetWidth / 2);
      }

      if (maxTitleHalfWidth <= 0) return;

      const left = previewAnchorX + maxTitleHalfWidth + PREVIEW_GAP_PX;
      setPreviewLeft((prev) => (Math.abs(prev - left) < 0.5 ? prev : left));
    };

    const schedule = () => {
      measureListPadding();
      if (!isMobile) {
        measurePreviewLeft();
        updateCenteredPreview();
      }
    };

    if (isMobile) {
      centeredPreviewRef.current = null;
      setCenteredPreview(null);
    }

    schedule();

    const scrollRoot = scrollRef.current;
    if (!isMobile) {
      scrollRoot?.addEventListener('scroll', updateCenteredPreview, { passive: true });
    }
    window.addEventListener('resize', schedule);

    const observer = new ResizeObserver(schedule);
    if (scrollRoot) observer.observe(scrollRoot);

    return () => {
      scrollRoot?.removeEventListener('scroll', updateCenteredPreview);
      window.removeEventListener('resize', schedule);
      observer.disconnect();
    };
  }, [isMobile, inset, items, scrollRef, updateCenteredPreview, previewAnchorX]);

  return (
    <>
      <div
        ref={scrollRef}
        className="projects-list-scroll projects-list-scroll--snap pointer-events-auto min-h-0 flex-1 w-full min-w-0 overflow-y-auto overflow-x-hidden hide-scrollbar"
      >
        <div
          className="projects-list"
          style={{
            paddingTop: listPadY,
            paddingBottom: listPadY,
            paddingLeft: inset,
            paddingRight: inset,
          }}
        >
          <ul className="projects-list__items">
            {items.map((project) => (
              <li key={project.id} className="projects-list__item">
                <button
                  ref={(node) => setItemRef(project.id, node)}
                  type="button"
                  className="projects-list__button"
                  onClick={() => onOpenProject(project.src)}
                  aria-label={`${project.title}. ${messages.aria.projectDetails}`}
                >
                  <span className="projects-list__title">{project.title}</span>
                  <span className="projects-list__tags">{formatTags(project.tags)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {centeredPreview && !isMobile && (
        <div
          className="projects-list-preview"
          style={{
            left: previewLeft,
            top: previewAnchorY - previewSize / 2,
            width: previewSize,
            height: previewSize,
          }}
          aria-hidden
        >
          <ProjectPlaceholder
            src={centeredPreview.project.src}
            objectFit={centeredPreview.project.objectFit}
            alt=""
          />
        </div>
      )}
    </>
  );
}
