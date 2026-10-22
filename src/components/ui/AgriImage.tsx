"use client";

import React, { useState } from "react";

interface AgriImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  aspectRatio?: "square" | "video" | "card" | "banner" | "wide";
  lazy?: boolean;
}

const LOCAL_FALLBACK = "/images/fallback.jpg";
const REMOTE_FALLBACK =
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80";

/**
 * AgriImage – A reusable agricultural image component with:
 * - Local-first loading with graceful fallback on error
 * - Lazy loading below viewport
 * - Consistent aspect ratio options
 * - Accessible alt text
 * - Clean hover zoom effect
 */
export function AgriImage({
  src,
  alt,
  className = "",
  fallbackSrc = LOCAL_FALLBACK,
  aspectRatio = "card",
  lazy = true,
}: AgriImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [errorCount, setErrorCount] = useState(0);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    card: "aspect-[4/3]",
    banner: "aspect-[21/9]",
    wide: "aspect-[16/9]",
  };

  const handleError = () => {
    if (errorCount === 0) {
      setErrorCount(1);
      setImgSrc(fallbackSrc);
    } else if (errorCount === 1) {
      setErrorCount(2);
      setImgSrc(REMOTE_FALLBACK);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-stone-100 ${aspectClasses[aspectRatio]} ${className}`}
    >
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

      <img
        src={imgSrc}
        alt={alt}
        loading={lazy ? "lazy" : "eager"}
        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        onError={handleError}
      />
    </div>
  );
}

/**
 * AgriImageBadge – Decorative agricultural icon badge / thumbnail (small inline use)
 */
interface AgriImageBadgeProps {
  src: string;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function AgriImageBadge({
  src,
  alt,
  size = "md",
  className = "",
}: AgriImageBadgeProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  const sizeClasses = {
    xs: "w-8 h-8",
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg overflow-hidden border border-stone-200 shrink-0 bg-stone-100 ${className}`}
    >
      <img
        src={failed ? "/images/fallback.jpg" : imgSrc}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover"
        onError={() => {
          if (!failed) {
            setFailed(true);
            setImgSrc("/images/fallback.jpg");
          }
        }}
      />
    </div>
  );
}
