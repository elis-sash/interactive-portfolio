import { useLocale } from '../i18n/useLocale';
import type { NavLineBundle, NavLineSeg } from '../types/nav';

type NavLinesProps = {
  navLines: NavLineBundle | null;
  isProjectPage: boolean;
  aboutView?: boolean;
  isMobile: boolean;
  showBottomNavLine?: boolean;
  navLinesInactive?: boolean;
  navLinesBehindContent?: boolean;
  navLinesMaskLikeAbout?: boolean;
  onNavLine: (dir: 'up' | 'down' | 'left' | 'right') => void;
};

function lineStyle(segment: NavLineSeg, zIndex: number) {
  return {
    position: 'fixed' as const,
    left: segment.left,
    top: segment.top,
    width: segment.width,
    height: segment.height,
    cursor: 'pointer' as const,
    zIndex,
    border: 'none' as const,
    padding: 0,
    margin: 0,
    background: 'transparent',
    pointerEvents: 'auto' as const,
    touchAction: 'manipulation' as const,
    WebkitTapHighlightColor: 'transparent',
    outline: 'none',
    boxShadow: 'none',
  };
}

function innerLine(vertical: boolean) {
  return {
    position: 'absolute' as const,
    ...(vertical
      ? { left: '50%', top: 0, width: 1, height: '100%', transform: 'translateX(-50%)' }
      : { top: '50%', left: 0, height: 1, width: '100%', transform: 'translateY(-50%)' }),
    background: 'var(--ui-nav-line)',
    pointerEvents: 'none' as const,
  };
}

export function NavLines({
  navLines,
  isProjectPage,
  aboutView = false,
  isMobile,
  showBottomNavLine = true,
  navLinesInactive = false,
  navLinesBehindContent = false,
  navLinesMaskLikeAbout = false,
  onNavLine,
}: NavLinesProps) {
  const { messages } = useLocale();
  const isInactive = isProjectPage || navLinesInactive;
  const navLineZ = navLinesBehindContent
    ? navLinesMaskLikeAbout && !isMobile
      ? 9
      : 1
    : aboutView && !isMobile
      ? 9
      : isInactive
        ? isMobile
          ? 1
          : 12
        : 8;
  const pointerEvents = isInactive ? ('none' as const) : ('auto' as const);

  if (!navLines) return null;
  if (isProjectPage && isMobile) return null;

  return (
    <>
      {navLines.top.height > 4 && (
        <button
          type="button"
          data-nav-line
          tabIndex={-1}
          aria-label={messages.aria.rotateUp}
          onClick={() => onNavLine('up')}
          style={{ ...lineStyle(navLines.top, navLineZ), pointerEvents }}
        >
          <span style={innerLine(true)} />
        </button>
      )}
      {navLines.bottom.height > 4 && showBottomNavLine && (
        <button
          type="button"
          data-nav-line
          tabIndex={-1}
          aria-label={messages.aria.rotateDown}
          onClick={() => onNavLine('down')}
          style={{ ...lineStyle(navLines.bottom, navLineZ), pointerEvents }}
        >
          <span style={innerLine(true)} />
        </button>
      )}
      {navLines.left.width > 4 && (
        <button
          type="button"
          data-nav-line
          tabIndex={-1}
          aria-label={messages.aria.rotateLeft}
          onClick={() => onNavLine('left')}
          style={{ ...lineStyle(navLines.left, navLineZ), pointerEvents }}
        >
          <span style={innerLine(false)} />
        </button>
      )}
      {navLines.right.width > 4 && (
        <button
          type="button"
          data-nav-line
          tabIndex={-1}
          aria-label={messages.aria.rotateRight}
          onClick={() => onNavLine('right')}
          style={{
            ...lineStyle(navLines.right, navLineZ),
            pointerEvents,
            opacity: isProjectPage ? 0 : 1,
          }}
        >
          <span style={innerLine(false)} />
        </button>
      )}
    </>
  );
}
