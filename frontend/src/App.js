// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import AuthPage from "./pages/AuthPage";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ProjectFeed from "./pages/ProjectFeed";
// import ProjectDetails from "./pages/ProjectDetails";


// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Auth pages */}
//         <Route path="/" element={<AuthPage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Main app */}
//         <Route path="/projects" element={<ProjectFeed />} />
//         <Route path="/projects/:id" element={<ProjectDetails />} />

//       </Routes>
//     </Router>
//   );
// }

// export default App;
// import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";


// import AuthPage from "./pages/AuthPage";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ProjectFeed from "./pages/ProjectFeed";
// import ProjectDetails from "./pages/ProjectDetails";

// import ClientProjectProposals from "./pages/ClientProjectProposals";
// import FreelancerProposals from "./pages/FreelancerProposals";
// import CreateProject from "./pages/CreateProject";
// import Contracts from "./pages/Contracts";
// import ContractChat from "./pages/ContractChat";
// import Notifications from "./pages/Notifications";
// function Navbar() {
//   const location = useLocation();
//   const token = localStorage.getItem("access");

//   // Hide navbar on auth pages
//   if (!token || ["/", "/login", "/register"].includes(location.pathname)) {
//     return null;
//   }

//   return (
//     <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
//       <Link to="/projects" style={{ marginRight: "15px" }}>Projects</Link>
//       <Link to="/contracts" style={{ marginRight: "15px" }}>Contracts</Link>
//       <Link to="/notifications">Notifications</Link>
//     </div>
//   );
// }


// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

// useEffect(() => {
//   const token = localStorage.getItem("access");
//   setIsLoggedIn(!!token);
// }, []);


//   return (
//     <Router>

//       {/* 🔹 Top Navigation (ONLY after login) */}
//       {isLoggedIn && (
//         <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
//           <Link to="/projects" style={{ marginRight: "15px" }}>
//             Projects
//           </Link>

//           <Link to="/contracts" style={{ marginRight: "15px" }}>
//             Contracts
//           </Link>

//           <Link to="/notifications">
//             Notifications
//           </Link>
//         </div>
//       )}

//       <Routes>
//         {/* Home */}
//         <Route path="/" element={<AuthPage />} />

//         {/* Auth */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Projects */}
//         <Route path="/projects" element={<ProjectFeed />} />
//         <Route path="/projects/:id" element={<ProjectDetails />} />

//         {/* Client */}
//         <Route
//           path="/client/projects/:projectId/proposals"
//           element={<ClientProjectProposals />}
//         />

//         <Route
//           path="/client/projects/create"
//           element={<CreateProject />}
//         />

//         {/* Freelancer */}
//         <Route
//           path="/freelancer/proposals"
//           element={<FreelancerProposals />}
//         />

//         {/* Contracts */}
//         <Route path="/contracts" element={<Contracts />} />
//         <Route
//           path="/contracts/:contractId/chat"
//           element={<ContractChat />}
//         />

//         {/* Notifications */}
//         <Route path="/notifications" element={<Notifications />} />
//       </Routes>

//     </Router>
//   );
// }

// export default App;

//latest old one 

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link,
//   useLocation,
//   useNavigate
// } from "react-router-dom";

// import { useState, useEffect } from "react";

// import AuthPage from "./pages/AuthPage";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ProjectFeed from "./pages/ProjectFeed";
// import ProjectDetails from "./pages/ProjectDetails";

// import ClientProjectProposals from "./pages/ClientProjectProposals";
// import FreelancerProposals from "./pages/FreelancerProposals";
// import CreateProject from "./pages/CreateProject";
// import Contracts from "./pages/Contracts";
// import ContractChat from "./pages/ContractChat";
// import Notifications from "./pages/Notifications";

// import "./components/Navbar.css";
// import LeaveReview from "./pages/LeaveReview";
// import Profile from "./pages/Profile";



// /* =========================
//    Navbar Component
//    ========================= */
// function Navbar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("access");

//   // 🔔 UNREAD COUNT STATE
//   const [unreadCount, setUnreadCount] = useState(0);

//   // 🔔 Fetch unread notifications count
//   // useEffect(() => {
//   //   if (!token) return;

//   //   fetch("http://127.0.0.1:8000/api/notifications/unread-count/", {
//   //     headers: {
//   //       Authorization: `Bearer ${token}`,
//   //     },
//   //   })
//   //     .then(res => res.json())
//   //     .then(data => {
//   //       setUnreadCount(data.unread_count || 0);
//   //     })
//   //     .catch(() => setUnreadCount(0));
//   // }, [token]);
//   useEffect(() => {
//   if (!token) return;

