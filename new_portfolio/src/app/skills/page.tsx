"use client";

import React, { useEffect, useState } from "react";

export default function SkillsPage() {
  const [skillsAnimated, setSkillsAnimated] = useState(false);

  const skillsData = [
    { name: "Python", percent: 70 },
    { name: "JavaScript", percent: 65 },
    { name: "FastAPI", percent: 80 },
    { name: "Next.js", percent: 80 },
    { name: "OpenCV", percent: 65 },
    { name: "ffmpeg", percent: 75 },
    { name: "MONGODB", percent: 80 },
    { name: "SQL", percent: 78 },
    { name: "Docker", percent: 75 },
    { name: "AWS- (EC2, S3, Cloudfront, Lambda)", percent: 80 },
  ];

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

    // Trigger skills bar animation on mount
    setSkillsAnimated(true);

    return () => revealObserver.disconnect();
  }, []);

  return (
    <div className="page-container">
      <section className="skills reveal show" id="skills">
        <h2 className="section-title">Skills</h2>
        <div className="skills-bars" id="skills-bars">
          {skillsData.map((skill) => (
            <div key={skill.name} className="skills-bar">
              <div className="skills-bar-label">{skill.name}</div>
              <div className="skills-bar-track">
                <div
                  className="skills-bar-fill"
                  style={{ width: skillsAnimated ? `${skill.percent}%` : "0%" }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
