import { useEffect, useState } from 'react';
import { useLocale } from '../i18n/useLocale';
import type { ProjectsDisplayMode } from '../projects';

type ProjectsViewToggleProps = {
  padding: number;
  isMobile: boolean;
  mode: ProjectsDisplayMode;
  onModeChange: (mode: ProjectsDisplayMode) => void;
};

type RollPhase = {
  from: string;
  to: string;
};

export function ProjectsViewToggle({
  padding,
  isMobile,
  mode,
  onModeChange,
}: ProjectsViewToggleProps) {
  const { messages } = useLocale();
  const labelFor = (value: ProjectsDisplayMode) =>
    value === 'gallery' ? messages.projectsView.gallery : messages.projectsView.list;

  const actionLabelFor = (viewMode: ProjectsDisplayMode) =>
    labelFor(viewMode === 'gallery' ? 'list' : 'gallery');

  const [roll, setRoll] = useState<RollPhase | null>(null);

  useEffect(() => {
    if (!roll) return undefined;
    const timer = window.setTimeout(() => setRoll(null), 300);
    return () => window.clearTimeout(timer);
  }, [roll]);

  const handleToggle = () => {
    const next: ProjectsDisplayMode = mode === 'gallery' ? 'list' : 'gallery';
    setRoll({ from: actionLabelFor(mode), to: actionLabelFor(next) });
    onModeChange(next);
  };

  const label = actionLabelFor(mode);

  return (
    <button
      type="button"
      className={`projects-view-toggle app-nav-tabs border ${isMobile ? 'app-nav-tabs--mobile' : 'app-nav-tabs--desktop'}`}
      style={{
        position: 'absolute',
        right: padding,
        bottom: padding,
        zIndex: 40,
        pointerEvents: 'auto',
      }}
      onClick={handleToggle}
      aria-label={`${label}. ${messages.projectsView.toggle}`}
    >
      <span className="projects-view-toggle__viewport">
        {roll ? (
          <>
            <span className="projects-view-toggle__label projects-view-toggle__label--exit">
              {roll.from}
            </span>
            <span className="projects-view-toggle__label projects-view-toggle__label--enter">
              {roll.to}
            </span>
          </>
        ) : (
          <span className="projects-view-toggle__label">{label}</span>
        )}
      </span>
    </button>
  );
}
