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

export default function ProjectsPage() {
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

  const projects: ProjectData[] = [
    {
      id: "cowatch",
      name: "CoWatch",
      shortDescription: "Real-time watch party platform with sub-second synchronization and optimized HLS video pipeline.",
      techStack: ["FastAPI", "Next.js", "Docker", "Redis", "Celery", "Supabase", "FFmpeg", "AWS"],
      externalLink: "https://cowatch-theta.vercel.app/",
      githubLink: "https://github.com/AdityaKatyal8899/CoWatch-Dev-env",
      status: { type: "live", label: "Live" },
      expandedContent: {
        whatIsIt: "CoWatch is a watch-party platform designed for synchronized media playback. It leverages WebSockets for real-time state broadcasts and incorporates dynamic drift-correction algorithms to keep multiple client viewports synced within a fraction of a second. It includes optimized media processing streams using HLS segmenting.",
        whyBuildIt: "I built CoWatch to learn about real-time communications and media transport protocols. I wanted to understand how to handle large volumes of WebSocket connections efficiently and resolve playback synchronization discrepancies across varying network latency boundaries.",
      },
    },
    {
      id: "kundli",
      name: "Kundli-WebApp",
      shortDescription: "High-precision astrology platform combining algorithmic celestial calculations with horoscopes.",
      techStack: ["FastAPI", "Next.js", "PostgreSQL", "Astrology Domain Logic"],
      externalLink: "https://kundli-web-app.vercel.app/",
      githubLink: "https://github.com/AdityaKatyal8899/Kundli-WebApp",
      status: { type: "live", label: "Live" },
      expandedContent: {
        whatIsIt: "Kundli-WebApp is a mathematical calculations and astrology charting tool. It processes geographical coordinates and birth details to output astronomical positions, horoscopes, and chart matchings with high precision.",
        whyBuildIt: "I built this to practice turning complex formulas and astronomical coordinate calculations into clean, modular API services. I wanted to structure mathematical domains separate from interface representations for testing validity.",
      },
    },
    {
      id: "katyalstore",
      name: "KatyalStore",
      shortDescription: "A clean Android application distribution store for exploring and downloading projects.",
      techStack: ["Next.js", "TypeScript", "TailwindCSS", "MongoDB", "Vercel"],
      externalLink: "https://katyalstore.vercel.app/",
      githubLink: "https://github.com/AdityaKatyal8899/KatyalStore",
      status: { type: "live", label: "Live" },
      expandedContent: {
        whatIsIt: "KatyalStore acts as a self-hosted App Store repository for Android packages. It provides download logs, package version tracking, and simple descriptions for Android utilities I build.",
        whyBuildIt: "I built KatyalStore to simplify how I share APK releases. Rather than distributing raw files via cloud links, I wanted a central, readable dashboard where users could explore version logs and download package binaries securely.",
      },
    },
    {
      id: "omaju",
      name: "Omaju",
      shortDescription: "A microservice-based AI orchestration hub facilitating text chat, VQA, and speech conversations.",
      techStack: ["Next.js", "Flask", "Node.js", "MongoDB", "Gemini API", "Hugging Face", "PyTorch"],
      externalLink: "https://omaju-onboarding.vercel.app/",
      githubLink: "https://github.com/AdityaKatyal8899/Omaju",
      status: { type: "live", label: "Live" },
      expandedContent: {
        whatIsIt: "Omaju is an AI service orchestrator linking speech conversion, Visual Question Answering (VQA), and canvas generation interfaces. It manages multiple sub-services that communicate asynchronously to process user media inputs.",
        whyBuildIt: "I wanted to understand microservices architecture, specifically how to decouple CPU-heavy image generation models from frontend client requests. It served as a learning pipeline for API gateways and task queues.",
      },
    },
    {
      id: "temp-share",
      name: "Temp Share",
      shortDescription: "Secure file sharing platform with automatic expiry policies and dynamic access tokens.",
      techStack: ["React", "Flask", "Cloudinary", "Expiring LIFOs"],
      externalLink: "https://tempshare-ten.vercel.app/",
      githubLink: "https://github.com/AdityaKatyal8899/temp-front",
      status: { type: "live", label: "Live" },
      expandedContent: {
        whatIsIt: "Temp Share is an ephemeral storage service letting users upload documents and receive time-bound ownership access codes. Files are automatically expunged from the server and CDN when the expiration time expires.",
        whyBuildIt: "I built this to explore storage lifecycle policies and secure resource access tokens. I wanted to build a simple utility that guarantees automatic cleanups of temporary resources without manual cron script monitoring.",
      },
    },
  ];

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="page-container">
      <section className="projects reveal show" id="projects" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h2 className="section-title" style={{ marginBottom: "60px" }}>Project Explorer</h2>

        <div className="project-explorer-list" role="tablist" aria-label="Projects Accordion Explorer">
          {projects.map((project) => (
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
