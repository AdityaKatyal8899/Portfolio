"use client";

import React, { useEffect, useState } from "react";
import ExpandableProjectCard from "../components/ExpandableProjectCard";

interface ProjectData {
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

export default function PastProjectsPage() {
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

  const pastProjects: ProjectData[] = [
    {
      id: "findmyclicks",
      name: "FindMyClicks (FMC)",
      shortDescription: "An intelligent face embedding matching and finder platform that searches large volumes of images.",
      techStack: ["Python", "FastAPI", "Face Recognition", "Dlib", "JavaScript", "CSS"],
      externalLink: "https://findmyclicks.vercel.app",
      githubLink: "https://github.com/AdityaKatyal8899/FindMyClicks",
      status: { type: "archived", label: "Archived" },
      expandedContent: {
        whatIsIt: "FindMyClicks (FMC) is a face embedding search engine. It processes reference face samples and scans massive sets of pictures to identify occurrences of that specific face in seconds, eliminating manual file reviews.",
        whyBuildIt: "I built this to explore computer vision libraries and automated facial detection workflows. I wanted to understand face coordinate mapping, spatial facial landmarks, and search optimizations over local file directories."
      }
    },
    {
      id: "the-site",
      name: "THE Language Official Site",
      shortDescription: "The official download, documentation, and support site for THE programming language.",
      techStack: ["Next.js", "TypeScript", "TailwindCSS", "Vercel"],
      externalLink: "https://the-lang-official.vercel.app/",
      githubLink: "https://github.com/AdityaKatyal8899/THE_Site",
      status: { type: "archived", label: "Archived" },
      expandedContent: {
        whatIsIt: "THE Language Official Site is the documentation and distribution hub for THE programming language. It hosts language references, syntax tutorials, binary compiler releases, and links to community discussions.",
        whyBuildIt: "I built this page to support my custom compiler release and make downloading compiler binaries straightforward. It allowed me to design a structured reference documentation page for new users of the language."
      }
    }
  ];

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="page-container">
      <section className="projects reveal show" id="past-projects" style={{ maxWidth: "900px", margin: "0 auto", width: "100%" }}>
        <h2 className="section-title" style={{ marginBottom: "60px" }}>Past Projects</h2>
        
        <div className="project-explorer-list" role="tablist" aria-label="Past Projects Accordion Explorer">
          {pastProjects.map((project) => (
            <ExpandableProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              shortDescription={project.shortDescription}
              techStack={project.techStack}
              externalLink={project.externalLink}
              githubLink={project.githubLink}
              status={project.status}
              expandedContent={project.expandedContent}
              isExpanded={expandedId === project.id}
              onToggle={() => handleToggle(project.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
