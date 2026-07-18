"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function KeyboardNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heroFinished, setHeroFinished] = useState(pathname !== "/");
  const [triggerPulse, setTriggerPulse] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setHeroFinished(true);
      return;
    }

    setHeroFinished(false);
    const handleComplete = () => {
      setHeroFinished(true);
      
      // First visit hint trigger: Wait 900ms, pulse once, then remove class
      const pulseTimer = setTimeout(() => {
        setTriggerPulse(true);
      }, 900);

      const clearPulseTimer = setTimeout(() => {
        setTriggerPulse(false);
      }, 1300); // 900ms + 400ms duration

      return () => {
        clearTimeout(pulseTimer);
        clearTimeout(clearPulseTimer);
      };
    };

    window.addEventListener("heroAnimationComplete", handleComplete);
    return () => window.removeEventListener("heroAnimationComplete", handleComplete);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Check if user is typing in form inputs, textareas, or contentEditable areas
      const activeElement = document.activeElement;
      if (activeElement) {
        const tagName = activeElement.tagName.toLowerCase();
        const isContentEditable = activeElement.getAttribute("contenteditable") === "true";
        if (
          tagName === "input" ||
          tagName === "textarea" ||
          tagName === "select" ||
          isContentEditable
        ) {
          return; // Ignore shortcuts when typing
        }
      }

      // 2. Keyboard routing matches (case-insensitive)
      const key = e.key.toLowerCase();

      // Help Modal Toggle on '?' (Shift + /)
      if (e.key === "?") {
        e.preventDefault();
        setIsModalOpen((prev) => !prev);
        return;
      }

      // Escape key to close modal
      if (e.key === "Escape") {
        if (isModalOpen) {
          setIsModalOpen(false);
          // Return focus to main body
          document.body.focus();
        }
        return;
      }

      // Navigation shortcuts
      switch (key) {
        case "h":
          e.preventDefault();
          router.push("/");
          if (isModalOpen) setIsModalOpen(false);
          break;
        case "a":
          e.preventDefault();
          router.push("/about");
          if (isModalOpen) setIsModalOpen(false);
          break;
        case "p":
          e.preventDefault();
          router.push("/projects");
          if (isModalOpen) setIsModalOpen(false);
          break;
        case "t":
          e.preventDefault();
          window.dispatchEvent(new CustomEvent("toggleTheme"));
          if (isModalOpen) setIsModalOpen(false);
          break;
        case "g":
          e.preventDefault();
          router.push("/past-projects");
          if (isModalOpen) setIsModalOpen(false);
          break;
        case "o":
          e.preventDefault();
          router.push("/open-source");
          if (isModalOpen) setIsModalOpen(false);
          break;
        case "s":
          e.preventDefault();
          router.push("/skills");
          if (isModalOpen) setIsModalOpen(false);
          break;
        case "c":
          e.preventDefault();
          router.push("/contact");
          if (isModalOpen) setIsModalOpen(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, isModalOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close modal if clicking the backdrop wrapper itself
    if ((e.target as HTMLElement).classList.contains("modal-backdrop")) {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      {/* Keyboard Shortcut Hint (Subtle bottom-right flag) */}
      <div
        className={`keyboard-hint ${heroFinished ? "show-nav" : "hide-nav"} ${triggerPulse ? "hint-pulse" : ""}`}
        onClick={() => setIsModalOpen(true)}
      >
        <span className="hint-label" style={{ marginRight: "4px" }}>Press</span>
        <kbd className="hint-key">?</kbd>
        <span className="hint-label" style={{ marginLeft: "4px" }}>for shortcuts</span>
      </div>

      {/* Shortcut Help Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
          <div className="kbd-modal">
            <div className="modal-header">
              <h3>Keyboard Shortcuts</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)} aria-label="Close modal">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="shortcut-row">
                <kbd>H</kbd> <span>Home</span>
              </div>
              <div className="shortcut-row">
                <kbd>A</kbd> <span>About</span>
              </div>
              <div className="shortcut-row">
                <kbd>P</kbd> <span>Projects</span>
              </div>
              <div className="shortcut-row">
                <kbd>T</kbd> <span>Toggle Theme</span>
              </div>
              <div className="shortcut-row">
                <kbd>G</kbd> <span>Past Projects</span>
              </div>
              <div className="shortcut-row">
                <kbd>O</kbd> <span>Open Source</span>
              </div>
              <div className="shortcut-row">
                <kbd>S</kbd> <span>Skills</span>
              </div>
              <div className="shortcut-row">
                <kbd>C</kbd> <span>Contact</span>
              </div>
              <div className="shortcut-row divider">
                <kbd>Esc</kbd> <span>Close Modal</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
