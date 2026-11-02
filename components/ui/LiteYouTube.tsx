"use client";

import { useState } from "react";
import type { Video } from "@/lib/content";

/** Click-to-play YouTube embed: loads only a thumbnail until the visitor presses play (privacy-enhanced domain). */
export function LiteYouTube({ video }: { video: Video }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-bone/10 bg-deep">
      {play ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0 h-full w-full" aria-label={`Play: ${video.title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-bone/90 text-ink transition-transform duration-500 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" aria-hidden><path fill="currentColor" d="M8 5v14l11-7z" /></svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
