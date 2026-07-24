"use client";

import { useState, useCallback } from "react";

interface MangaViewerProps {
  imagePath: string;
  title: string;
  naturalWidth: number;
  naturalHeight: number;
}

const ZOOM_STEPS = [40, 55, 70, 85, 100, 120, 140, 160];
const DEFAULT_ZOOM_IDX = 4; // 100%

export default function MangaViewer({ imagePath, title, naturalWidth, naturalHeight }: MangaViewerProps) {
  const [zoomIdx, setZoomIdx] = useState(DEFAULT_ZOOM_IDX);
  const zoom = ZOOM_STEPS[zoomIdx];

  const zoomIn = useCallback(() => {
    setZoomIdx((i) => Math.min(i + 1, ZOOM_STEPS.length - 1));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomIdx((i) => Math.max(i - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setZoomIdx(DEFAULT_ZOOM_IDX);
  }, []);

  // Width in pixels at current zoom
  const displayWidth = Math.round((naturalWidth * zoom) / 100);

  return (
    <div className="webtoon-outer">
      {/* Top bar */}
      <div className="webtoon-topbar">
        <a href="/books" className="webtoon-back">
          ← Back to Books
        </a>
        <span className="webtoon-title">{title}</span>
        <div className="webtoon-zoom-controls">
          <button
            onClick={zoomOut}
            disabled={zoomIdx === 0}
            className="webtoon-zoom-btn"
            aria-label="Zoom out"
            title="Zoom out"
          >
            −
          </button>
          <button
            onClick={reset}
            className="webtoon-zoom-label"
            style={{ cursor: "pointer" }}
            title="Reset zoom"
          >
            {zoom}%
          </button>
          <button
            onClick={zoomIn}
            disabled={zoomIdx === ZOOM_STEPS.length - 1}
            className="webtoon-zoom-btn"
            aria-label="Zoom in"
            title="Zoom in"
          >
            +
          </button>
        </div>
      </div>

      {/* Strip */}
      <div className="webtoon-strip-wrapper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagePath}
          alt={title}
          width={displayWidth}
          height={Math.round((naturalHeight * displayWidth) / naturalWidth)}
          className="webtoon-strip"
          style={{ width: displayWidth, height: "auto" }}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
