import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Talent Link</h1>
        <p style={styles.subtitle}>
          Connecting Clients & Freelancers Seamlessly
        </p>

        <div style={styles.buttonGroup}>
          <Link to="/login">
            <button style={styles.loginBtn}>Login</button>
          </Link>

          <Link to="/register">
            <button style={styles.registerBtn}>Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "15px",
    textAlign: "center",
    width: "350px",
    boxShadow: "0px 10px 25px rgba(0,0,0,0.2)",
  },
  title: {
    color: "#4f46e5",
    fontSize: "32px",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#555",
    marginBottom: "25px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
  },
  loginBtn: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
  registerBtn: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Home;
