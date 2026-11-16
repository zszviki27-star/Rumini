import {useState} from 'react';
import {Compass} from 'lucide-react';

interface StoryImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  scrim?: boolean;
}

export function StoryImage({
  src,
  alt,
  title,
  className = '',
  scrim = false,
}: StoryImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-[#162338] via-[#1B2B44] to-[#0F172A] text-amber-200/80 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Compass className="w-10 h-10 mb-3 text-amber-400/70" />
        <p className="font-display text-lg text-[#F4EFE6]">{title ?? alt}</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#131F33] ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover block"
      />
      {scrim && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1320]/85 via-[#0B1320]/25 to-transparent"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
