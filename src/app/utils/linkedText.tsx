import { Fragment, type ReactNode } from 'react';
import { fixHangingPrepositions } from './text';

export type InlineTextLink = { text: string; href: string };

export function linkedText(text: string, links?: readonly InlineTextLink[]): ReactNode {
  if (!links?.length) return fixHangingPrepositions(text);

  const nodes: ReactNode[] = [];
  let remainder = text;
  let key = 0;

  for (const { text: label, href } of links) {
    const idx = remainder.indexOf(label);
    if (idx === -1) continue;
    if (idx > 0) {
      nodes.push(
        <Fragment key={key++}>{fixHangingPrepositions(remainder.slice(0, idx))}</Fragment>,
      );
    }
    nodes.push(
      <a
        key={key++}
        href={href}
        className="project-case-card__link"
        target="_blank"
        rel="noreferrer noopener"
      >
        {label}
      </a>,
    );
    remainder = remainder.slice(idx + label.length);
  }

  if (remainder) {
    nodes.push(<Fragment key={key++}>{fixHangingPrepositions(remainder)}</Fragment>);
  }

  return nodes.length === 1 ? nodes[0] : nodes;
}
