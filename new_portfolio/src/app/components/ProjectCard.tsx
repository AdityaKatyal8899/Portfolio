"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  name: string;
  description: string;
  techStack: string[];
  externalLink: string;
  githubLink: string;
  internalLink: string;
  status?: {
    type: "live" | "dev" | "archived";
    label: string;
  };
}

export default function ProjectCard({
  name,
  description,
  techStack,
  externalLink,
  githubLink,
  internalLink,
  status,
}: ProjectCardProps) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // Navigate to the internal detail section/page
    router.push(internalLink);
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    // Prevent the parent card click navigation from triggering
    e.stopPropagation();
  };

  return (
    <div className="doc-project-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <div className="card-top-header">
        <div className="header-left">
          <h3 className="card-title">
            <a
              href={externalLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleTitleClick}
              className="external-title-link"
            >
              {name} <span className="arrow">↗</span>
            </a>
          </h3>
          {status && (
            <span className={`status-badge ${status.type}`}>
              {status.type !== "archived" && <span className="dot">●</span>}
              {status.label}
            </span>
          )}
        </div>

        <div className="header-right">
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleTitleClick}
            className="github-link-btn"
            title="View Codebase"
            aria-label={`View GitHub repository for ${name}`}
          >
            <i className="fa-brands fa-github"></i> GitHub
          </a>
        </div>
      </div>

      <p className="card-description" style={{ margin: "12px 0 16px 0", fontSize: "0.9rem", color: "#333333", lineHeight: "1.5" }}>
        {description}
      </p>

      <div className="card-tech-stack-text" style={{ fontSize: "0.8rem", marginTop: "auto" }}>
        <strong>Tech Stack:</strong>{" "}
        {techStack.map((tech, idx) => (
          <React.Fragment key={tech}>
            <strong>{tech}</strong>
            {idx < techStack.length - 1 && " • "}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
