import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CUBE_AUTO_FACE_SEQUENCE,
  CUBE_AUTO_INTERVAL_MS,
  CUBE_TRANSITION_MS,
  FACE_MAP,
  normalizeAngle,
} from '../constants/cube';

type Params = {
  projectsView: boolean;
  aboutView: boolean;
  isProjectPage: boolean;
};

export function useCubeRotation({ projectsView, aboutView, isProjectPage }: Params) {
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cubeAutoRotateDisabled, setCubeAutoRotateDisabled] = useState(false);

  const cubeAutoFaceIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const rotateToRef = useRef<(nx: number, ny: number) => void>(() => {});
  const projectsViewRef = useRef(projectsView);
  const aboutViewRef = useRef(aboutView);
  const isProjectPageRef = useRef(isProjectPage);

  projectsViewRef.current = projectsView;
  aboutViewRef.current = aboutView;
  isProjectPageRef.current = isProjectPage;

  useEffect(() => {
    if (!aboutView) return;
    setIsTransitioning(false);
    setRotX(0);
    setRotY(0);
  }, [aboutView]);

  const rotateTo = useCallback(
    (nextX: number, nextY: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setRotX(nextX);
      setRotY(nextY);
      setTimeout(() => setIsTransitioning(false), CUBE_TRANSITION_MS);
    },
    [isTransitioning],
  );

  isTransitioningRef.current = isTransitioning;
  rotateToRef.current = rotateTo;

  const disableCubeAutoRotate = useCallback(() => {
    setCubeAutoRotateDisabled(true);
  }, []);

  const rotateCube = useCallback(
    (dx: number, dy: number) => {
      const currentRotX = normalizeAngle(rotX);
      const currentRotY = normalizeAngle(rotY);

      let direction = '';
      if (dx < 0) direction = 'left';
      else if (dx > 0) direction = 'right';
      else if (dy < 0) direction = 'up';
      else if (dy > 0) direction = 'down';

      const key = `${currentRotX},${currentRotY}`;
      const nextFace = FACE_MAP[key]?.[direction];

      if (nextFace) {
        rotateTo(nextFace[0], nextFace[1]);
      }
    },
    [rotX, rotY, rotateTo],
  );

  const onNavLine = useCallback(
    (dir: 'up' | 'down' | 'left' | 'right') => {
      disableCubeAutoRotate();
      if (dir === 'left') rotateCube(-1, 0);
      else if (dir === 'right') rotateCube(1, 0);
      else if (dir === 'up') rotateCube(0, -1);
      else rotateCube(0, 1);
    },
    [rotateCube, disableCubeAutoRotate],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const cubeKeys = [
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'a',
        'A',
        'd',
        'D',
        'w',
        'W',
        's',
        'S',
      ];
      if (!cubeKeys.includes(e.key)) return;

      e.preventDefault();
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
        if (e.key === 'ArrowLeft') disableCubeAutoRotate();
        rotateCube(-1, 0);
      } else if (['ArrowRight', 'd', 'D'].includes(e.key)) {
        if (e.key === 'ArrowRight') disableCubeAutoRotate();
        rotateCube(1, 0);
      } else if (['ArrowUp', 'w', 'W'].includes(e.key)) {
        if (e.key === 'ArrowUp') disableCubeAutoRotate();
        rotateCube(0, -1);
      } else {
        if (e.key === 'ArrowDown') disableCubeAutoRotate();
        rotateCube(0, 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rotateCube, disableCubeAutoRotate]);

  useEffect(() => {
    if (cubeAutoRotateDisabled) return undefined;
    const id = window.setInterval(() => {
      if (projectsViewRef.current || aboutViewRef.current || isProjectPageRef.current) return;
      const run = () => {
        if (isTransitioningRef.current) {
          window.setTimeout(run, 120);
          return;
        }
        cubeAutoFaceIndexRef.current =
          (cubeAutoFaceIndexRef.current + 1) % CUBE_AUTO_FACE_SEQUENCE.length;
        const [nx, ny] = CUBE_AUTO_FACE_SEQUENCE[cubeAutoFaceIndexRef.current];
        rotateToRef.current(nx, ny);
      };
      run();
    }, CUBE_AUTO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [cubeAutoRotateDisabled]);

  useEffect(() => {
    if (projectsView || aboutView || isProjectPage) return undefined;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const chromeTouchTarget = (t: EventTarget | null) => {
      if (!(t instanceof Element)) return false;
      return !!t.closest('[data-contact-panel]');
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      if (chromeTouchTarget(e.target)) {
        touchStartX = 0;
        touchStartY = 0;
        return;
      }
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchEndX = touchStartX;
      touchEndY = touchStartY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      if (touchStartX === 0 && touchStartY === 0) return;
      touchEndX = e.touches[0].clientX;
      touchEndY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      if (touchStartX === 0 && touchStartY === 0) return;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const minSwipeDistance = 50;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) rotateCube(-1, 0);
          else rotateCube(1, 0);
        }
      } else if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) rotateCube(0, -1);
        else rotateCube(0, 1);
      }
      touchStartX = 0;
      touchStartY = 0;
      touchEndX = 0;
      touchEndY = 0;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [rotateCube, projectsView, isProjectPage]);

  return {
    rotX,
    rotY,
    isTransitioning,
    rotateCube,
    onNavLine,
  };
}
