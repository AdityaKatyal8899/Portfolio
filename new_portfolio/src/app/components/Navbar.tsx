"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [heroFinished, setHeroFinished] = useState(pathname !== "/");

  useEffect(() => {
    // If not on the homepage, show immediately
    if (pathname !== "/") {
      setHeroFinished(true);
      return;
    }

    // Otherwise, start as hidden and listen for completion event
    setHeroFinished(false);
    const handleComplete = () => setHeroFinished(true);
    window.addEventListener("heroAnimationComplete", handleComplete);
    return () => window.removeEventListener("heroAnimationComplete", handleComplete);
  }, [pathname]);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="site-header">
      <nav className="nav-container" style={{ justifyContent: "flex-end" }}>

        {/* Hamburger Button for Mobile */}
        <button
          className={`hamburger-btn ${isOpen ? "active" : ""} ${heroFinished ? "show-nav" : "hide-nav"}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Menu Links */}
        <div className={`nav-links-wrapper ${isOpen ? "open" : ""}`}>
          <div className="nav-links">
            <Link href="/" onClick={closeMenu}>Home</Link>
            <Link href="/about" onClick={closeMenu}>About</Link>
            <Link href="/projects" onClick={closeMenu}>Projects</Link>
            <Link href="/past-projects" onClick={closeMenu}>Past Projects</Link>
            <Link href="/open-source" onClick={closeMenu}>Open Source</Link>
            <Link href="/skills" onClick={closeMenu}>Skills</Link>
            <Link href="/contact" onClick={closeMenu}>Contact</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
