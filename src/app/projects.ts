import { PUBLIC_ASSETS_BASE } from './projectAssets';

/* Types ------------------------------------------------------------------------------------------*/

export type ProjectItem = {
  id: string;
  src: string;
  objectFit?: 'cover' | 'contain';
  title: string;
  tags: readonly string[];
  tagRows?: readonly (readonly string[])[];
  previewTagRows?: readonly (readonly string[])[];
  pageDescription?: string;
  pageDescriptionLinks?: readonly { text: string; href: string }[];
  titleUrl?: string;
  description: string;
  hasPage?: boolean;
};

export type ProjectMeta = {
  id: string;
  src: string;
  objectFit?: 'cover' | 'contain';
  titleUrl?: string;
  hasPage?: boolean;
};

/* Catalog ----------------------------------------------------------------------------------------*/

const BASE = `${PUBLIC_ASSETS_BASE}/projects`;

export const PROJECT_META: readonly ProjectMeta[] = [
  {
    id: 'stop-gallery',
    src: `${BASE}/project-04.svg`,
    objectFit: 'contain',
    titleUrl: 'https://elis-sash.github.io/webgl-gallery/',
    hasPage: true,
  },
  {
    id: 'koziri',
    src: `${BASE}/project-01.svg`,
    objectFit: 'contain',
    hasPage: true,
  },
  {
    id: 'mif',
    src: `${BASE}/project-03.svg`,
    objectFit: 'contain',
    hasPage: true,
  },
  {
    id: 'zus-studio',
    src: `${BASE}/project-05.svg`,
    objectFit: 'contain',
    titleUrl: 'https://zus.studio/',
    hasPage: true,
  },
  {
    id: 'murch',
    src: `${BASE}/project-02.svg`,
    objectFit: 'contain',
    titleUrl: 'https://dprofile.ru/case/156731/murc',
    hasPage: true,
  },
  {
    id: 'max',
    src: `${BASE}/project-06.svg`,
    objectFit: 'contain',
    titleUrl: 'https://dprofile.ru/case/124799/kreativ-na-max-kreativnaia-koncepciia',
    hasPage: true,
  },
];

/** List follows PROJECT_META order (top → bottom). Prepend new projects to PROJECT_META. */
export function projectsForList(projects: readonly ProjectItem[]): ProjectItem[] {
  return [...projects];
}

export type ProjectsDisplayMode = 'gallery' | 'list';
