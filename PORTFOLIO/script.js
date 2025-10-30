document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle (Uiverse switch)
  const rootEl = document.documentElement;
  const toggleCheckbox = document.querySelector('.theme-toggle-wrap .input');
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      rootEl.classList.add('theme-dark');
      if (toggleCheckbox) toggleCheckbox.checked = true;
    } else {
      rootEl.classList.remove('theme-dark');
      if (toggleCheckbox) toggleCheckbox.checked = false;
    }
  };
  const saved = localStorage.getItem('theme') || 'light';
  applyTheme(saved);
  if (toggleCheckbox) {
    toggleCheckbox.addEventListener('change', (e) => {
      const wantDark = e.currentTarget.checked;
      const mode = wantDark ? 'dark' : 'light';
      localStorage.setItem('theme', mode);
      applyTheme(mode);
    });
  }
  // Floating bar height sync
  const floatingBar = document.querySelector(".floating-bar");
  const root = document.documentElement;

  const setBarHeightVar = () => {
    if (!floatingBar) return;
    const h = floatingBar.offsetHeight || 64;
    root.style.setProperty("--floating-bar-height", `${h}px`);
  };

  // Observe size changes of the floating bar (wrapping on small screens, font load, etc.)
  if (window.ResizeObserver && floatingBar) {
    const ro = new ResizeObserver(setBarHeightVar);
    ro.observe(floatingBar);
  }

  // Update on viewport resize/orientation change
  window.addEventListener("resize", setBarHeightVar, { passive: true });
  window.addEventListener("orientationchange", setBarHeightVar);

  // Initial set after fonts/styles applied
  requestAnimationFrame(setBarHeightVar);
  window.addEventListener("load", setBarHeightVar);

  // Flip floating bar colors when footer is visible (keep transparency intact)
  const footer = document.querySelector('.site-footer');
  if (footer && floatingBar && 'IntersectionObserver' in window) {
    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            floatingBar.classList.add('on-footer');
          } else {
            floatingBar.classList.remove('on-footer');
          }
        });
      },
      { threshold: 0.01 }
    );
    footerObserver.observe(footer);
  }

  // 🎯 Progress Rings
  const rings = document.querySelectorAll(".progress-ring");

  rings.forEach((ring) => {
    const percent = ring.getAttribute("data-percent");
    const circle = ring.querySelector(".progress");
    const radius = 50;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;

    requestAnimationFrame(() => {
      const offset = circumference - (percent / 100) * circumference;
      circle.style.transition = "stroke-dashoffset 1.5s ease-out";
      circle.style.strokeDashoffset = offset;
    });
  });

  // 🎯 Project Section Fade-Up Animation
  const projects = document.querySelectorAll(".project-row");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        } else {
          entry.target.classList.remove("show");
        }
      });
    },
    { threshold: 0.15 }
  );

  projects.forEach((proj) => observer.observe(proj));



  // --- Achievement Cards Fade-In on Scroll ---
  const cards = document.querySelectorAll(".achievement-card");

  const revealCards = () => {
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        card.classList.add("visible");
      }
    });
  };

  window.addEventListener("scroll", revealCards);
  revealCards(); // Run on load

    const reveals = document.querySelectorAll(".reveal");

  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;

    reveals.forEach((el) => {
      const boxTop = el.getBoundingClientRect().top;

      if (boxTop < triggerBottom) {
        el.classList.add("show");
      } else {
        el.classList.remove("show");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  // --- Mobile typewriter fallback for heading ---
  const h1 = document.querySelector(".typewriter");
  if (h1) {
    const mq = window.matchMedia("(max-width: 600px)");
    const originalText = h1.textContent;

    const runTypewriter = () => {
      // Avoid re-running
      if (h1.dataset.typed === "1") return;
      h1.dataset.typed = "1";
      h1.textContent = "";
      let i = 0;
      const speed = 25; // ms per char for smooth mobile typing
      const tick = () => {
        if (i <= originalText.length) {
          h1.textContent = originalText.slice(0, i);
          i += 1;
          setTimeout(tick, speed);
        }
      };
      tick();
    };

    const maybeType = () => {
      if (mq.matches) {
        runTypewriter();
      }
    };

    // Trigger on load and when viewport changes across breakpoint
    maybeType();
    mq.addEventListener ? mq.addEventListener("change", maybeType) : mq.addListener(maybeType);
  }

  // --- Skills Histogram (all viewports) ---
  const buildSkillBars = () => {
    const barsContainer = document.getElementById("skills-bars");
    if (!barsContainer) return;

    // Prevent duplicate builds
    if (barsContainer.dataset.built === "1") return;

    // Static skills data (user-specified)
    const skillsData = [
      { name: "Python", percent: 70 },
      { name: "JavaScript", percent: 65 },
      { name: "OpenCV", percent: 65 },
      { name: "ffmpeg", percent: 75 },
      { name: "MONGODB", percent: 80 },
      { name: "SQL", percent: 78 },
      { name: "Netlify", percent: 80 },
      { name: "Render", percent: 80 },
      { name: "Vercel", percent: 80 },
      { name: "n8n", percent: 50 },
    ];

    const frag = document.createDocumentFragment();
    skillsData.forEach(({ name, percent }) => {
      const row = document.createElement("div");
      row.className = "skills-bar";

      const label = document.createElement("div");
      label.className = "skills-bar-label";
      label.textContent = name;

      const track = document.createElement("div");
      track.className = "skills-bar-track";

      const fill = document.createElement("div");
      fill.className = "skills-bar-fill";
      fill.style.width = "0%";
      fill.setAttribute("data-target", String(percent));

      track.appendChild(fill);
      row.appendChild(label);
      row.appendChild(track);
      frag.appendChild(row);
    });

    barsContainer.innerHTML = "";
    barsContainer.appendChild(frag);
    barsContainer.dataset.built = "1";

    // Animate bars immediately after build for visibility (no scroll dependency)
    const fills = barsContainer.querySelectorAll(".skills-bar-fill");
    requestAnimationFrame(() => {
      fills.forEach((el) => {
        const target = parseInt(el.getAttribute("data-target"), 10) || 0;
        el.style.width = `${target}%`;
      });
    });
  };

  buildSkillBars();

  // --- EmailJS Contact Form Integration ---
const contactForm = document.getElementById("contactForm");
const status = document.getElementById("form-status");
const sendButton = document.getElementById("sendButton");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      status.textContent = "⚠️ Please fill out all fields.";
      status.style.color = "#ff4d6d";
      return;
    }

    const originalBtnHTML = sendButton ? sendButton.innerHTML : "";
    if (sendButton) {
      sendButton.disabled = true;
      sendButton.innerText = "Sending...";
    }
    status.textContent = "Sending...";
    status.style.color = "#3f8efc";

    if (!window.emailjs || typeof emailjs.send !== "function") {
      console.error("EmailJS is not available. Check script loading order or network errors.");
      status.textContent = "Failed to Send Message.";
      status.style.color = "red";
      if (sendButton) {
        sendButton.disabled = false;
        sendButton.innerHTML = originalBtnHTML || '<i class="fa-solid fa-paper-plane"></i>Send';
      }
      return;
    }

    emailjs
      .send("service_hh7woju", "template_q6klcq6", {
        from_name: name,
        from_email: email,
        message: message,
      }, "R4a1S2Mo0ivAFkmsu")
      .then(
        () => {
          console.log("EmailJS: send resolved successfully");
          status.textContent = "✅ Sent!";
          status.style.color = "green";
          contactForm.reset();
          setTimeout(() => {
            status.textContent = "";
          }, 4000);
          if (sendButton) {
            sendButton.disabled = false;
            sendButton.innerHTML = originalBtnHTML || '<i class="fa-solid fa-paper-plane"></i>Send';
          }
        },
        (error) => {
          console.error("EmailJS Error:", error);
          status.textContent = "❌ Failed";
          status.style.color = "red";
          if (sendButton) {
            sendButton.disabled = false;
            sendButton.innerHTML = originalBtnHTML || '<i class="fa-solid fa-paper-plane"></i>Send';
          }
        }
      );
  });
}

});