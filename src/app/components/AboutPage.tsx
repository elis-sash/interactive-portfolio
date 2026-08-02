import { useLocale } from '../i18n/useLocale';
import { fixAboutParagraph } from '../utils/text';

function getAboutTextGap(
  viewportWidth: number,
  viewportHeight: number,
  isMobile: boolean,
  isCompactMobile: boolean,
): number {
  const isPortrait = viewportHeight > viewportWidth;

  if (isPortrait) {
    if (isCompactMobile) return 14;
    if (isMobile) return 12;
    return 18;
  }

  if (isMobile) return 24;
  return 36;
}

type AboutPageProps = {
  isMobile: boolean;
  isCompactMobile: boolean;
  inset: number;
  photoSize: number;
  navCy: number;
  viewportWidth: number;
  viewportHeight: number;
};

export function AboutPage({
  isMobile,
  isCompactMobile,
  inset,
  photoSize,
  navCy,
  viewportWidth,
  viewportHeight,
}: AboutPageProps) {
  const { messages } = useLocale();
  const displaySize = photoSize;
  const half = displaySize / 2;
  const textGap = getAboutTextGap(viewportWidth, viewportHeight, isMobile, isCompactMobile);
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
