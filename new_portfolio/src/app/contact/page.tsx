"use client";

import React, { useState, useEffect } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [statusColor, setStatusColor] = useState("");
  const [isSending, setIsSending] = useState(false);

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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setFormStatus("⚠️ Please fill out all fields.");
      setStatusColor("#ff4d6d");
      return;
    }

    setIsSending(true);
    setFormStatus("Sending...");
    setStatusColor("#3f8efc");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send email");
      }

      setFormStatus("✅ Sent!");
      setStatusColor("green");
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setFormStatus(""), 4000);
    } catch (err: any) {
      console.error("Contact Form SMTP Error:", err);
      setFormStatus("❌ Failed to send");
      setStatusColor("red");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="page-container">
      {/* Social Links */}
      <section className="socials reveal show" id="socials" style={{ padding: "40px 6%" }}>
        <h2 className="section-title">Connect With Me</h2>
        <div className="uiverse-icons">
          <div className="tooltip-container github">
            <div className="tooltip">
              <div className="profile">
                <div className="user">
                  <div className="img"><i className="fa-brands fa-github"></i></div>
                  <div className="details">
                    <div className="title-line"><i className="fa-brands fa-github profile-icon"></i><div className="name">GitHub</div></div>
                    <div className="username">@AdityaKatyal8899</div>
                  </div>
                </div>
                <div className="about">Projects & Repos</div>
              </div>
            </div>
            <div className="text">
              <a className="icon" href="https://github.com/AdityaKatyal8899" target="_blank" rel="noopener noreferrer">
                <div className="layer">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span className="githubSVG">
                    <i className="fa-brands fa-github svgIcon"></i>
                  </span>
                </div>
                <div className="text">GitHub</div>
              </a>
            </div>
          </div>

          <div className="tooltip-container linkedin">
            <div className="tooltip">
              <div className="profile">
                <div className="user">
                  <div className="img"><i className="fa-brands fa-linkedin"></i></div>
                  <div className="details">
                    <div className="title-line"><i className="fa-brands fa-linkedin profile-icon"></i><div className="name">LinkedIn</div></div>
                    <div className="username">@adityakatyal</div>
                  </div>
                </div>
                <div className="about">Professional Network</div>
              </div>
            </div>
            <div className="text">
              <a className="icon" href="https://www.linkedin.com/in/aditya-katyal-1b6292296?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer">
                <div className="layer">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span className="linkedinSVG">
                    <i className="fa-brands fa-linkedin svgIcon"></i>
                  </span>
                </div>
                <div className="text">LinkedIn</div>
              </a>
            </div>
          </div>

          <div className="tooltip-container instagram">
            <div className="tooltip">
              <div className="profile">
                <div className="user">
                  <div className="img"><i className="fa-brands fa-instagram"></i></div>
                  <div className="details">
                    <div className="title-line"><i className="fa-brands fa-instagram profile-icon"></i><div className="name">Instagram</div></div>
                    <div className="username">@theonewhomnobodywants_____</div>
                  </div>
                </div>
                <div className="about">Follow me on Instagram</div>
              </div>
            </div>
            <div className="text">
              <a className="icon" href="https://www.instagram.com/theonewhomnobodywants_____/" target="_blank" rel="noopener noreferrer">
                <div className="layer">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span className="instagramSVG">
                    <i className="fa-brands fa-instagram svgIcon"></i>
                  </span>
                </div>
                <div className="text">Instagram</div>
              </a>
            </div>
          </div>

          <div className="tooltip-container peerlist">
            <div className="tooltip">
              <div className="profile">
                <div className="user">
                  <div className="img">
                    <svg role="img" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 0C2.667 0 0 2.667 0 12s2.673 12 12 12 12-2.667 12-12S21.327 0 12 0zm8.892 20.894c-1.57 1.569-4.247 2.249-8.892 2.249s-7.322-.68-8.892-2.25C1.735 19.522 1.041 17.3.89 13.654A39.74 39.74 0 0 1 .857 12c0-1.162.043-2.201.13-3.13.177-1.859.537-3.278 1.106-4.366.284-.544.62-1.006 1.013-1.398s.854-.729 1.398-1.013C5.592 1.524 7.01 1.164 8.87.988 9.799.9 10.838.858 12 .858c4.645 0 7.322.68 8.892 2.248 1.569 1.569 2.25 4.246 2.25 8.894s-.681 7.325-2.25 8.894zM20.538 3.46C19.064 1.986 16.51 1.357 12 1.357c-4.513 0-7.067.629-8.54 2.103C1.986 4.933 1.357 7.487 1.357 12c0 4.511.63 7.065 2.105 8.54C4.936 22.014 7.49 22.643 12 22.643s7.064-.629 8.538-2.103c1.475-1.475 2.105-4.029 2.105-8.54s-.63-7.065-2.105-8.54zM14.25 16.49a6.097 6.097 0 0 1-2.442.59v2.706H10.45v.357H6.429V5.57h.357V4.214h5.676c3.565 0 6.467 2.81 6.467 6.262 0 2.852-1.981 5.26-4.68 6.013zm-1.788-8.728H10.45v5.428h2.011c1.532 0 2.802-1.2 2.802-2.714s-1.27-2.714-2.802-2.714zm.901 4.351c.117-.239.186-.502.186-.78 0-1.01-.855-1.857-1.945-1.857h-.296V8.62h1.154c1.09 0 1.945.847 1.945 1.857 0 .705-.422 1.323-1.044 1.637zm4.104 1.493c.043-.063.083-.129.123-.194a5.653 5.653 0 0 0 .526-1.103 5.56 5.56 0 0 0 .11-.362c.02-.076.042-.15.06-.227a5.58 5.58 0 0 0 .073-.41c.01-.068.025-.134.032-.203.024-.207.038-.417.038-.63 0-3.198-2.687-5.763-5.967-5.763H7.286v14.572h4.022v-3.048h1.154c1.43 0 2.747-.488 3.778-1.303a5.92 5.92 0 0 0 .46-.406c.035-.034.066-.07.1-.105.107-.11.21-.22.308-.337.044-.053.084-.108.126-.162.081-.104.16-.21.233-.319zm-5.005 1.775H10.45v3.048H8.143V5.57h4.319c2.837 0 5.11 2.211 5.11 4.905s-2.273 4.905-5.11 4.905z"/></svg>
                  </div>
                  <div className="details">
                    <div className="title-line">
                      <svg role="img" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: "4px" }}><path d="M12 0C2.667 0 0 2.667 0 12s2.673 12 12 12 12-2.667 12-12S21.327 0 12 0zm8.892 20.894c-1.57 1.569-4.247 2.249-8.892 2.249s-7.322-.68-8.892-2.25C1.735 19.522 1.041 17.3.89 13.654A39.74 39.74 0 0 1 .857 12c0-1.162.043-2.201.13-3.13.177-1.859.537-3.278 1.106-4.366.284-.544.62-1.006 1.013-1.398s.854-.729 1.398-1.013C5.592 1.524 7.01 1.164 8.87.988 9.799.9 10.838.858 12 .858c4.645 0 7.322.68 8.892 2.248 1.569 1.569 2.25 4.246 2.25 8.894s-.681 7.325-2.25 8.894zM20.538 3.46C19.064 1.986 16.51 1.357 12 1.357c-4.513 0-7.067.629-8.54 2.103C1.986 4.933 1.357 7.487 1.357 12c0 4.511.63 7.065 2.105 8.54C4.936 22.014 7.49 22.643 12 22.643s7.064-.629 8.538-2.103c1.475-1.475 2.105-4.029 2.105-8.54s-.63-7.065-2.105-8.54zM14.25 16.49a6.097 6.097 0 0 1-2.442.59v2.706H10.45v.357H6.429V5.57h.357V4.214h5.676c3.565 0 6.467 2.81 6.467 6.262 0 2.852-1.981 5.26-4.68 6.013zm-1.788-8.728H10.45v5.428h2.011c1.532 0 2.802-1.2 2.802-2.714s-1.27-2.714-2.802-2.714zm.901 4.351c.117-.239.186-.502.186-.78 0-1.01-.855-1.857-1.945-1.857h-.296V8.62h1.154c1.09 0 1.945.847 1.945 1.857 0 .705-.422 1.323-1.044 1.637zm4.104 1.493c.043-.063.083-.129.123-.194a5.653 5.653 0 0 0 .526-1.103 5.56 5.56 0 0 0 .11-.362c.02-.076.042-.15.06-.227a5.58 5.58 0 0 0 .073-.41c.01-.068.025-.134.032-.203.024-.207.038-.417.038-.63 0-3.198-2.687-5.763-5.967-5.763H7.286v14.572h4.022v-3.048h1.154c1.43 0 2.747-.488 3.778-1.303a5.92 5.92 0 0 0 .46-.406c.035-.034.066-.07.1-.105.107-.11.21-.22.308-.337.044-.053.084-.108.126-.162.081-.104.16-.21.233-.319zm-5.005 1.775H10.45v3.048H8.143V5.57h4.319c2.837 0 5.11 2.211 5.11 4.905s-2.273 4.905-5.11 4.905z"/></svg>
                      <div className="name">Peerlist</div>
                    </div>
                    <div className="username">@adityakatyal</div>
                  </div>
                </div>
                <div className="about">My Professional Profile</div>
              </div>
            </div>
            <div className="text">
              <a className="icon" href="https://peerlist.io/adityakatyal" target="_blank" rel="noopener noreferrer">
                <div className="layer">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span className="peerlistSVG">
                    <svg role="img" viewBox="0 0 24 24" className="svgIcon" fill="currentColor"><path d="M12 0C2.667 0 0 2.667 0 12s2.673 12 12 12 12-2.667 12-12S21.327 0 12 0zm8.892 20.894c-1.57 1.569-4.247 2.249-8.892 2.249s-7.322-.68-8.892-2.25C1.735 19.522 1.041 17.3.89 13.654A39.74 39.74 0 0 1 .857 12c0-1.162.043-2.201.13-3.13.177-1.859.537-3.278 1.106-4.366.284-.544.62-1.006 1.013-1.398s.854-.729 1.398-1.013C5.592 1.524 7.01 1.164 8.87.988 9.799.9 10.838.858 12 .858c4.645 0 7.322.68 8.892 2.248 1.569 1.569 2.25 4.246 2.25 8.894s-.681 7.325-2.25 8.894zM20.538 3.46C19.064 1.986 16.51 1.357 12 1.357c-4.513 0-7.067.629-8.54 2.103C1.986 4.933 1.357 7.487 1.357 12c0 4.511.63 7.065 2.105 8.54C4.936 22.014 7.49 22.643 12 22.643s7.064-.629 8.538-2.103c1.475-1.475 2.105-4.029 2.105-8.54s-.63-7.065-2.105-8.54zM14.25 16.49a6.097 6.097 0 0 1-2.442.59v2.706H10.45v.357H6.429V5.57h.357V4.214h5.676c3.565 0 6.467 2.81 6.467 6.262 0 2.852-1.981 5.26-4.68 6.013zm-1.788-8.728H10.45v5.428h2.011c1.532 0 2.802-1.2 2.802-2.714s-1.27-2.714-2.802-2.714zm.901 4.351c.117-.239.186-.502.186-.78 0-1.01-.855-1.857-1.945-1.857h-.296V8.62h1.154c1.09 0 1.945.847 1.945 1.857 0 .705-.422 1.323-1.044 1.637zm4.104 1.493c.043-.063.083-.129.123-.194a5.653 5.653 0 0 0 .526-1.103 5.56 5.56 0 0 0 .11-.362c.02-.076.042-.15.06-.227a5.58 5.58 0 0 0 .073-.41c.01-.068.025-.134.032-.203.024-.207.038-.417.038-.63 0-3.198-2.687-5.763-5.967-5.763H7.286v14.572h4.022v-3.048h1.154c1.43 0 2.747-.488 3.778-1.303a5.92 5.92 0 0 0 .46-.406c.035-.034.066-.07.1-.105.107-.11.21-.22.308-.337.044-.053.084-.108.126-.162.081-.104.16-.21.233-.319zm-5.005 1.775H10.45v3.048H8.143V5.57h4.319c2.837 0 5.11 2.211 5.11 4.905s-2.273 4.905-5.11 4.905z"/></svg></span>
                </div>
                <div className="text">Peerlist</div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider reveal show"></div>

      {/* Contact Form */}
      <section className="contact reveal show" id="contact" style={{ padding: "40px 6%" }}>
        <div className="card">
          <span className="card__title">Contact Me</span>
          <p className="card__content">Have an opportunity or question? Drop me a message and I’ll get back soon.</p>
          <form className="card__form" onSubmit={handleContactSubmit}>
            <input
              id="name"
              placeholder="Your Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              id="email"
              placeholder="Your Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
              id="message"
              placeholder="Your Message"
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="sign-up" id="sendButton" type="submit" disabled={isSending}>
              <i className="fa-solid fa-paper-plane"></i> {isSending ? "Sending..." : "Send"}
            </button>
            <div id="form-status" style={{ color: statusColor }}>{formStatus}</div>
          </form>
        </div>
      </section>
    </div>
  );
}
