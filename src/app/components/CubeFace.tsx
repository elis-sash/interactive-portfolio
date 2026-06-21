import type { CSSProperties, ReactNode } from 'react';
import type { CubeFaceKey } from '../cubeFaceTags';

interface CubeFaceProps {
  type: CubeFaceKey;
  gridStyle: 'center' | 'flat' | 'floor';
  faceNumber: string;
  width: number;
  height: number;
  translateZ: number;
  rotX: number;
  rotY: number;
  children?: ReactNode;
  surface?: 'screen' | 'compact';
}

export function CubeFace({
  type,
  width,
  height,
  translateZ,
  rotX,
  rotY,
  children,
}: CubeFaceProps) {
  const getBackgroundStyle = (): CSSProperties => {
    const baseByFace: Record<CubeFaceKey, string> = {
      front: '#B7493A',
      back: '#3F5D77',
      left: '#5E7A5A',
      right: '#C08A3E',
      top: '#8C6A43',
      bottom: '#7A5B6F',
    };
    const base = baseByFace[type];

    return {
      backgroundColor: base,
      backgroundImage: 'none',
      boxShadow: 'none',
    };
  };

  const getTransform = () => {
    switch (type) {
      case 'front':
        return `translateZ(${translateZ}px)`;
      case 'back':
        return `rotateY(180deg) translateZ(${translateZ}px)`;
      case 'left':
        return `rotateY(-90deg) translateZ(${translateZ}px)`;
      case 'right':
        return `rotateY(90deg) translateZ(${translateZ}px)`;
      case 'top':
        return `rotateX(90deg) translateZ(${translateZ}px)`;
      case 'bottom':
        return `rotateX(-90deg) translateZ(${translateZ}px)`;
    }
  };

  const getContentTransform = () => {
    switch (type) {
      case 'front':
        return `rotateX(${-rotX}deg) rotateY(${-rotY}deg)`;
      case 'back':
        return `rotateX(${-rotX}deg) rotateY(${-rotY}deg) rotateY(180deg)`;
      case 'left':
        return `rotateX(${-rotX}deg) rotateY(${-rotY}deg) rotateY(90deg)`;
      case 'right':
        return `rotateX(${-rotX}deg) rotateY(${-rotY}deg) rotateY(-90deg)`;
      case 'top':
        return `rotateX(${-rotX}deg) rotateY(${-rotY}deg) rotateX(-90deg)`;
      case 'bottom':
        return `rotateX(${-rotX}deg) rotateY(${-rotY}deg) rotateX(90deg)`;
    }
  };

  return (
    <div
      data-cube-face={type}
      className="absolute"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: getTransform(),
        overflow: 'hidden',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          ...getBackgroundStyle(),
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transform: getContentTransform(),
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}
