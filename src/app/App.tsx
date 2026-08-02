import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocale } from './i18n/useLocale';
import { ContactPanel } from './components/ContactPanel';
import { AboutPage } from './components/AboutPage';
import { ProjectCasePage } from './components/ProjectCasePage';
import { AppHeader } from './components/AppHeader';
import { NavLines } from './components/NavLines';
import { ProjectsGrid } from './components/ProjectsGrid';
import { ProjectsList } from './components/ProjectsList';
import { ProjectsViewToggle } from './components/ProjectsViewToggle';
import { CubeScene } from './components/CubeScene';
import { ABOUT_CUBE_FACE_IMAGES } from './constants/about';
import type { ProjectsDisplayMode } from './projects';
import { VIEW_SWITCH_MS } from './constants/cube';
import { useAppLayout } from './hooks/useAppLayout';
import { useCubeRotation } from './hooks/useCubeRotation';
import { useNavLines } from './hooks/useNavLines';
import { getProjectPage } from './projectPages/registry';
import { useHashRoute } from './hooks/useHashRoute';

export default function App() {
  const { projects, messages } = useLocale();
  const [contactPanelOpen, setContactPanelOpen] = useState(true);
  const [projectsDisplayMode, setProjectsDisplayMode] = useState<ProjectsDisplayMode>('gallery');

  const projectsScrollRef = useRef<HTMLDivElement>(null);
  const projectPageScrollRef = useRef<HTMLDivElement>(null);
  const cubeAnchorRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);

  const layout = useAppLayout();
  const router = useHashRoute();

  const projectsView = router.route.name === 'projects';
  const projectsGalleryView = projectsView && projectsDisplayMode === 'gallery';
  const projectsListView = projectsView && projectsDisplayMode === 'list';
  const aboutView = router.route.name === 'about';
  const activeProjectId = router.route.name === 'project' ? router.route.projectId : null;
  const routeProjectId = router.route.name === 'project' ? router.route.projectId : null;

  const size = layout.cubeSize;
  const isProjectPage = activeProjectId !== null;
  const zoom = projectsGalleryView || aboutView ? layout.minZoom : 1;
  const showCube = size > 0 && !isProjectPage && !projectsListView;

  /* Effects --------------------------------------------------------------------------------------*/

  useEffect(() => {
    if (router.route.name !== 'project') return;
    const id = router.route.projectId;
    const project = projects.find((p) => p.id === id);
    if (!project?.hasPage || !getProjectPage(id, messages)) {
      router.replaceHome();
    }
  }, [router, router.route.name, routeProjectId, projects, messages]);

  useEffect(() => {
    if (activeProjectId === null) return;
    projectPageScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeProjectId]);

  const { rotX, rotY, isTransitioning, onNavLine } = useCubeRotation({
    projectsView,
    aboutView,
    isProjectPage,
  });

  const { navLines, cubeOffset, navCx, navCy } = useNavLines({
    layout,
    size,
    zoom,
    projectsGalleryView,
    projectsScrollRef,
    cubeAnchorRef,
    rotX,
    rotY,
  });

  useEffect(() => {
    if (projectsView) {
      const timer = window.setTimeout(() => setContactPanelOpen(false), VIEW_SWITCH_MS);
      return () => window.clearTimeout(timer);
    }
    if (activeProjectId !== null) {
      setContactPanelOpen(false);
      return undefined;
    }
    if (aboutView) {
      setContactPanelOpen(false);
      return undefined;
    }
    return undefined;
  }, [projectsView, activeProjectId, aboutView]);

  const openProjectBySrc = useCallback((src: string) => {
    const project = projects.find((p) => p.src === src);
    if (!project?.hasPage) return;
    router.toProject(project.id);
  }, [router, projects]);

  const activeProject = activeProjectId
    ? projects.find((p) => p.id === activeProjectId) ?? null
    : null;

  const activePage = activeProject ? getProjectPage(activeProject.id, messages) : null;
  const activePageHasBottomSlot =
    activePage?.kind === 'case' && activePage.blocks.some((block) => block.slot === 'bottom');

  const cubeSurface = projectsGalleryView ? 'compact' : 'screen';
  const cubeFrontImageSrc = activeProject ? activeProject.src : null;
  const cubeFaceImages = aboutView ? ABOUT_CUBE_FACE_IMAGES : undefined;
  const isHomeView = !projectsView && !aboutView && !isProjectPage;
  const wasAwayFromHomeRef = useRef(!isHomeView);

  useEffect(() => {
    if (projectsView || aboutView || isProjectPage) {
      wasAwayFromHomeRef.current = true;
    }
  }, [projectsView, aboutView, isProjectPage]);

  const showVideoFacePlaceholder = isHomeView && !wasAwayFromHomeRef.current;

  /* Render ---------------------------------------------------------------------------------------*/

  return (
    <div
      data-layout={layout.isMobile ? 'mobile' : 'desktop'}
      className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden"
      style={{
        fontFamily: 'var(--font-site)',
        letterSpacing: 'var(--font-site-letter-spacing)',
        background: '#000000',
      }}
    >
      <AppHeader
        padding={layout.padding}
        isMobile={layout.isMobile}
        projectsView={projectsView}
        hasActiveProjectPage={activeProjectId !== null}
        aboutView={aboutView}
        onGoAbout={() => {
          router.toAbout();
        }}
        onGoHome={() => {
          router.toHome();
        }}
        onGoProjects={() => {
          router.toProjects();
        }}
      />

      <div
        data-contact-panel
        className="absolute"
        style={{
          left: layout.padding,
          bottom: layout.padding,
          zIndex: 41,
          pointerEvents: 'none',
        }}
      >
        <ContactPanel open={contactPanelOpen} onOpenChange={setContactPanelOpen} />
      </div>

      <main
        id="main-content"
        className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      >
      <NavLines
        navLines={navLines}
        isProjectPage={isProjectPage}
        aboutView={aboutView}
        isMobile={layout.isMobile}
        navLinesInactive={projectsListView}
        navLinesBehindContent={projectsListView}
        navLinesMaskLikeAbout={projectsListView}
        showBottomNavLine={
          aboutView || !isProjectPage || (activePageHasBottomSlot && !layout.isMobile)
        }
        onNavLine={onNavLine}
      />

      <div
        className="pointer-events-none relative z-[10] flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
        style={{ isolation: 'isolate' }}
      >
        {projectsGalleryView ? (
          <ProjectsGrid
            scrollRef={projectsScrollRef}
            cubeAnchorRef={cubeAnchorRef}
            isCompactMobile={layout.isCompactMobile}
            gridWidth={layout.gridWidth}
            gridCols={layout.gridCols}
            gridRows={layout.gridRows}
            cellSize={layout.cellSize}
            gap={layout.gap}
            centerRow={layout.centerRow}
            centerCol={layout.centerCol}
            projectsGridPaddingTop={layout.projectsGridPaddingTop}
            projectsGridPaddingBottom={layout.projectsGridPaddingBottom}
            projectsGridScrollInitial={layout.projectsGridScrollInitial}
            totalGridRows={layout.totalGridRows}
            ringItemByCell={layout.ringItemByCell}
            overflowByCell={layout.overflowByCell}
            onOpenProject={openProjectBySrc}
          />
        ) : projectsListView ? (
          <ProjectsList
            scrollRef={projectsScrollRef}
            inset={layout.padding}
            previewSize={layout.cellSize}
            previewAnchorX={navCx}
            previewAnchorY={navCy}
            isMobile={layout.isMobile}
            onOpenProject={openProjectBySrc}
          />
        ) : aboutView ? (
          <AboutPage
            isMobile={layout.isMobile}
            isCompactMobile={layout.isCompactMobile}
            inset={layout.padding}
            photoSize={layout.cellSize}
            navCy={navCy}
            viewportWidth={layout.viewportSize.width}
            viewportHeight={layout.viewportSize.height}
          />
        ) : isProjectPage && activeProject && activePage?.kind === 'case' ? (
          <div
            ref={projectPageScrollRef}
            className={`pointer-events-auto min-h-0 flex-1 w-full min-w-0 overflow-x-hidden ${
              !layout.isMobile ? 'overflow-hidden' : 'overflow-y-auto'
            } hide-scrollbar`}
                style={{
              scrollbarGutter: 'auto',
              contain: 'content',
            }}
          >
            <div style={{ height: '100%', minHeight: '100vh' }}>
              <ProjectCasePage
                project={activeProject}
                blocks={activePage.blocks}
                navCx={navCx}
                navCy={navCy}
                viewportWidth={layout.viewportSize.width}
                viewportHeight={layout.viewportSize.height}
                isMobile={layout.isMobile}
                inset={layout.padding}
              />
            </div>
          </div>
        ) : (
          <div className="pointer-events-none min-h-0 flex-1" aria-hidden />
        )}
      </div>

      {showCube && (
        <CubeScene
              cubeRef={cubeRef}
              size={size}
              rotX={rotX}
              rotY={rotY}
              isTransitioning={isTransitioning}
              surface={cubeSurface}
              frontImageSrc={aboutView ? null : cubeFrontImageSrc}
              faceImageByType={cubeFaceImages}
          faceTooltipsEnabled={!layout.isMobile && !aboutView}
          showVideoFacePlaceholder={showVideoFacePlaceholder}
          translateX={cubeOffset.x}
          translateY={cubeOffset.y}
          zoom={zoom}
          animateTransition
          interactive={!projectsView && !aboutView}
          zIndex={aboutView ? 12 : 16}
        />
      )}

      {projectsView && (
        <ProjectsViewToggle
          padding={layout.padding}
          isMobile={layout.isMobile}
          mode={projectsDisplayMode}
          onModeChange={setProjectsDisplayMode}
        />
      )}
      </main>
    </div>
  );
}