//   const fetchUnreadCount = () => {
//     fetch("http://127.0.0.1:8000/api/notifications/unread-count/", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then(res => res.json())
//       .then(data => {
//         setUnreadCount(data.unread_count || 0);
//       })
//       .catch(() => setUnreadCount(0));
//   };

//   // Initial fetch
//   fetchUnreadCount();

//   // Listen for updates
//   window.addEventListener("notifications-updated", fetchUnreadCount);

//   return () => {
//     window.removeEventListener("notifications-updated", fetchUnreadCount);
//   };
// }, [token]);


//   // ❌ Hide navbar if not logged in or on auth pages
//   if (
//     !token ||
//     location.pathname === "/" ||
//     location.pathname === "/login" ||
//     location.pathname === "/register"
//   ) {
//     return null;
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("access");
//     navigate("/login");
//   };

//   return (
//     <div className="navbar">
//       {/* Left */}
//       <div className="navbar-left">
//         TalentLink
//       </div>

//       {/* Center */}
//       <div className="navbar-center">
//         <Link to="/projects">Projects</Link>
//         <Link to="/contracts">Contracts</Link>

//         <Link to="/notifications" className="notifications-link">
//           Notifications
//           {unreadCount > 0 && (
//             <span className="notification-indicator">
//               ({unreadCount})
//             </span>
//           )}
//         </Link>
//       </div>

//       {/* Right */}
//       <div className="navbar-right">
//         <button onClick={handleLogout}>Logout</button>
//       </div>
//     </div>
//   );
// }



// /* =========================
//    App Component
//    ========================= */
// function App() {
//   return (
//     <Router>

//       {/* 🔹 Top Navigation */}
//       <Navbar />

//       <Routes>
//         {/* Home */}
//         <Route path="/" element={<AuthPage />} />

//         {/* Auth */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Projects */}
//         <Route path="/projects" element={<ProjectFeed />} />
//         <Route path="/projects/:id" element={<ProjectDetails />} />

//         {/* Client */}
//         <Route
//           path="/client/projects/:projectId/proposals"
//           element={<ClientProjectProposals />}
//         />
//         <Route
//           path="/client/projects/create"
//           element={<CreateProject />}
//         />

//         {/* Freelancer */}
//         <Route
//           path="/freelancer/proposals"
//           element={<FreelancerProposals />}
//         />

//         {/* Contracts */}
//         <Route path="/contracts" element={<Contracts />} />
//         <Route
//           path="/contracts/:contractId/chat"
//           element={<ContractChat />}
//         />

//         {/* Notifications */}
//         <Route path="/notifications" element={<Notifications />} />

//         <Route path="/contracts/:contractId/review" element={<LeaveReview />}/>

//         <Route path="/profile/:userId" element={<Profile />} />


//       </Routes>

//     </Router>
//   );
// }

// export default App;


// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link,
//   useLocation,
//   useNavigate
// } from "react-router-dom";

// import { useState, useEffect } from "react";

// import AuthPage from "./pages/AuthPage";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ProjectFeed from "./pages/ProjectFeed";
// import ProjectDetails from "./pages/ProjectDetails";

// import ClientProjectProposals from "./pages/ClientProjectProposals";
// import FreelancerProposals from "./pages/FreelancerProposals";
// import CreateProject from "./pages/CreateProject";
// import Contracts from "./pages/Contracts";
// import ContractChat from "./pages/ContractChat";
// import Notifications from "./pages/Notifications";
// import LeaveReview from "./pages/LeaveReview";
// import Profile from "./pages/Profile";

// import "./components/Navbar.css";
// import Dashboard from "./pages/Dashboard";


// /* =========================
//    Navbar Component
//    ========================= */
// function Navbar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("access");
//   const userId = localStorage.getItem("user_id");

//   const [unreadCount, setUnreadCount] = useState(0);

//   useEffect(() => {
//     if (!token) return;

//     const fetchUnreadCount = () => {
//       fetch("http://127.0.0.1:8000/api/notifications/unread-count/", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//         .then(res => res.json())
//         .then(data => {
//           setUnreadCount(data.unread_count || 0);
//         })
//         .catch(() => setUnreadCount(0));
//     };

//     fetchUnreadCount();
//     window.addEventListener("notifications-updated", fetchUnreadCount);

//     return () => {
//       window.removeEventListener("notifications-updated", fetchUnreadCount);
//     };
//   }, [token]);

//   // Hide navbar if not logged in or on auth pages
//   if (
//     !token ||
//     location.pathname === "/" ||
//     location.pathname === "/login" ||
//     location.pathname === "/register"
//   ) {
//     return null;
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("access");
//     localStorage.removeItem("user_id");
//     navigate("/login");
//   };

