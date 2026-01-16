// import { useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import "./AuthForm.css";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const isLoggedIn = localStorage.getItem("access");

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post(
//         "http://127.0.0.1:8000/api/users/login/",
//         { email, password }
//       );

//       // ✅ Store JWT tokens
//       localStorage.setItem("access", res.data.access);
//       localStorage.setItem("refresh", res.data.refresh);

//       setMessage("Login Successful!");
//     } catch (err) {
//       setMessage("Invalid email or password");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     setMessage("Logged out successfully");
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-card">
//         <h2 className="auth-title">Login</h2>

//         {message && <p className="message">{message}</p>}

//         {!isLoggedIn ? (
//           <>
//             <form onSubmit={handleLogin}>
//               <input
//                 type="email"
//                 className="auth-input"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />

//               <input
//                 type="password"
//                 className="auth-input"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />

//               <button className="auth-btn" type="submit">
//                 Login
//               </button>
//             </form>

//             <p style={{ marginTop: "15px" }}>
//               New user? <Link to="/register">Register</Link>
//             </p>
//           </>
//         ) : (
//           <>
//             <button
//               className="auth-btn"
//               style={{ background: "#dc3545" }}
//               onClick={handleLogout}
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Login;

// 16 jan


// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom"; // ✅ NEW
// import axios from "axios";
// import "./AuthForm.css";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const navigate = useNavigate(); // ✅ NEW

//   const isLoggedIn = localStorage.getItem("access");

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post(
//         "http://127.0.0.1:8000/api/users/login/",
//         { email, password }
//       );

//        console.log("LOGIN RESPONSE:", res.data);

//       // ✅ Store JWT tokens
//       localStorage.setItem("access", res.data.access);
//       navigate("/projects"); 
//       localStorage.setItem("refresh", res.data.refresh);
//       localStorage.setItem("role", res.data.user.role);
//       localStorage.setItem("accessToken", res.data.access);
//       localStorage.setItem("user_id", res.data.user.id);

//       // 🔁 REDIRECT BASED ON ROLE
// navigate("/dashboard"); // both client & freelancer go here

//       setMessage("Login Successful!");


//       // ✅ ROLE BASED REDIRECT
// if (res.data.role === "client") {
//   navigate("/projects");   // client sees own projects
// } else if (res.data.role === "freelancer") {
//   navigate("/projects");   // freelancer sees available projects
// }


//     } catch (err) {
//       setMessage("Invalid email or password");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     setMessage("Logged out successfully");
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-card">
//         <h2 className="auth-title">Login</h2>

//         {message && <p className="message">{message}</p>}

//         {!isLoggedIn ? (
//           <>
//             <form onSubmit={handleLogin}>
//               <input
//                 type="email"
//                 className="auth-input"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />

//               <input
//                 type="password"
//                 className="auth-input"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />

//               <button className="auth-btn" type="submit">
//                 Login
//               </button>
//             </form>

//             <p style={{ marginTop: "15px" }}>
//               New user? <Link to="/register">Register</Link>
//             </p>
//           </>
//         ) : (
//           <>
//             <button
//               className="auth-btn"
//               style={{ background: "#dc3545" }}
//               onClick={handleLogout}
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Login;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ NEW
import axios from "axios";
import "./AuthForm.css";

// Use relative URL for production (Render) and absolute URL for local dev
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : 'http://127.0.0.1:8000';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // ✅ NEW

  const isLoggedIn = localStorage.getItem("access");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/users/login/`,
        { email, password }
      );

       console.log("LOGIN RESPONSE:", res.data);

      // ✅ Store JWT tokens
      localStorage.setItem("access", res.data.access);
      navigate("/projects"); 
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("user_id", res.data.user.id);

      // 🔁 REDIRECT BASED ON ROLE
navigate("/dashboard"); // both client & freelancer go here

      setMessage("Login Successful!");


      // ✅ ROLE BASED REDIRECT
if (res.data.role === "client") {
  navigate("/projects");   // client sees own projects
} else if (res.data.role === "freelancer") {
  navigate("/projects");   // freelancer sees available projects
}


    } catch (err) {
      setMessage("Invalid email or password");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setMessage("Logged out successfully");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>

        {message && <p className="message">{message}</p>}

        {!isLoggedIn ? (
          <>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                className="auth-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                className="auth-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button className="auth-btn" type="submit">
                Login
              </button>
            </form>

            <p style={{ marginTop: "15px" }}>
              New user? <Link to="/register">Register</Link>
            </p>
          </>
        ) : (
          <>
            <button
              className="auth-btn"
              style={{ background: "#dc3545" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;