function Landing({ setPage }) {
  return (
    <div className="landing-root">
      {/* ================= HEADER ================= */}
      <header className="landing-header">
        <div className="logo">TalentLink</div>

        <nav className="nav-links">
          <span>How it works</span>
          <span>Features</span>
          <span>Pricing</span>
          <span onClick={() => setPage("login")}>Login</span>
          <button
            className="primary-btn small"
            onClick={() => setPage("register")}
          >
            Get Started
          </button>
        </nav>
      </header>

      {/* ================= HERO ================= */}
      <main className="hero">
        <div className="hero-content fade">
          <div className="badge">
            Trusted by modern freelancers & startups
          </div>

          <h1 className="hero-title">
            Build. Hire. Collaborate. <br />
            <span>All in one platform.</span>
          </h1>

          <p className="hero-subtitle">
            TalentLink connects skilled freelancers with serious clients using
            smart matching, secure contracts, and a modern workflow built for
            productivity.
          </p>

          <div className="hero-actions">
            <button
              className="primary-btn"
              onClick={() => setPage("register")}
            >
              Create Free Account
            </button>

            <button
              className="secondary-btn"
              onClick={() => setPage("login")}
            >
              Sign In
            </button>
          </div>

          <div className="hero-features">
            <span>✔ No credit card required</span>
            <span>✔ Secure contracts</span>
            <span>✔ Client & Freelancer roles</span>
            <span>✔ Built for scale</span>
          </div>
        </div>
      </main>

      {/* ================= FEATURES ================= */}
      <section
        style={{
          padding: "80px 60px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "32px",
          }}
        >
          <div className="card fade">
            <h3>🚀 Smart Matching</h3>
            <p className="muted">
              Projects are intelligently matched with freelancers based on
              skills, budget, and availability.
            </p>
          </div>

          <div className="card fade">
            <h3>📄 Secure Contracts</h3>
            <p className="muted">
              Built-in contracts ensure transparency, accountability, and trust
              for both parties.
            </p>
          </div>

          <div className="card fade">
            <h3>💬 Real-time Messaging</h3>
            <p className="muted">
              Communicate instantly with freelancers or clients using the
              integrated chat system.
            </p>
          </div>

          <div className="card fade">
            <h3>📊 Powerful Dashboard</h3>
            <p className="muted">
              Track projects, proposals, contracts, and performance all in one
              beautiful dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section
        style={{
          padding: "100px 24px",
          textAlign: "center",
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(34,211,238,0.12))",
        }}
      >
        <h2 style={{ fontSize: "2.6rem", marginBottom: "16px" }}>
          Ready to get started?
        </h2>

        <p className="muted" style={{ maxWidth: "600px", margin: "0 auto 32px" }}>
          Join TalentLink today and experience a modern way to hire and work
          remotely with confidence.
        </p>

        <button
          className="primary-btn"
          style={{ fontSize: "17px", padding: "16px 36px" }}
          onClick={() => setPage("register")}
        >
          Get Started for Free
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="landing-footer">
        © {new Date().getFullYear()} TalentLink · Built for freelancers &
        clients worldwide 🌍
      </footer>
    </div>
  );
}

export default Landing;
