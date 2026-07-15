"use client";

import React, { useEffect, useState } from "react";
import ExpandableProjectCard from "../components/ExpandableProjectCard";

interface PackageData {
  id: string;
  name: string;
  shortDescription: string;
  techStack: string[];
  externalLink: string;
  githubLink: string;
  status: {
    type: "live" | "dev" | "archived";
    label: string;
  };
  expandedContent: {
    whatIsIt: string;
    whyBuildIt: string;
  };
}

export default function OpenSourcePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    // Scroll reveal observer
    const reveals = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          } else {
            entry.target.classList.remove("show");
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  // Listen for Escape key globally to collapse any expanded card
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpandedId(null);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const packages: PackageData[] = [
    {
      id: "seatlock",
      name: "SeatLock",
      shortDescription: "Concurrency-safe resource allocation engine with lock, book, cancel, and timeout semantics.",
      techStack: ["Python", "Threading", "Concurrency Control", "PyPI"],
      externalLink: "https://pypi.org/project/seatlock/",
      githubLink: "https://github.com/AdityaKatyal8899/Packages/tree/main/Allocation-Package",
      status: { type: "live", label: "PyPI Package" },
      expandedContent: {
        whatIsIt: "SeatLock is a reusable Python engine designed to handle concurrency-safe resource allocation using lock, book, cancel, and timeout semantics. It is published to PyPI for real-world integration, with over 1.2k+ downloads worldwide.",
        whyBuildIt: "I built SeatLock to implement a clean, reuseable concurrency control model for distributed scheduling domains. I wanted to prevent race conditions during concurrent bookings without tying the logic to a specific database backend.",
      },
    },
    {
      id: "mediainfo-py",
      name: "mediainfo-py",
      shortDescription: "Lightweight Python wrapper for FFmpeg's ffprobe to extract rich video metadata.",
      techStack: ["Python", "FFmpeg", "ffprobe", "Media Processing", "PyPI"],
      externalLink: "https://pypi.org/project/mediainfo-py/",
      githubLink: "https://github.com/AdityaKatyal8899/Packages/tree/main/Media-Package",
      status: { type: "live", label: "PyPI Package" },
      expandedContent: {
        whatIsIt: "mediainfo-py is a lightweight Python package that wraps FFmpeg’s ffprobe functionality to extract essential video metadata such as resolution, frame rate (FPS), codec, and duration using a clean, Pythonic interface.",
        whyBuildIt: "I built mediainfo-py because I needed a simple, lightweight wrapper for reading media stream headers without importing bloated frameworks. It has gained traction with over 2.9k+ downloads worldwide.",
      },
    },
  ];

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="page-container">
      <section className="projects reveal show" id="packages" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h2 className="section-title" style={{ marginBottom: "60px" }}>Open Source Projects</h2>

        <div className="project-explorer-list" role="tablist" aria-label="Open Source Accordion Explorer">
          {packages.map((pkg) => (
            <ExpandableProjectCard
              key={pkg.id}
              id={pkg.id}
              name={pkg.name}
              shortDescription={pkg.shortDescription}
              techStack={pkg.techStack}
              externalLink={pkg.externalLink}
              githubLink={pkg.githubLink}
              status={pkg.status}
              expandedContent={pkg.expandedContent}
              isExpanded={expandedId === pkg.id}
              onToggle={() => handleToggle(pkg.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
