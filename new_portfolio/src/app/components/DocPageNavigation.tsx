"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PageData {
  path: string;
  title: string;
}

const PAGES: PageData[] = [
  { path: "/", title: "Home" },
  { path: "/about", title: "About" },
  { path: "/projects", title: "Projects" },
  { path: "/past-projects", title: "Past Projects" },
  { path: "/open-source", title: "Open Source" },
  { path: "/skills", title: "Skills" },
  { path: "/contact", title: "Contact" }
];

export default function DocPageNavigation() {
  const pathname = usePathname();

  // Find index of current page
  const currentIndex = PAGES.findIndex((p) => p.path === pathname);

  // If page is not in the list or we're on the Home page, don't show navigation
  if (currentIndex === -1 || pathname === "/") return null;

  const prevPage = currentIndex > 0 ? PAGES[currentIndex - 1] : null;
  const nextPage = currentIndex < PAGES.length - 1 ? PAGES[currentIndex + 1] : null;

  // Don't render anything if we're on a page with no prev or next
  if (!prevPage && !nextPage) return null;

  return (
    <div className="doc-page-nav-section">
      <div className="doc-page-nav-divider top"></div>
      
      <div className="doc-page-nav-container">
        {prevPage ? (
          <Link href={prevPage.path} className="doc-nav-link prev">
            <span className="arrow">←</span>
            <span className="link-title">{prevPage.title}</span>
          </Link>
        ) : (
          <div className="doc-nav-spacer"></div>
        )}

        {nextPage ? (
          <Link href={nextPage.path} className="doc-nav-link next">
            <span className="link-title">{nextPage.title}</span>
            <span className="arrow">→</span>
          </Link>
        ) : (
          <div className="doc-nav-spacer"></div>
        )}
      </div>

      <div className="doc-page-nav-divider bottom"></div>
    </div>
  );
}
