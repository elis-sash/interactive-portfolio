import { useMemo } from 'react';
import type { ProjectItem } from '../projects';
import type { ProjectFeedBlock } from '../projectPages/types';
import { ContactTags } from './ContactTags';
import { ProjectFeed } from './ProjectFeed';
import { linkedText } from '../utils/linkedText';

function TitleExternalIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill="#000000"
      className="project-case-card__title-external-icon"
      aria-hidden
    >
      <path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" />
    </svg>
  );
}

function ProjectCaseTitle({ project }: { project: ProjectItem }) {
  if (project.titleUrl) {
    return (
      <a
        href={project.titleUrl}
        className="ui-brand-title project-case-card__title-link"
        target="_blank"
        rel="noreferrer noopener"
      >
        <span className="project-case-card__title-text">{project.title}</span>
        <TitleExternalIcon />
      </a>
    );
  }

  return (
    <div className="ui-brand-title project-case-card__title" style={{ marginBottom: 14 }}>
      {project.title}
    </div>
  );
}

type Props = {
  project: ProjectItem;
  blocks: readonly ProjectFeedBlock[];
  navCx: number;
  navCy: number;
  viewportWidth: number;
  viewportHeight: number;
  isMobile: boolean;
  inset: number;
};

export function ProjectCasePage({
  project,
  blocks,
  navCx,
  navCy,
  viewportWidth,
  viewportHeight,
  isMobile,
  inset,
}: Props) {
  const layout = useMemo(() => {
    const leftW = Math.max(0, Math.min(380, navCx - inset * 2));
    const topH = Math.max(0, navCy - inset * 2);
    const rightW = Math.max(0, viewportWidth - navCx);
    const bottomH = Math.max(0, viewportHeight - navCy);

    const infoX = Math.max(inset, navCx - inset - leftW);
    const infoY = inset;
    return { leftW, topH, rightW, bottomH, infoX, infoY };
  }, [navCx, navCy, viewportWidth, viewportHeight, inset]);

  if (isMobile) {
    const headerOffset = 140;
    return (
      <div className="project-case-page project-case-page--mobile">
        <div
          className="project-case-info-wrap"
          style={{ padding: `0 ${inset}px`, marginTop: headerOffset }}
        >
          <div className="project-case-card" style={{ width: '100%', padding: 18 }}>
            <ProjectCaseTitle project={project} />
            <p className="ui-nav-text ui-nav-text--body" style={{ margin: 0 }}>
              {linkedText(
                project.pageDescription ?? project.description,
                project.pageDescriptionLinks,
              )}
            </p>
            <ContactTags
              tags={project.tags}
              tagRows={project.tagRows}
              className="contact-panel__tags project-case-card__tags uppercase text-[10px] leading-none"
            />
          </div>
        </div>

        <div style={{ marginTop: inset }}>
          <ProjectFeed blocks={blocks} isDesktop={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="project-case-page project-case-page--desktop">
      <div
        className="project-case-card"
        style={{
          position: 'absolute',
          left: layout.infoX,
          top: layout.infoY,
          width: layout.leftW,
          height: layout.topH,
          padding: 18,
          zIndex: 2,
        }}
      >
        <div className="project-case-card__inner">
          <ProjectCaseTitle project={project} />

          <p className="ui-nav-text ui-nav-text--body" style={{ margin: 0, whiteSpace: 'pre-line' }}>
            {linkedText(
              project.pageDescription ?? project.description,
              project.pageDescriptionLinks,
            )}
          </p>

          <ContactTags
            tags={project.tags}
            tagRows={project.tagRows}
            className="contact-panel__tags project-case-card__tags uppercase text-[10px] leading-none"
          />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: navCx,
          top: 0,
          width: layout.rightW,
          height: viewportHeight,
          zIndex: 1,
        }}
      >
        <ProjectFeed blocks={blocks} topSlotHeight={navCy} bottomSlotHeight={layout.bottomH} isDesktop />
      </div>
    </div>
  );
}
