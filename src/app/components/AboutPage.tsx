import { useLocale } from '../i18n/useLocale';
import { fixAboutParagraph } from '../utils/text';

function getAboutTextGap(
  viewportWidth: number,
  viewportHeight: number,
  isMobile: boolean,
): number {
  if (viewportHeight <= viewportWidth) return 42;

  const portraitRatio = viewportHeight / viewportWidth;
  const minGap = isMobile ? 16 : 22;
  const maxGap = 42;
  const t = Math.min(1, portraitRatio - 1);

  return Math.round(maxGap - t * (maxGap - minGap));
}

type AboutPageProps = {
  isMobile: boolean;
  inset: number;
  photoSize: number;
  navCy: number;
  viewportWidth: number;
  viewportHeight: number;
};

export function AboutPage({
  isMobile,
  inset,
  photoSize,
  navCy,
  viewportWidth,
  viewportHeight,
}: AboutPageProps) {
  const { messages } = useLocale();
  const displaySize = isMobile ? Math.min(photoSize, 280) : photoSize;
  const half = displaySize / 2;
  const textGap = getAboutTextGap(viewportWidth, viewportHeight, isMobile);
  const headerBand = inset + 34;
  const topZoneBottom = navCy - half - textGap;
  const bottomZoneTop = navCy + half + textGap;
  const textWidth = Math.min(520, viewportWidth - inset * 2);

  return (
    <div
      className={`about-page pointer-events-none min-h-0 flex-1 w-full min-w-0 ${
        isMobile ? 'about-page--mobile overflow-y-auto hide-scrollbar' : 'overflow-hidden'
      }`}
    >
      <div
        className="about-page__text-zone about-page__text-zone--top"
        style={{
          top: headerBand,
          bottom: viewportHeight - topZoneBottom,
          paddingLeft: inset,
          paddingRight: inset,
        }}
      >
        <p
          className="about-page__text ui-nav-text ui-nav-text--body"
          style={{ width: textWidth }}
        >
          {fixAboutParagraph(messages.about.intro)}
        </p>
      </div>

      <div
        className="about-page__text-zone about-page__text-zone--bottom"
        style={{
          top: bottomZoneTop,
          bottom: inset,
          paddingLeft: inset,
          paddingRight: inset,
        }}
      >
        <p
          className="about-page__text ui-nav-text ui-nav-text--body"
          style={{ width: textWidth }}
        >
          {fixAboutParagraph(messages.about.outro)}
        </p>
      </div>
    </div>
  );
}
