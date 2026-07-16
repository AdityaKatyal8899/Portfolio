"use client";

import React, { useState, useEffect } from "react";
import { GitHubCalendar } from "react-github-calendar";

interface Commit {
  message: string;
  sha: string;
}

interface PushEventData {
  repoName: string;
  commitCount: number;
  latestCommitMessage: string;
  relativeTime: string;
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function GitHubChart() {
  const [mounted, setMounted] = useState(false);
  const [blockSize, setBlockSize] = useState(10);
  const [latestActivity, setLatestActivity] = useState<PushEventData | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setBlockSize(5);
      } else {
        setBlockSize(10);
      }
    };
    
    // Set initial size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Fetch live activity from GitHub
    const fetchLiveActivity = async () => {
      try {
        const res = await fetch("https://api.github.com/users/AdityaKatyal8899/events");
        if (!res.ok) return;
        const events = await res.json();
        
        // Find the first PushEvent
        const pushEvent = events.find((e: any) => e.type === "PushEvent");
        if (pushEvent) {
          const repoName = pushEvent.repo.name.replace("AdityaKatyal8899/", "");
          const commits = pushEvent.payload.commits || [];
          const commitCount = pushEvent.payload.size || commits.length || 1;
          let latestCommitMessage = commits[0]?.message || "";
          const relativeTime = getRelativeTime(pushEvent.created_at);

          // If payload commits are omitted (common in larger sync events), fetch details of the head commit
          if (!latestCommitMessage && pushEvent.payload.head) {
            try {
              const commitRes = await fetch(
                `https://api.github.com/repos/AdityaKatyal8899/${repoName}/commits/${pushEvent.payload.head}`
              );
              if (commitRes.ok) {
                const commitData = await commitRes.json();
                latestCommitMessage = commitData.commit?.message || "No commit message";
              }
            } catch (err) {
              console.error("Failed to fetch detailed commit info:", err);
            }
          }

          if (!latestCommitMessage) {
            latestCommitMessage = "Pushed changes";
          }

          setLatestActivity({
            repoName,
            commitCount,
            latestCommitMessage,
            relativeTime,
          });
        }
      } catch (err) {
        console.error("Failed to fetch live GitHub activity:", err);
      }
    };

    fetchLiveActivity();
  }, []);

  if (!mounted) {
    return (
      <div className="github-chart-section" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", margin: "0 auto 40px auto", padding: "40px", backgroundColor: "#ffffff", border: "2px solid #000000", borderRadius: "6px", boxShadow: "3px 3px 0px #000000", minHeight: "280px" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.5px" }}>GitHub Contributions</h3>
        <div style={{ color: "#64748b", fontSize: "0.95rem" }}>Loading contributions...</div>
      </div>
    );
  }

  return (
    <div className="github-chart-section" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", margin: "0 auto 40px auto", padding: "40px", backgroundColor: "#ffffff", border: "2px solid #000000", borderRadius: "6px", boxShadow: "3px 3px 0px #000000" }}>
      <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.5px" }}>GitHub Contributions</h3>
      
      <div className="calendar-wrapper" style={{ width: "100%", display: "flex", justifyContent: "center", overflowX: "auto" }}>
        <GitHubCalendar
          theme={{
            light: ['#f0f4f8', '#d0e1f9', '#4d648d', '#2a4d69', '#1e3d59'],
            dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
          }}
          username="AdityaKatyal8899"
          blockSize={blockSize}
          blockMargin={5}
          colorScheme="light"
        />
      </div>

      {latestActivity && (
        <div style={{ marginTop: "30px", width: "100%", borderTop: "2px dashed #e2e8f0", paddingTop: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", fontWeight: 700, color: "#1e3d59" }}>
            <span style={{ display: "inline-block", width: "8px", height: "8px", backgroundColor: "#22c55e", borderRadius: "50%", animation: "pulse 1.5s infinite" }}></span>
            Live Activity
          </div>
          <p style={{ margin: "4px 0", fontSize: "0.95rem", lineHeight: "1.5", textAlign: "center", color: "#334155" }}>
            Pushed <strong>{latestActivity.commitCount} {latestActivity.commitCount === 1 ? "commit" : "commits"}</strong> to <a href={`https://github.com/AdityaKatyal8899/${latestActivity.repoName}`} target="_blank" rel="noopener noreferrer" style={{ color: "#1e3d59", fontWeight: 700, textDecoration: "underline" }}>{latestActivity.repoName}</a> <span style={{ color: "#64748b" }}>({latestActivity.relativeTime})</span>
          </p>
          <div style={{ fontSize: "0.85rem", color: "#64748b", fontFamily: "monospace", backgroundColor: "#f8fafc", padding: "6px 12px", borderRadius: "4px", border: "1px solid #e2e8f0", maxWidth: "90%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            "{latestActivity.latestCommitMessage}"
          </div>
          
          <style jsx global>{`
            @keyframes pulse {
              0% { transform: scale(0.9); opacity: 1; }
              50% { transform: scale(1.2); opacity: 0.5; }
              100% { transform: scale(0.9); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}