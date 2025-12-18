function Landing({ setPage }) {
  return (
    <div className="card fade">
      <h1>🚀 TalentLink</h1>
      <p>Hire talent. Work smart. Build faster.</p>

      <button onClick={() => setPage("login")}>Get Started</button>

      <div className="link" onClick={() => setPage("register")}>
        Create an Account
      </div>
    </div>
  );
}

export default Landing;
