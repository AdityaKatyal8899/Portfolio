"use client";

import React, { useEffect, useState } from "react";

export default function PastProjectsPage() {
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [upvotedProjects, setUpvotedProjects] = useState<Record<string, boolean>>({});

  const pastProjectIds = ["findmyclicks", "the-site"];

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

  // Fetch votes & sync localStorage on mount
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await fetch("/api/vote");
        if (response.ok) {
          const data = await response.json();
          setVotes(data);
        }
      } catch (err) {
        console.error("Failed to fetch votes:", err);
      }
    };
    fetchVotes();

    const localUpvoted: Record<string, boolean> = {};
    pastProjectIds.forEach((id) => {
      if (localStorage.getItem(`upvoted_${id}`)) {
        localUpvoted[id] = true;
      }
    });
    setUpvotedProjects(localUpvoted);
  }, []);

  const handleUpvote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (upvotedProjects[id]) return;

    localStorage.setItem(`upvoted_${id}`, "true");
    setUpvotedProjects((prev) => ({ ...prev, [id]: true }));

    // Optimistically update locally
    setVotes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id })
      });
      if (response.ok) {
        const data = await response.json();
        setVotes(data);
      }
    } catch (err) {
      console.error("Vote error:", err);
    }
  };

  return (
    <div className="page-container">
      <section className="projects reveal show" id="past-projects">
        <h2 className="section-title">Past Projects</h2>

        {/* FindMyClicks */}
        <div className="project-row reveal show">
          <div className="project-image">
            <img src="/images/past1.png" alt="FindMyClicks Screenshot" />
          </div>
          <div className="project-content">
            <h3>FindMyClicks (FMC)</h3>
            <p>
              FindMyClicks (FMC) is an intelligent face embedding matching and face finder that searches a large volume of images.
              It eliminates the need to manually search through files, finding target faces in seconds.
            </p>
            <p className="tech-stack"><strong>Tech Stack:</strong> Python - FastAPI - Face Recognition (Dlib) - JavaScript - CSS</p>
            <div className="project-links">
              <a href="https://findmyclicks.vercel.app" target="_blank" rel="noopener noreferrer" className="visit-site">
                <i className="fa-solid fa-earth-americas"></i> Visit Site
              </a>
              <a href="https://github.com/AdityaKatyal8899/FindMyClicks" target="_blank" rel="noopener noreferrer" className="repo">
                <i className="fa-brands fa-github"></i> Repo
              </a>
              <div className="upvote-container" onClick={(e) => handleUpvote("findmyclicks", e)}>
                <button className={`upvote-btn ${upvotedProjects["findmyclicks"] ? "active" : ""}`} aria-label="Upvote project">
                  <i className={upvotedProjects["findmyclicks"] ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                </button>
                <span className={`upvote-count ${(votes["findmyclicks"] || 0) >= 20 ? "show" : ""}`}>{votes["findmyclicks"] || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* THE Language Official Site */}
        <div className="project-row reverse reveal show">
          <div className="project-image">
            <img src="/images/past2.png" alt="THE_Site Screenshot" />
          </div>
          <div className="project-content">
            <h3>THE Language Official Site</h3>
            <p>
              The official download, documentation, and support site for THE programming language.
              Enables downloading official binaries, exploring compiler documentation, and connecting with the community.
            </p>
            <p className="tech-stack"><strong>Tech Stack:</strong> Next.js - TypeScript - TailwindCSS - Vercel</p>
            <div className="project-links">
              <a href="https://the-lang-official.vercel.app/" target="_blank" rel="noopener noreferrer" className="visit-site">
                <i className="fa-solid fa-earth-americas"></i> Visit Site
              </a>
              <a href="https://github.com/AdityaKatyal8899/THE_Site" target="_blank" rel="noopener noreferrer" className="repo">
                <i className="fa-brands fa-github"></i> Repo
              </a>
              <div className="upvote-container" onClick={(e) => handleUpvote("the-site", e)}>
                <button className={`upvote-btn ${upvotedProjects["the-site"] ? "active" : ""}`} aria-label="Upvote project">
                  <i className={upvotedProjects["the-site"] ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                </button>
                <span className={`upvote-count ${(votes["the-site"] || 0) >= 20 ? "show" : ""}`}>{votes["the-site"] || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
