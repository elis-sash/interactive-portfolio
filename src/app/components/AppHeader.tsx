import { useLocale } from '../i18n/useLocale';

type AppHeaderProps = {
  padding: number;
  isMobile: boolean;
  projectsView: boolean;
  hasActiveProjectPage: boolean;
  aboutView: boolean;
  onGoAbout: () => void;
  onGoHome: () => void;
  onGoProjects: () => void;
};

export function AppHeader({
  padding,
  isMobile,
  projectsView,
  hasActiveProjectPage,
  aboutView,
  onGoAbout,
  onGoHome,
  onGoProjects,
}: AppHeaderProps) {
  const { messages } = useLocale();
  const isHomeActive = !projectsView && !hasActiveProjectPage && !aboutView;

  return (
    <>
      <div
        data-app-header
        className="absolute flex items-center justify-between"
        style={{
          top: padding,
          left: padding,
          right: padding,
          height: 34,
          pointerEvents: 'none',
        }}
      >
        <button
          type="button"
          data-app-brand
          className={`app-brand ${isMobile ? 'app-brand--mobile' : 'app-brand--desktop'}`}
          onClick={onGoAbout}
          aria-label={messages.nav.about}
          style={{ pointerEvents: 'auto' }}
        >
          <span className="app-brand__text">ES</span>
          <span className="app-brand__hover-marker" aria-hidden />
        </button>

        <div
          className={`app-nav-tabs relative z-40 flex items-stretch border ${isMobile ? 'app-nav-tabs--mobile' : 'app-nav-tabs--desktop'}`}
          style={{ pointerEvents: 'auto' }}
          data-app-nav-tabs
          data-active={projectsView || hasActiveProjectPage ? 'projects' : 'home'}
        >
          <button
            type="button"
            data-app-nav-button
            data-app-nav="home"
            onClick={onGoHome}
            className="app-nav-button uppercase text-[11px] transition-colors"
          >
            <span aria-hidden className="app-nav-button__marker-slot">
              <span className={`app-nav-marker ${isHomeActive ? 'is-active' : ''}`} />
            </span>
            <span>{messages.nav.home}</span>
          </button>
          <div aria-hidden className="app-nav-sep" />
          <button
            type="button"
            data-app-nav-button
            data-app-nav="projects"
            onClick={onGoProjects}
            className="app-nav-button uppercase text-[11px] transition-colors"
          >
            <span aria-hidden className="app-nav-button__marker-slot">
              <span className={`app-nav-marker ${projectsView ? 'is-active' : ''}`} />
            </span>
            <span>{messages.nav.projects}</span>
          </button>
        </div>
      </div>
    </>
  );
}
