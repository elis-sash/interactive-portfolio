import { Fragment, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import {
  PANEL_CONTENT_WIDTH_PX,
  PANEL_FOOTER_GAP_PX,
  PANEL_INNER_PAD_X,
  CONTACT_TAGS_NARROW_BREAKPOINT_PX,
} from '../constants/contactPanel';
import { ContactTags } from './ContactTags';
import { useLocale } from '../i18n/useLocale';
import type { Locale } from '../i18n/types';
import { PUBLIC_ASSETS_BASE } from '../projectAssets';
import { getSeparatorWidth } from '../utils/tagRows';

const SOCIAL_ICONS = `${PUBLIC_ASSETS_BASE}/icons/social`;

/* Config -----------------------------------------------------------------------------------------*/

type FooterLink =
  | { kind: 'text'; id: string; label: string; href: string }
  | { kind: 'icon'; id: string; label: string; href: string; src: string };

function getPortfolioLink(locale: Locale): FooterLink {
  if (locale === 'ru') {
    return {
      kind: 'icon',
      id: 'dprofile',
      href: 'https://dprofile.ru/elissash',
      label: 'Dprofile',
      src: `${SOCIAL_ICONS}/dprofile.svg`,
    };
  }

  return {
    kind: 'icon',
    id: 'behance',
    href: 'https://www.behance.net/elissash',
    label: 'Behance',
    src: `${SOCIAL_ICONS}/behance.svg`,
  };
}

const MAIL_HREF =
  'https://mail.google.com/mail/?view=cm&to=elisa.sashenkova@gmail.com';

function getCvHref(locale: Locale): string {
  return locale === 'ru'
    ? `${PUBLIC_ASSETS_BASE}/cv-ru.pdf`
    : `${PUBLIC_ASSETS_BASE}/cv-eng.pdf`;
}

function getFooterLinks(locale: Locale): readonly FooterLink[] {
  return [
    { kind: 'text', id: 'cv', label: 'CV', href: getCvHref(locale) },
    { kind: 'text', id: 'mail', label: 'MAIL', href: MAIL_HREF },
    {
      kind: 'icon',
      id: 'telegram',
      href: 'https://t.me/elislsash',
      label: 'Telegram',
      src: `${SOCIAL_ICONS}/telegram.svg`,
    },
    {
      kind: 'icon',
      id: 'linkedin',
      href: 'https://www.linkedin.com/in/elisash/',
      label: 'LinkedIn',
      src: `${SOCIAL_ICONS}/linkedin.svg`,
    },
    {
      kind: 'icon',
      id: 'github',
      href: 'https://github.com/elis-sash',
      label: 'GitHub',
      src: `${SOCIAL_ICONS}/github.svg`,
    },
    getPortfolioLink(locale),
  ];
}

type ContactPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/* Measure helpers --------------------------------------------------------------------------------*/

function measureItemsWidth(
  items: NodeListOf<HTMLElement>,
  sepWidth: number,
): number {
  if (items.length === 0) return 0;
  const itemsWidth = Array.from(items).reduce((sum, item) => sum + item.offsetWidth, 0);
  return itemsWidth + sepWidth * Math.max(0, items.length - 1);
}

function measureItemsWithSeps(
  items: NodeListOf<HTMLElement>,
  seps: NodeListOf<HTMLElement>,
): number {
  let width = 0;
  items.forEach((item, index) => {
    if (index > 0) width += seps[index - 1]?.offsetWidth ?? 0;
    width += item.offsetWidth;
  });
  return width;
}

/* ContactPanel -----------------------------------------------------------------------------------*/

export function ContactPanel({ open, onOpenChange }: ContactPanelProps) {
  const { locale, messages } = useLocale();
  const panelRef = useRef<HTMLDivElement>(null);
  const infoTags = messages.contactPanel.tags;
  const footerLinks = useMemo(() => getFooterLinks(locale), [locale]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return undefined;

    const syncWidth = () => {
      const maxWidth = Math.min(640, window.innerWidth - 32);
      if (maxWidth >= PANEL_CONTENT_WIDTH_PX) {
        panel.style.setProperty('--panel-content-width', `${PANEL_CONTENT_WIDTH_PX}px`);
        return;
      }

      const role = panel.querySelector<HTMLElement>('.contact-panel__role');
      const roleW = role?.offsetWidth ?? 0;

      const tagEls = panel.querySelectorAll<HTMLElement>(
        '.contact-panel__tags-measure [data-tag-measure]',
      );
      const tagSep = panel.querySelector<HTMLElement>(
        '.contact-panel__tags-measure [data-sep-measure]',
      );
      const tagsW = measureItemsWidth(tagEls, getSeparatorWidth(tagSep));

      const infoW = Math.max(roleW, tagsW) + PANEL_INNER_PAD_X;

      const toggle = panel.querySelector<HTMLElement>('.contact-panel__toggle');
      const toggleW = toggle?.offsetWidth ?? 34;
      const linkEls = panel.querySelectorAll<HTMLElement>(
        '.contact-panel__links-measure [data-link-measure]',
      );
      const linkSeps = panel.querySelectorAll<HTMLElement>(
        '.contact-panel__links-measure .contact-panel__links-sep',
      );
      const linksW = measureItemsWithSeps(linkEls, linkSeps);
      const footerW = toggleW + PANEL_FOOTER_GAP_PX + linksW;

      const contentW = Math.min(Math.max(infoW, footerW), maxWidth);
      panel.style.setProperty('--panel-content-width', `${contentW}px`);
    };

    let frameId = 0;
    const scheduleSync = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(syncWidth);
    };

    syncWidth();
    window.addEventListener('resize', scheduleSync);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', scheduleSync);
      panel.style.removeProperty('--panel-content-width');
    };
  }, [footerLinks]);

  return (
    <div ref={panelRef} className="contact-panel" style={{ pointerEvents: 'none' }}>
      <div
        id="contact-panel-popover"
        role="region"
        aria-label={messages.contactPanel.regionLabel}
        aria-hidden={!open}
        className={`contact-panel__info ${open ? 'is-open' : 'is-closed'}`}
      >
        <div className="contact-panel__info-inner">
          <p className="contact-panel__role ui-brand-title">{messages.contactPanel.role}</p>
          <ContactTags
            tags={infoTags}
            narrowBreakpoint={CONTACT_TAGS_NARROW_BREAKPOINT_PX}
            narrowTopRow={['branding', 'web']}
          />
        </div>
      </div>

      <div className={`contact-panel__footer ${open ? '' : 'is-compact'}`}>
        <div className="contact-panel__links-measure" aria-hidden>
          {footerLinks.map((item, i) => (
            <Fragment key={item.id}>
              {i > 0 && <span className="contact-panel__links-sep" aria-hidden />}
              <span data-link-measure className="contact-panel__links-item">
                {item.kind === 'text' ? (
                  <span className="contact-panel__link">{item.label}</span>
                ) : (
                  <span
                    className="contact-panel__link contact-panel__link--icon"
                    data-icon={item.id}
                  >
                    <img className="contact-panel__icon" src={item.src} alt="" height={14} />
                  </span>
                )}
              </span>
            </Fragment>
          ))}
        </div>

        <button
          type="button"
          className="contact-panel__toggle"
          aria-label={open ? messages.contactPanel.hideInfo : messages.contactPanel.showInfo}
          aria-expanded={open}
          aria-controls="contact-panel-popover"
          onClick={() => onOpenChange(!open)}
        >
          <svg
            className={`contact-panel__toggle-icon ${open ? 'is-open' : ''}`}
            width={22}
            height={22}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <rect x="7" y="15" width="2" height="2" fill="#0B0B0B" />
            <rect x="15" y="15" width="2" height="2" fill="#0B0B0B" />
            <rect x="23" y="15" width="2" height="2" fill="#0B0B0B" />
          </svg>
        </button>

        <nav
          aria-label={messages.contactPanel.linksNav}
          className={`contact-panel__links uppercase text-[11px] ${open ? 'is-open' : 'is-closed'}`}
        >
          <span className="contact-panel__links-spacer" aria-hidden />
          {footerLinks.map((item, i) => (
            <Fragment key={item.id}>
              {i > 0 && (
                <>
                  <span className="contact-panel__links-sep" aria-hidden />
                  <span className="contact-panel__links-spacer" aria-hidden />
                </>
              )}
              <span className="contact-panel__links-item">
                {item.kind === 'text' ? (
                  <a
                    className="contact-panel__link"
                    href={item.href}
                    {...(item.id === 'mail'
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {item.label}
                  </a>
                ) : (
                  <a
                    className="contact-panel__link contact-panel__link--icon"
                    data-icon={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                  >
                    <img className="contact-panel__icon" src={item.src} alt="" height={14} />
                  </a>
                )}
              </span>
              <span className="contact-panel__links-spacer" aria-hidden />
            </Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
}
