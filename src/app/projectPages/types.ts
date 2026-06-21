/* Types ------------------------------------------------------------------------------------------*/

export type ProjectPageKind = 'case';

export type ProjectBlockMeta =
  | {
      id: string;
      type: 'video';
      src: string;
      slot?: 'top' | 'bottom';
      objectFit?: 'cover' | 'contain';
    }
  | {
      id: string;
      type: 'image';
      src: string;
      width: number;
      height: number;
      slot?: 'top' | 'bottom';
    }
  | {
      id: string;
      type: 'text';
      slot?: 'top' | 'bottom';
      surface?: boolean;
    };

export type ProjectFeedBlock =
  | {
      id: string;
      type: 'video';
      src: string;
      slot?: 'top' | 'bottom';
      objectFit?: 'cover' | 'contain';
    }
  | {
      id: string;
      type: 'image';
      src: string;
      alt: string;
      width: number;
      height: number;
      slot?: 'top' | 'bottom';
    }
  | {
      id: string;
      type: 'text';
      lead: string;
      body: string;
      slot?: 'top' | 'bottom';
      surface?: boolean;
    };

export type ProjectPageConfig =
  | {
      kind: 'case';
      blocks: readonly ProjectFeedBlock[];
    };
