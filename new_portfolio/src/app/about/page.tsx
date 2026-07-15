"use client";

import React, { useEffect } from "react";

export default function AboutPage() {
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
    <div className="page-container">
      <section className="about reveal show" id="about">
        <div className="about-inner" style={{ textAlign: "left" }}>
          <h2 className="section-title" style={{ textAlign: "center", marginBottom: "60px" }}>About Me</h2>
          
          <div className="about-content" style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" }}>
            
            {/* 1. Introduction */}
            <div className="about-section">
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "15px", borderBottom: "2px solid #000", paddingBottom: "8px" }}>Introduction</h3>
              <p className="about-text" style={{ margin: "0", fontSize: "1.05rem", lineHeight: "1.8" }}>
                I am Aditya, a software engineer focused on building stable, efficient, and well-structured systems. Rather than specializing in a single layer of the stack, I find myself drawn to the interaction between backend performance and developer tools. I am interested in how data flows through systems—whether that is real-time synchronization in a watch-party platform or media pipelines processing large files. My goal is to build software that operates predictably under load and solves concrete constraints.
              </p>
            </div>

            {/* 2. How It Started */}
            <div className="about-section">
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "15px", borderBottom: "2px solid #000", paddingBottom: "8px" }}>How It Started</h3>
              <p className="about-text" style={{ margin: "0", fontSize: "1.05rem", lineHeight: "1.8" }}>
                My entry into software development wasn't driven by a grand vision, but rather by small curiosities. It began with simple scripts to automate repetitive tasks on my computer. Seeing a few lines of script save hours of manual effort made me curious about how larger systems were structured. I moved from writing automation scripts to designing APIs, and eventually to exploring how multiple services coordinate with one another. Each step was a natural progression of asking, "How does this work under the hood?"
              </p>
            </div>

            {/* 3. Learning Through Building */}
            <div className="about-section">
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "15px", borderBottom: "2px solid #000", paddingBottom: "8px" }}>Learning Through Building</h3>
              <p className="about-text" style={{ margin: "0", fontSize: "1.05rem", lineHeight: "1.8" }}>
                I have always found it difficult to learn software concepts in isolation. Instead, my understanding comes from building things from scratch. When I wanted to understand real-time state synchronization, I built a watch-party system. To learn how media encoding pipelines operate, I integrated FFmpeg wrappers. Deploying these projects exposed me to Docker, cloud storage lifecycles, and API routing. For me, a project is not just a finished product; it is a sandbox where I can make mistakes, read logs, and understand how different architectural decisions impact system performance.
              </p>
            </div>

            {/* 4. Challenges & Failures */}
            <div className="about-section">
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "15px", borderBottom: "2px solid #000", paddingBottom: "8px" }}>Challenges & Failures</h3>
              <p className="about-text" style={{ margin: "0", fontSize: "1.05rem", lineHeight: "1.8" }}>
                Building systems has also meant breaking them. In my early attempts at setting up WebSockets for real-time video synchronization, I underestimated network latency and drift correction, leading to desynchronized states. Another challenge was dealing with resource cleanup in temporary file-sharing apps; failing to manage file lifecycles properly led to rapid storage exhaustion. These failures taught me that writing code is only a fraction of engineering; the rest is spent debugging, analyzing system limits, and rewriting components to handle edge cases more reliably.
              </p>
            </div>

            {/* 5. Current Focus */}
            <div className="about-section">
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "15px", borderBottom: "2px solid #000", paddingBottom: "8px" }}>Current Focus</h3>
              <p className="about-text" style={{ margin: "0", fontSize: "1.05rem", lineHeight: "1.8" }}>
                Right now, my attention is directed toward understanding how to integrate machine learning models into traditional backend architectures. Specifically, I am exploring how to deploy models efficiently, manage inference latency, and structure APIs to handle heavy computation without blocking user threads. I am also reading about distributed systems patterns and studying how larger platforms handle data partitioning and scale concurrency safely.
              </p>
            </div>

            {/* 6. Long-Term Goal */}
            <div className="about-section">
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "15px", borderBottom: "2px solid #000", paddingBottom: "8px" }}>Long-Term Goal</h3>
              <p className="about-text" style={{ margin: "0", fontSize: "1.05rem", lineHeight: "1.8" }}>
                Looking ahead, I want to work on complex engineering problems where system reliability and performance are critical. I aim to contribute to open-source tools that other developers rely on, build infrastructure that supports large-scale operations, and work alongside teams that value code quality and thorough testing. Ultimately, I want to be an engineer who can be trusted to design systems that are clean, maintainable, and resilient.
              </p>
            </div>

            {/* 7. Closing Thoughts */}
            <div className="about-section" style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "15px", borderBottom: "2px solid #000", paddingBottom: "8px" }}>Closing Thoughts</h3>
              <p className="about-text" style={{ margin: "0", fontSize: "1.05rem", lineHeight: "1.8" }}>
                Software engineering is a field that moves quickly, and it is easy to feel the pressure to know everything. I have learned to accept that I will always have gaps in my knowledge. The most valuable skill I have developed is not familiarity with a specific framework, but the ability to read documentation, isolate a bug, and systematically learn whatever a problem requires.
              </p>
            </div>

            {/* 8. Now (Dynamic Section) */}
            {/* <div className="about-section" style={{ border: "3px solid #000", padding: "25px", borderRadius: "12px", boxShadow: "6px 6px 0px #000", backgroundColor: "#fafafa", marginTop: "20px" }}>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ display: "inline-block", width: "12px", height: "12px", backgroundColor: "#00f5d4", border: "2px solid #000", borderRadius: "50%" }}></span>
                Now
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                <li style={{ fontSize: "1.05rem" }}>
                  <strong>Current Focus:</strong> Machine learning integrations and containerized backend architectures.
                </li>
                <li style={{ fontSize: "1.05rem" }}>
                  <strong>Currently Building:</strong> Refining media streaming optimization pipelines.
                </li>
                <li style={{ fontSize: "1.05rem" }}>
                  <strong>Currently Learning:</strong> Distributed system topologies and query optimization patterns.
                </li>
                <li style={{ fontSize: "1.05rem" }}>
                  <strong>Currently Exploring:</strong> Advanced concurrency controls in Python/Go.
                </li>
                <li style={{ fontSize: "1.05rem" }}>
                  <strong>Currently Reading:</strong> Technical design posts on caching architectures and distributed storage papers.
                </li>
              </ul>
            </div> */}

          </div>
        </div>
      </section>
    </div>
  );
}
