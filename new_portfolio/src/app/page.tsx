"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProjectCard from "./components/ProjectCard";
import GitHubChart from "./components/GitHubChart";

export default function HomePage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("heroAnimationComplete"));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="home-container">
      {/* 🚀 Hero Section */}
      <section className="intro reveal show">
        <h1 className="hero-heading">Hi, I'm Aditya — Full-Stack Developer & Backend Engineer</h1>
        <p className="hero-subtitle">Building intelligent and aesthetic experiences with code.</p>
      </section>

      <div className="section-divider reveal show"></div>

      {/* 👤 About Summary */}
      <section className="about reveal show" id="about-summary">
        <div className="about-inner">
          <h2 className="section-title">About Me</h2>
          <p className="about-text">
            I'm Aditya Katyal — a passionate Full Stack Developer and AI enthusiast who loves building practical, elegant, and fast applications.
            I focus on crafting immersive user experiences with solid backend logic, blending creativity with system design precision.
          </p>
          <p className="about-text">
            My engineering journey revolves around exploring AI integrations, system intelligence, and efficient automation.
            I build highly responsive systems, media pipelines, and full-stack solutions to solve real-world problems.
          </p>
          <div style={{ marginTop: "24px" }}>
            <Link href="/about" className="nav-links a" style={{ display: "inline-block", textDecoration: "none", color: "#000", border: "2px solid #000", padding: "8px 16px", borderRadius: "6px", fontWeight: "700", boxShadow: "2px 2px 0px #000" }}>
              Read My Full Story &rarr;
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider reveal show"></div>

      {/* 📊 GitHub Contributions Chart */}
      <section className="reveal show" style={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: "900px", margin: "0 auto 30px auto" }}>
        <GitHubChart />
      </section>

      <div className="section-divider reveal show"></div>

      {/* 🎓 Education */}
      <section className="about reveal show" id="education-summary">
        <div className="about-inner">
          <h3 className="subsection-title">Education</h3>
          <ul className="education-list" style={{ textAlign: "left", listStyle: "none", padding: 0 }}>
            <li className="education-item">
              <div className="edu-left">
                <img className="edu-logo" src="/images/1.png" alt="College Logo" width="32" height="32" />
                <div className="edu-texts">
                  <div className="edu-title">Abdul Kalam Technical University, Lucknow</div>
                  <div className="edu-sub">Bachelor's Degree of Computer Science and Engineering (BTech)</div>
                </div>
              </div>
              <div className="edu-year">2023 - 2027</div>
            </li>
            <li className="education-item">
              <div className="edu-left">
                <img className="edu-logo" src="/images/2.png" alt="School Logo" width="32" height="32" />
                <div className="edu-texts">
                  <div className="edu-title">Gagan Public School(CBSE), Aligarh</div>
                  <div className="edu-sub">Intermediate (Class 12th)</div>
                </div>
              </div>
              <div className="edu-year">2021 - 2023</div>
            </li>
          </ul>
        </div>
      </section>

      <div className="section-divider reveal show"></div>

      {/* 🏆 Featured Projects previews */}
      <section className="projects reveal show" id="featured-projects">
        <div className="about-inner">
          <h2 className="section-title">Featured Work</h2>
          
          <div className="featured-grid">
            <ProjectCard
              name="CoWatch"
              description="A real-time watch-party synchronization engine utilizing WebSockets and drift-correction algorithms. Integrates an optimized HLS streaming pipeline for sub-second synchronization under load."
              techStack={["FastAPI", "Next.js", "Docker", "Redis", "HLS", "AWS"]}
              externalLink="https://cowatch-theta.vercel.app/"
              githubLink="https://github.com/AdityaKatyal8899/CoWatch-Dev-env"
              internalLink="/projects#cowatch"
              status={{ type: "live", label: "Live" }}
            />

            <ProjectCard
              name="SeatLock"
              description="A concurrency-safe resource allocation package for Python applications. Implements atomic booking, automatic cancellation, and timeout semantics to prevent race conditions."
              techStack={["Python", "Concurrency", "Locking Patterns", "PyPI"]}
              externalLink="https://pypi.org/project/seatlock/"
              githubLink="https://github.com/AdityaKatyal8899/Packages/tree/main/Allocation-Package"
              internalLink="/open-source#seatlock"
              status={{ type: "live", label: "PyPI Package" }}
            />
          </div>

          <div style={{ marginTop: "35px" }}>
            <Link href="/projects" className="nav-links a" style={{ display: "inline-block", textDecoration: "none", color: "#000", border: "2px solid #000", padding: "8px 20px", borderRadius: "6px", fontWeight: "700", boxShadow: "2px 2px 0px #000" }}>
              View All Projects &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* <div className="section-divider reveal show"></div> */}

      {/* 💡 Major Ideas I'm Exploring */}
      {/* <section className="about reveal show" id="ideas-exploring">
        <div className="about-inner">
          <h2 className="section-title">Ideas I'm Exploring</h2>
          <div className="about-badges" style={{ marginTop: "24px" }}>
            <div className="badge">
              <i className="fa-solid fa-brain"></i> [Idea Placeholder 1]
            </div>
            <div className="badge">
              <i className="fa-solid fa-network-wired"></i> [Idea Placeholder 2]
            </div>
            <div className="badge">
              <i className="fa-solid fa-microchip"></i> [Idea Placeholder 3]
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
