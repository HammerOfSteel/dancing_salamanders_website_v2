"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  slug: string;
  currentPage: number;
  totalPages: number;
}

export function PageJumper({ slug, currentPage, totalPages }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(String(currentPage));

  // Keep input in sync when page changes via prev/next links
  useEffect(() => {
    setValue(String(currentPage));
  }, [currentPage]);

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const p = Math.max(1, Math.min(totalPages, parseInt(value, 10) || currentPage));
    router.push(`/books/novels/${slug}?page=${p}`);
  };

  return (
    <form onSubmit={go} className="grimoire-page-jumper">
      <span className="grimoire-jumper-label">Page</span>
      <input
        type="number"
        className="grimoire-jumper-input"
        value={value}
        min={1}
        max={totalPages}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Go to page"
      />
      <span className="grimoire-jumper-label">of {totalPages}</span>
      <button type="submit" className="grimoire-jumper-btn">Go</button>
    </form>
  );
}
