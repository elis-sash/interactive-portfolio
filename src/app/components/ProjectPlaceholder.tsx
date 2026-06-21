import { useState, type CSSProperties } from 'react';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

interface ProjectPlaceholderProps {
  src: string;
  alt?: string;
  objectFit?: 'cover' | 'contain';
}

const imgStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectPosition: 'center',
  display: 'block',
};

export function ProjectPlaceholder({
  src,
  alt = 'Проект',
  objectFit = 'cover',
}: ProjectPlaceholderProps) {
  const [didError, setDidError] = useState(false);
  const isSvg = src.toLowerCase().endsWith('.svg');
  const fit = objectFit ?? (isSvg ? 'contain' : 'cover');

  if (didError) {
    return (
      <div style={{ ...imgStyle, objectFit: fit, background: '#000' }}>
        <img src={ERROR_IMG_SRC} alt="" style={imgStyle} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{ ...imgStyle, objectFit: fit }}
      decoding="async"
      loading="lazy"
      onError={() => setDidError(true)}
    />
  );
}
