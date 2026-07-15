"use client";

import React, { useRef, useEffect } from "react";

interface ExpandableProjectCardProps {
  id: string;
  name: string;
  shortDescription: string;
  techStack: string[];
  externalLink: string;
  githubLink: string;
  status?: {
    type: "live" | "dev" | "archived";
    label: string;
  };
  expandedContent: {
    whatIsIt: string; // supports multiline/markdown-like paragraph lists
    whyBuildIt: string;
  };
  isExpanded: boolean;
  onToggle: () => void;
}

export default function ExpandableProjectCard({
  id,
  name,
  shortDescription,
  techStack,
  externalLink,
  githubLink,
  status,
  expandedContent,
  isExpanded,
  onToggle,
}: ExpandableProjectCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle keyboard events (Enter/Space to toggle, Escape to close)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    } else if (e.key === "Escape" && isExpanded) {
      e.preventDefault();
      onToggle(); // closes
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`expandable-card ${isExpanded ? "expanded" : ""}`}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
      aria-controls={`content-${id}`}
      id={`card-${id}`}
    >
      {/* Card Header (always visible) */}
      <div className="card-top-header">
        <div className="header-left">
          <h3 className="card-title">
            <a
              href={externalLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className="external-title-link"
              tabIndex={0}
              aria-label={`Visit live site for ${name}`}
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
            onClick={handleLinkClick}
            className="github-link-btn"
            title="View Codebase"
            aria-label={`View GitHub repository for ${name}`}
            tabIndex={0}
          >
            <i className="fa-brands fa-github"></i> GitHub
          </a>
          <span className="expand-indicator" aria-hidden="true">
            <i className={`fa-solid ${isExpanded ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
          </span>
        </div>
      </div>

      <p className="card-short-desc">{shortDescription}</p>

      <div className="card-tech-stack-text" style={{ fontSize: "0.8rem", marginTop: "4px" }}>
        <strong>Tech Stack:</strong>{" "}
        {techStack.map((tech, idx) => (
          <React.Fragment key={tech}>
            <strong>{tech}</strong>
            {idx < techStack.length - 1 && " • "}
          </React.Fragment>
        ))}
      </div>

      {/* Expanded Content Drawer */}
      <div
        id={`content-${id}`}
        className="expanded-drawer"
        style={{
          height: isExpanded ? `${contentRef.current?.scrollHeight || 0}px` : "0px",
        }}
      >
        <div ref={contentRef} className="expanded-drawer-inner">
          <div className="doc-section">
            <h4>What is it?</h4>
            <p>{expandedContent.whatIsIt}</p>
          </div>
          <div className="doc-section">
            <h4>Why did I build it?</h4>
            <p>{expandedContent.whyBuildIt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
