import { Fragment } from 'react';
import { createPortal } from 'react-dom';
import type { CubeFaceKey } from '../cubeFaceTags';
import { useLocale } from '../i18n/useLocale';

const OFFSET_X = 14;
const OFFSET_Y = 14;

type Props = {
  face: CubeFaceKey | null;
  clientX: number;
  clientY: number;
};

/* CubeFaceCursorTooltip --------------------------------------------------------------------------*/

export function CubeFaceCursorTooltip({ face, clientX, clientY }: Props) {
  const { messages } = useLocale();

  if (!face) return null;

  const tags = messages.cubeFaces[face];
  if (!tags.length) return null;

  const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
  const pad = 8;
  const estW = Math.min(420, tags.join('').length * 7 + tags.length * 28);
  const estH = 36;
  const left = Math.min(clientX + OFFSET_X, Math.max(pad, vw - estW - pad));
  const top = Math.min(clientY + OFFSET_Y, Math.max(pad, vh - estH - pad));

  return createPortal(
    <div role="tooltip" className="cube-face-tooltip" style={{ left, top }}>
      <div className="cube-face-tooltip__tags">
        {tags.map((tag, i) => (
          <Fragment key={tag}>
            {i > 0 && <span className="cube-face-tooltip__sep" aria-hidden />}
            <span className="cube-face-tooltip__tag">{tag}</span>
          </Fragment>
        ))}
      </div>
    </div>,
    document.body,
  );
}
