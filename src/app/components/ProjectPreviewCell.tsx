import { useLocale } from '../i18n/useLocale';
import type { ProjectItem } from '../projects';
import { PreviewCellTags } from './PreviewCellTags';
import { ProjectPlaceholder } from './ProjectPlaceholder';

type ProjectPreviewCellProps = {
  project: ProjectItem;
  onOpen: () => void;
};

export function ProjectPreviewCell({ project, onOpen }: ProjectPreviewCellProps) {
  const { messages } = useLocale();

  return (
    <div
      className="project-preview-cell"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      aria-label={`${project.title}. ${messages.aria.projectDetails}`}
    >
      <div className="project-preview-cell__media" aria-hidden>
        <ProjectPlaceholder src={project.src} objectFit={project.objectFit} alt="" />
      </div>

      <div className="project-preview-cell__panel" aria-hidden>
        <h3 className="project-preview-cell__title ui-brand-title">{project.title}</h3>
        <p className="project-preview-cell__description ui-nav-text ui-nav-text--body">
          {project.description}
        </p>
        <PreviewCellTags tags={project.tags} tagRows={project.previewTagRows} />
      </div>
    </div>
  );
}
