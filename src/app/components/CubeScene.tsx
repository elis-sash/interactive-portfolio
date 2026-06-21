import type { RefObject } from 'react';
import type { CubeFaceKey } from '../cubeFaceTags';
import { CubeStack } from './CubeStack';
import { VIEW_SWITCH_EASE, VIEW_SWITCH_MS } from '../constants/cube';

type CubeSceneProps = {
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
  translateX: number;
  translateY: number;
  zoom: number;
  animateTransition: boolean;
  interactive?: boolean;
  zIndex?: number;
};

export function CubeScene({
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
  translateX,
  translateY,
  zoom,
  animateTransition,
  interactive = true,
  zIndex = 16,
}: CubeSceneProps) {
  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{ perspective: '2000px', perspectiveOrigin: '50% 50%', zIndex }}
    >
      <div
        className={`${interactive ? 'pointer-events-auto' : 'pointer-events-none'} absolute flex items-center justify-center`}
        style={{
          left: '50%',
          top: '50%',
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${zoom})`,
          transition: animateTransition ? `transform ${VIEW_SWITCH_MS}ms ${VIEW_SWITCH_EASE}` : 'none',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <CubeStack
          cubeRef={cubeRef}
          size={size}
          rotX={rotX}
          rotY={rotY}
          isTransitioning={isTransitioning}
          surface={surface}
          frontImageSrc={frontImageSrc}
          faceImageByType={faceImageByType}
          faceTooltipsEnabled={faceTooltipsEnabled}
          showVideoFacePlaceholder={showVideoFacePlaceholder}
        />
      </div>
    </div>
  );
}