//   return (
//     <div className="navbar">
//       {/* Left */}
//       <div className="navbar-left">TalentLink</div>

//       {/* Center */}
//       <div className="navbar-center">
//         <Link to="/projects">Projects</Link>
//         <Link to="/contracts">Contracts</Link>

//         <Link to="/notifications" className="notifications-link">
//           Notifications
//           {unreadCount > 0 && (
//             <span className="notification-indicator">
//               ({unreadCount})
//             </span>
//           )}
//         </Link>

//         {/* ✅ Profile Link */}
//         {userId && (
//           <Link to={`/profile/${userId}`}>
//             Profile
//           </Link>
//         )}
//       </div>

//       {/* Right */}
//       <div className="navbar-right">
//         <button onClick={handleLogout}>Logout</button>
//       </div>
//     </div>
//   );
// }

// /* =========================
//    App Component
//    ========================= */
// function App() {
//   return (
//     <Router>
//       {/* Top Navigation */}
//       <Navbar />

//       <Routes>
//         {/* Home */}
//         <Route path="/" element={<AuthPage />} />

//         {/* Auth */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Projects */}
//         <Route path="/projects" element={<ProjectFeed />} />
//         <Route path="/projects/:id" element={<ProjectDetails />} />

//         {/* Client */}
//         <Route
//           path="/client/projects/:projectId/proposals"
//           element={<ClientProjectProposals />}
//         />
//         <Route
//           path="/client/projects/create"
//           element={<CreateProject />}
//         />

//         {/* Freelancer */}
//         <Route
//           path="/freelancer/proposals"
//           element={<FreelancerProposals />}
//         />

//         {/* Contracts */}
//         <Route path="/contracts" element={<Contracts />} />
//         <Route
//           path="/contracts/:contractId/chat"
//           element={<ContractChat />}
//         />

//         {/* Reviews */}
//         <Route
//           path="/contracts/:contractId/review"
//           element={<LeaveReview />}
//         />

//         {/* Notifications */}
//         <Route path="/notifications" element={<Notifications />} />

//         {/* Profile */}
//         <Route path="/profile/:userId" element={<Profile />} />
//         <Route path="/dashboard" element={<Dashboard />} />

//       </Routes>
//     </Router>
//   );
// }

// export default App;

// jan 17

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link,
//   useLocation,
//   useNavigate
// } from "react-router-dom";

// import { useState, useEffect } from "react";

// import AuthPage from "./pages/AuthPage";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ProjectFeed from "./pages/ProjectFeed";
// import ProjectDetails from "./pages/ProjectDetails";

// import ClientProjectProposals from "./pages/ClientProjectProposals";
// import FreelancerProposals from "./pages/FreelancerProposals";
// import CreateProject from "./pages/CreateProject";
// import Contracts from "./pages/Contracts";
// import ContractChat from "./pages/ContractChat";
// import Notifications from "./pages/Notifications";
// import LeaveReview from "./pages/LeaveReview";
// import Profile from "./pages/Profile";
// import Dashboard from "./pages/Dashboard";

// import "./components/Navbar.css";

// /* =========================
//    Navbar Component
//    ========================= */
// function Navbar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("access");
//   const userId = localStorage.getItem("user_id");

//   const [unreadCount, setUnreadCount] = useState(0);

//   useEffect(() => {
//     if (!token) return;

//     const fetchUnreadCount = () => {
//       fetch("http://127.0.0.1:8000/api/notifications/unread-count/", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//         .then(res => res.json())
//         .then(data => {
//           setUnreadCount(data.unread_count || 0);
//         })
//         .catch(() => setUnreadCount(0));
//     };

//     fetchUnreadCount();
//     window.addEventListener("notifications-updated", fetchUnreadCount);

//     return () => {
//       window.removeEventListener("notifications-updated", fetchUnreadCount);
//     };
//   }, [token]);

//   // Hide navbar if not logged in or on auth pages
//   if (
//     !token ||
//     location.pathname === "/" ||
//     location.pathname === "/login" ||
//     location.pathname === "/register"
//   ) {
//     return null;
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("access");
//     localStorage.removeItem("user_id");
//     navigate("/login");
//   };

//   return (
//     <div className="navbar">
//       {/* Left */}
//       <div className="navbar-left">TalentLink</div>

//       {/* Center */}
//       <div className="navbar-center">
//         {/* ✅ Dashboard added */}
//         <Link to="/dashboard">Dashboard</Link>

//         <Link to="/projects">Projects</Link>
//         <Link to="/contracts">Contracts</Link>

//         <Link to="/notifications" className="notifications-link">
//           Notifications
//           {unreadCount > 0 && (
//             <span className="notification-indicator">
//               ({unreadCount})
//             </span>
//           )}
//         </Link>

