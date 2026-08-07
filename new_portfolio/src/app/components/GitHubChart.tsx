"use client";

import React, { useState, useEffect } from "react";
import { ActivityCalendar } from "react-activity-calendar";

interface PushEventData {
  repoName: string;
  commitCount: number;
  latestCommitMessage: string;
  relativeTime: string;
}

interface CalendarDay {
  date: string;
  count: number;
  level: number;
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
  
  // Contributions states
  const [allContributions, setAllContributions] = useState<CalendarDay[]>([]);
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("lastYear");
  const [totalContributions, setTotalContributions] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Fetch data on mount
  useEffect(() => {
    // Fetch live activity from GitHub events
    const fetchLiveActivity = async () => {
      try {
        const res = await fetch("https://api.github.com/users/AdityaKatyal8899/events");
        if (!res.ok) return;
        const events = await res.json();
        
        const pushEvent = events.find((e: any) => e.type === "PushEvent");
        if (pushEvent) {
          const repoName = pushEvent.repo.name.replace("AdityaKatyal8899/", "");
          const commits = pushEvent.payload.commits || [];
          const commitCount = pushEvent.payload.size || commits.length || 1;
          let latestCommitMessage = commits[0]?.message || "";
          const relativeTime = getRelativeTime(pushEvent.created_at);

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

    // Fetch calendar data from Jogruber API
    const fetchCalendar = async () => {
      try {
        const res = await fetch("https://github-contributions-api.jogruber.de/v4/AdityaKatyal8899");
        if (!res.ok) throw new Error("Failed to fetch calendar data");
        const data = await res.json();

        // 1. Sort contributions chronologically
        const sortedContributions = (data.contributions || []).sort((a: any, b: any) => 
          a.date.localeCompare(b.date)
        );

        setAllContributions(sortedContributions);

        // 2. Extract unique years in reverse order (e.g. 2026, 2025)
        const years = Array.from(
          new Set(sortedContributions.map((day: any) => day.date.split("-")[0]))
        ).reverse();
        setAvailableYears(years as string[]);
      } catch (err) {
        console.error("Failed to fetch GitHub calendar contributions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveActivity();
    fetchCalendar();
  }, []);

  // Filter contributions when selectedYear or allContributions change
  useEffect(() => {
    if (allContributions.length === 0) return;

    if (selectedYear === "lastYear") {
      // Filter out future pre-generated dates and slice the last 365 days
      const todayStr = new Date().toISOString().split("T")[0];
      const pastAndPresentContributions = allContributions.filter((day) => 
        day.date <= todayStr
      );
      const sliced = pastAndPresentContributions.slice(-365);
      
      setCalendarData(sliced);
      const total = sliced.reduce((sum, day) => sum + day.count, 0);
      setTotalContributions(total);
    } else {
      // Filter by calendar year
      const filtered = allContributions.filter((day) => 
        day.date.startsWith(`${selectedYear}-`)
      );
      
      setCalendarData(filtered);
      const total = filtered.reduce((sum, day) => sum + day.count, 0);
      setTotalContributions(total);
    }
  }, [selectedYear, allContributions]);

  if (!mounted || loading) {
    return (
      <div className="github-chart-section" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", margin: "0 auto 40px auto", padding: "40px", backgroundColor: "#ffffff", border: "2px solid #000000", borderRadius: "6px", boxShadow: "3px 3px 0px #000000", minHeight: "280px" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.5px" }}>GitHub Contributions</h3>
        <div style={{ color: "#64748b", fontSize: "0.95rem" }}>Loading contributions...</div>
      </div>
    );
  }

  // Label configuration based on selection
  const labelTotalText = selectedYear === "lastYear" 
    ? `${totalContributions?.toLocaleString()} contributions in the last year`
    : `${totalContributions?.toLocaleString()} contributions in ${selectedYear}`;

  return (
    <div className="github-chart-section" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", margin: "0 auto 40px auto", padding: "40px", backgroundColor: "#ffffff", border: "2px solid #000000", borderRadius: "6px", boxShadow: "3px 3px 0px #000000" }}>
      <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.5px" }}>GitHub Contributions</h3>
      
      {/* Neubrutalist Year Switcher */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px", justifyContent: "center", width: "100%" }}>
        <button
          onClick={() => setSelectedYear("lastYear")}
          style={{
            padding: "6px 12px",
            fontSize: "0.8rem",
            fontWeight: 700,
            backgroundColor: selectedYear === "lastYear" ? "#000000" : "#ffffff",
            color: selectedYear === "lastYear" ? "#ffffff" : "#000000",
            border: "2px solid #000000",
            borderRadius: "4px",
            boxShadow: selectedYear === "lastYear" ? "none" : "2px 2px 0px #000000",
            cursor: "pointer",
            transform: selectedYear === "lastYear" ? "translate(1px, 1px)" : "none",
            transition: "all 0.1s ease",
            outline: "none"
          }}
        >
          Last 12 Months
        </button>
        {availableYears.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            style={{
              padding: "6px 12px",
              fontSize: "0.8rem",
              fontWeight: 700,
              backgroundColor: selectedYear === year ? "#000000" : "#ffffff",
              color: selectedYear === year ? "#ffffff" : "#000000",
              border: "2px solid #000000",
              borderRadius: "4px",
              boxShadow: selectedYear === year ? "none" : "2px 2px 0px #000000",
              cursor: "pointer",
              transform: selectedYear === year ? "translate(1px, 1px)" : "none",
              transition: "all 0.1s ease",
              outline: "none"
            }}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="calendar-wrapper" style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", overflowX: "auto" }}>
        {calendarData.length > 0 ? (
          <ActivityCalendar
            data={calendarData}
            theme={{
              light: ['#ebedf0', '#77b0e9ff', '#2581ddff', '#0c64b5ff', '#0c559aff'],
              dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
            }}
            labels={{
              totalCount: labelTotalText,
            }}
            blockSize={blockSize}
            blockMargin={5}
            colorScheme="light"
          />
        ) : (
          <div style={{ color: "#64748b", fontSize: "0.95rem", padding: "20px", textAlign: "center" }}>
            Unable to load contributions grid. Please check your connection or view directly on <a href="https://github.com/AdityaKatyal8899" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "#3f8efc" }}>GitHub</a>.
          </div>
        )}
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