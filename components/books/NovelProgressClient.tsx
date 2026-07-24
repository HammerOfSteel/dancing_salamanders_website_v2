"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Props {
  slug: string;
  currentPage: number;
  totalPages: number;
}

export function NovelProgressClient({ slug, currentPage, totalPages }: Props) {
  const [savedPage, setSavedPage] = useState<number | null>(null);
  const key = `novel:${slug}`;

  useEffect(() => {
    // Read the previously saved position BEFORE overwriting it
    const raw = localStorage.getItem(key);
    const prev = raw ? parseInt(raw, 10) : NaN;
    if (!isNaN(prev) && prev !== currentPage && prev >= 1 && prev <= totalPages) {
      setSavedPage(prev);
    }
    // Save current position
    localStorage.setItem(key, String(currentPage));
  }, [key, currentPage, totalPages]);

  if (!savedPage) return null;

  return (
    <div className="grimoire-continue-bar">
      <span className="grimoire-continue-text">
        Last reading: page {savedPage} of {totalPages}
      </span>
      <Link
        href={`/books/novels/${slug}?page=${savedPage}`}
        className="grimoire-continue-btn"
      >
        Continue reading →
      </Link>
    </div>
  );
}