//         {/* Profile */}
//         {userId && (
//           <Link to={`/profile/${userId}`}>
//             Profile
//           </Link>
//         )}
//       </div>

//       {/* Right */}
//       <div className="navbar-right">
//         <button onClick={handleLogout}>Logout</button>
//       </div>
//     </div>
//   );
// }

// /* =========================
//    App Component
//    ========================= */
// function App() {
//   return (
//     <Router>
//       <Navbar />

//       <Routes>
//         {/* Home */}
//         <Route path="/" element={<AuthPage />} />

//         {/* Auth */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Dashboard */}
//         <Route path="/dashboard" element={<Dashboard />} />

//         {/* Projects */}
//         <Route path="/projects" element={<ProjectFeed />} />
//         <Route path="/projects/:id" element={<ProjectDetails />} />

//         {/* Client */}
//         <Route
//           path="/client/projects/:projectId/proposals"
//           element={<ClientProjectProposals />}
//         />
//         <Route
//           path="/client/projects/create"
//           element={<CreateProject />}
//         />

//         {/* Freelancer */}
//         <Route
//           path="/freelancer/proposals"
//           element={<FreelancerProposals />}
//         />

//         {/* Contracts */}
//         <Route path="/contracts" element={<Contracts />} />
//         <Route
//           path="/contracts/:contractId/chat"
//           element={<ContractChat />}
//         />

//         {/* Reviews */}
//         <Route
//           path="/contracts/:contractId/review"
//           element={<LeaveReview />}
//         />

//         {/* Notifications */}
//         <Route path="/notifications" element={<Notifications />} />

//         {/* Profile */}
//         <Route path="/profile/:userId" element={<Profile />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import { useState, useEffect } from "react";
import { getUnreadCount } from "./services/notificationService";

import AuthPage from "./pages/AuthPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProjectFeed from "./pages/ProjectFeed";
import ProjectDetails from "./pages/ProjectDetails";

import ClientProjectProposals from "./pages/ClientProjectProposals";
import FreelancerProposals from "./pages/FreelancerProposals";
import CreateProject from "./pages/CreateProject";
import Contracts from "./pages/Contracts";
import ContractChat from "./pages/ContractChat";
import Notifications from "./pages/Notifications";
import LeaveReview from "./pages/LeaveReview";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";

import "./components/Navbar.css";

/* =========================
   Navbar Component
   ========================= */
function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const userId = localStorage.getItem("user_id");

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!token) return;

    const fetchUnreadCount = () => {
      getUnreadCount()
        .then((res) => {
          setUnreadCount(res.data.unread_count || 0);
        })
        .catch(() => setUnreadCount(0));
    };

    fetchUnreadCount();
    window.addEventListener("notifications-updated", fetchUnreadCount);

    return () => {
      window.removeEventListener("notifications-updated", fetchUnreadCount);
    };
  }, [token]);

  // Hide navbar if not logged in or on auth pages
  if (
    !token ||
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register"
  ) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  return (
    <div className="navbar">
      {/* Left */}
      <div className="navbar-left">TalentLink</div>

      {/* Center */}
      <div className="navbar-center">
        {/* ✅ Dashboard added */}
        <Link to="/dashboard">Dashboard</Link>

        <Link to="/projects">Projects</Link>
        <Link to="/contracts">Contracts</Link>

        <Link to="/notifications" className="notifications-link">
          Notifications
          {unreadCount > 0 && (
            <span className="notification-indicator">
              ({unreadCount})
            </span>
          )}
        </Link>

        {/* Profile */}
        {userId && (
          <Link to={`/profile/${userId}`}>
            Profile
          </Link>
        )}
      </div>

      {/* Right */}
      <div className="navbar-right">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

/* =========================
   App Component
   ========================= */
function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<AuthPage />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Projects */}
        <Route path="/projects" element={<ProjectFeed />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />

        {/* Client */}
        <Route
          path="/client/projects/:projectId/proposals"
          element={<ClientProjectProposals />}
        />
        <Route
          path="/client/projects/create"
          element={<CreateProject />}
        />

        {/* Freelancer */}
        <Route
          path="/freelancer/proposals"
          element={<FreelancerProposals />}
        />

        {/* Contracts */}
        <Route path="/contracts" element={<Contracts />} />
        <Route
          path="/contracts/:contractId/chat"
          element={<ContractChat />}
        />

        {/* Reviews */}
        <Route
          path="/contracts/:contractId/review"
          element={<LeaveReview />}
        />

        {/* Notifications */}
        <Route path="/notifications" element={<Notifications />} />

        {/* Profile */}
        <Route path="/profile/:userId" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
