import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { RefObject } from 'react';
import { CubeFace } from './CubeFace';
import { getVisibleCubeFace } from '../cubeFaceTags';
import type { CubeFaceKey } from '../cubeFaceTags';
import { CubeFaceCursorTooltip } from './CubeFaceCursorTooltip';
import {
  CUBE_FACE_NUMBERS,
  CUBE_FACE_ORDER,
  CUBE_FACE_VIDEOS,
  CUBE_TRANSITION_MS,
} from '../constants/cube';

const FACE_MEDIA_STYLE = {
  width: '100%',
  height: '100%',
  objectFit: 'cover' as const,
  backgroundColor: 'transparent',
};

type CubeStackProps = {
  cubeRef: RefObject<HTMLDivElement | null>;
  size: number;
  rotX: number;
  rotY: number;
  isTransitioning: boolean;
  surface: 'screen' | 'compact';
  frontImageSrc?: string | null;
  faceImageByType?: Partial<Record<CubeFaceKey, string>>;
  faceTooltipsEnabled?: boolean;
  showVideoFacePlaceholder?: boolean;
};

function FaceImage({ src }: { src: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundImage: `url('${src}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}
    />
  );
}

function FaceVideo({
  src,
  remountKey,
  showFaceColorUntilReady,
}: {
  src: string;
  remountKey?: boolean;
  showFaceColorUntilReady: boolean;
}) {
  const [ready, setReady] = useState(!showFaceColorUntilReady);

  useEffect(() => {
    setReady(!showFaceColorUntilReady);
  }, [src, showFaceColorUntilReady]);

  const markReady = useCallback(() => {
    setReady(true);
  }, []);

  const bindVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      if (!showFaceColorUntilReady) return;
      if (node && node.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        setReady(true);
      }
    },
    [src, showFaceColorUntilReady],
  );

  return (
    <video
      key={remountKey ? src : undefined}
      ref={bindVideoRef}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      onLoadedData={showFaceColorUntilReady ? markReady : undefined}
      onCanPlay={showFaceColorUntilReady ? markReady : undefined}
      style={{
        ...FACE_MEDIA_STYLE,
        backgroundColor: showFaceColorUntilReady ? 'transparent' : '#000000',
        opacity: ready ? 1 : 0,
      }}
    />
  );
}

function renderFaceContent(
  type: CubeFaceKey,
  surface: 'screen' | 'compact',
  frontImageSrc: string | null | undefined,
  faceImageByType: Partial<Record<CubeFaceKey, string>> | undefined,
  showVideoFacePlaceholder: boolean,
) {
  const imageSrc = faceImageByType?.[type];
  if (imageSrc) return <FaceImage src={imageSrc} />;

  if (surface !== 'screen') return null;

  if (type === 'front' && frontImageSrc) {
    if (frontImageSrc.toLowerCase().endsWith('.svg')) {
      return (
        <img
          src={frontImageSrc}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            display: 'block',
            backgroundColor: '#000000',
          }}
        />
      );
    }
    return <FaceImage src={frontImageSrc} />;
  }

  return (
    <FaceVideo
      src={CUBE_FACE_VIDEOS[type]}
      remountKey={type === 'right'}
      showFaceColorUntilReady={showVideoFacePlaceholder}
    />
  );
}

export function CubeStack({
  cubeRef,
  size,
  rotX,
  rotY,
  isTransitioning,
  surface,
  frontImageSrc,
  faceImageByType,
  faceTooltipsEnabled = true,
  showVideoFacePlaceholder = false,
}: CubeStackProps) {
  const tz = size / 2;
  const face = {
    width: size,
    height: size,
    translateZ: tz,
    rotX,
    rotY,
    surface,
  };
  const showFaceTags = surface === 'screen' && faceTooltipsEnabled;
  const visibleFace = useMemo(() => getVisibleCubeFace(rotX, rotY), [rotX, rotY]);
  const [tooltipActive, setTooltipActive] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const pointerOverCubeRef = useRef(false);

  const syncTooltipPointer = useCallback((clientX: number, clientY: number) => {
    setTooltipPos({ x: clientX, y: clientY });
    setTooltipActive(true);
  }, []);

  useEffect(() => {
    if (!showFaceTags || !pointerOverCubeRef.current) return;
    setTooltipActive(true);
  }, [visibleFace, showFaceTags]);

  return (
    <>
      <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
        <div
          ref={cubeRef}
          className="relative"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transition: isTransitioning
              ? `transform ${CUBE_TRANSITION_MS}ms cubic-bezier(0.77, 0, 0.175, 1)`
              : 'none',
            pointerEvents: 'none',
          }}
          data-cube
        >
          {CUBE_FACE_ORDER.map((type) => (
            <CubeFace
              key={type}
              type={type}
              gridStyle="flat"
              faceNumber={CUBE_FACE_NUMBERS[type]}
              {...face}
            >
              {renderFaceContent(
                type,
                surface,
                frontImageSrc,
                faceImageByType,
                showVideoFacePlaceholder,
              )}
            </CubeFace>
          ))}
        </div>
        {showFaceTags && (
          <div
            className="absolute inset-0 z-20"
            style={{ pointerEvents: 'auto', background: 'transparent' }}
            aria-hidden
            onPointerEnter={(e) => {
              pointerOverCubeRef.current = true;
              syncTooltipPointer(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => syncTooltipPointer(e.clientX, e.clientY)}
            onPointerLeave={() => {
              pointerOverCubeRef.current = false;
              setTooltipActive(false);
            }}
          />
        )}
      </div>
      <CubeFaceCursorTooltip
        face={tooltipActive ? visibleFace : null}
        clientX={tooltipPos.x}
        clientY={tooltipPos.y}
      />
    </>
  );
}
