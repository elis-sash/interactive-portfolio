import { useCallback, useEffect, useMemo, useState } from 'react';

/* Types ------------------------------------------------------------------------------------------*/

export type AppRoute =
  | { name: 'home' }
  | { name: 'projects' }
  | { name: 'about' }
  | { name: 'project'; projectId: string };

/* Hash helpers -----------------------------------------------------------------------------------*/

function parseHash(hash: string): AppRoute {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const path = raw.startsWith('/') ? raw : `/${raw}`;

  if (path === '/' || path === '' || path === '/home') return { name: 'home' };
  if (path === '/projects') return { name: 'projects' };
  if (path === '/about') return { name: 'about' };

  const m = path.match(/^\/project\/([^/]+)$/);
  if (m) return { name: 'project', projectId: decodeURIComponent(m[1]) };

  return { name: 'home' };
}

function toHash(route: AppRoute) {
  switch (route.name) {
    case 'home':
      return '#/';
    case 'projects':
      return '#/projects';
    case 'about':
      return '#/about';
    case 'project':
      return `#/project/${encodeURIComponent(route.projectId)}`;
  }
}

function applyRoute(next: AppRoute, mode: 'push' | 'replace', setRoute: (r: AppRoute) => void) {
  const h = toHash(next);
  if (mode === 'replace') {
    const url = `${window.location.pathname}${window.location.search}${h}`;
    history.replaceState(null, '', url);
    setRoute(next);
    return;
  }
  window.location.hash = h;
}

/* useHashRoute -----------------------------------------------------------------------------------*/

export function useHashRoute() {
  const [route, setRoute] = useState<AppRoute>(() => parseHash(window.location.hash));

  useEffect(() => {
    const sync = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  const navigate = useCallback((next: AppRoute, opts?: { replace?: boolean }) => {
    const isTab = next.name === 'home' || next.name === 'projects';
    let mode: 'push' | 'replace';
    if (opts?.replace === true) mode = 'replace';
    else if (opts?.replace === false) mode = 'push';
    else mode = isTab ? 'replace' : 'push';
    applyRoute(next, mode, setRoute);
  }, []);

  const api = useMemo(
    () => ({
      route,
      toHome: () => navigate({ name: 'home' }),
      toProjects: () => navigate({ name: 'projects' }),
      toAbout: () => navigate({ name: 'about' }),
      toProject: (projectId: string) => navigate({ name: 'project', projectId }),
      replaceHome: () => navigate({ name: 'home' }, { replace: true }),
    }),
    [route, navigate],
  );

  return api;
}
