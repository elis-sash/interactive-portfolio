import { useEffect, useRef, useState, type RefObject } from 'react';
import type { ProjectFeedBlock } from '../projectPages/types';
import { fixHangingPrepositions } from '../utils/text';

type Props = {
  blocks: readonly ProjectFeedBlock[];
  topSlotHeight?: number;
  bottomSlotHeight?: number;
  isDesktop?: boolean;
};

function VideoBlock({
  block,
  fillSlot,
  scrollRoot,
  observeInViewport,
  isDesktop = false,
}: {
  block: Extract<ProjectFeedBlock, { type: 'video' }>;
  fillSlot?: boolean;
  scrollRoot: RefObject<HTMLElement | null>;
  observeInViewport?: boolean;
  isDesktop?: boolean;
}) {
  const objectFit = isDesktop ? (block.objectFit ?? 'cover') : 'contain';
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const target = wrapRef.current;
    const video = videoRef.current;
    if (!target || !video) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      {
        root: observeInViewport ? null : scrollRoot.current,
        threshold: 0.35,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [scrollRoot, observeInViewport]);

  return (
    <div ref={wrapRef} className="project-feed__video-wrap">
      <video
        ref={videoRef}
        src={block.src}
        muted
        loop
        playsInline
        preload="metadata"
        className={fillSlot ? 'project-feed__video-el' : 'project-feed__video-el project-feed__video-el--flow'}
        style={{ objectFit }}
      />
    </div>
  );
}

function ImageBlock({
  block,
  fillSlot = false,
}: {
  block: Extract<ProjectFeedBlock, { type: 'image' }>;
  fillSlot?: boolean;
}) {
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const w = natural?.w ?? block.width;
  const h = natural?.h ?? block.height;

  return (
    <div className={`project-feed__image${fillSlot ? ' project-feed__image--fill' : ''}`}>
      <img
        src={block.src}
        alt={block.alt}
        width={w}
        height={h}
        sizes="(max-width: 960px) 100vw, 960px"
        srcSet={fillSlot ? undefined : `${block.src} ${w}w`}
        className="project-feed__image-el"
        decoding="async"
        fetchPriority={fillSlot ? 'high' : 'low'}
        onLoad={(e) => {
          const el = e.currentTarget;
          if (el.naturalWidth > 0) setNatural({ w: el.naturalWidth, h: el.naturalHeight });
        }}
      />
    </div>
  );
}

function TextBlock({ block }: { block: Extract<ProjectFeedBlock, { type: 'text' }> }) {
  const inner = (
    <div className="project-feed__text-inner">
      <p className="project-feed__text-lead">{fixHangingPrepositions(block.lead)}</p>
      <p className="project-feed__text-body">{fixHangingPrepositions(block.body)}</p>
    </div>
  );

  if (block.surface ?? true) {
    return <div className="project-feed__text project-feed__text--surface">{inner}</div>;
  }

  return <div className="project-feed__text">{inner}</div>;
}

function renderBlockContent(
  block: ProjectFeedBlock,
  scrollRoot: RefObject<HTMLElement | null>,
  options?: { fillSlot?: boolean; observeInViewport?: boolean; isDesktop?: boolean },
) {
  switch (block.type) {
    case 'video':
      return (
        <VideoBlock
          block={block}
          fillSlot={options?.fillSlot}
          scrollRoot={scrollRoot}
          observeInViewport={options?.observeInViewport}
          isDesktop={options?.isDesktop}
        />
      );
    case 'image':
      return <ImageBlock block={block} fillSlot={options?.fillSlot} />;
    case 'text':
      return <TextBlock block={block} />;
    default:
      return null;
  }
}

export function ProjectFeed({
  blocks,
  topSlotHeight,
  bottomSlotHeight,
  isDesktop = false,
}: Props) {
  const feedRef = useRef<HTMLDivElement>(null);
  const topBlock = blocks.find((b) => b.slot === 'top');
  const bottomBlock = blocks.find((b) => b.slot === 'bottom');
  const extraBlocks = blocks.filter((b) => b.slot !== 'top' && b.slot !== 'bottom');

  if (!isDesktop) {
    return (
      <div ref={feedRef} className="project-feed project-feed--stack hide-scrollbar">
        {blocks.map((block) => (
          <div key={block.id} className="project-feed__item">
            {renderBlockContent(block, feedRef, { observeInViewport: true, isDesktop: false })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={feedRef} className="project-feed hide-scrollbar">
      {topBlock && topSlotHeight != null && topBlock.type === 'video' && (
        <div className="project-feed__slot project-feed__slot--top" style={{ height: topSlotHeight }}>
          <VideoBlock block={topBlock} fillSlot scrollRoot={feedRef} isDesktop />
        </div>
      )}

      {topBlock && topSlotHeight != null && topBlock.type === 'image' && (
        <div className="project-feed__slot project-feed__slot--top" style={{ height: topSlotHeight }}>
          {renderBlockContent(topBlock, feedRef, { fillSlot: true })}
        </div>
      )}

      {bottomBlock && bottomSlotHeight != null && bottomBlock.type === 'text' && (
        <div className="project-feed__slot project-feed__slot--bottom" style={{ minHeight: bottomSlotHeight }}>
          <TextBlock block={bottomBlock} />
        </div>
      )}

      {extraBlocks.length > 0 && (
        <div className="project-feed__extra">
          {extraBlocks.map((block) => (
            <div key={block.id} className="project-feed__item">
              {renderBlockContent(block, feedRef)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
