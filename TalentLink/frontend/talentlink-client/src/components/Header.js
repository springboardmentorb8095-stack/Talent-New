


import React, { useEffect, useState } from "react";

import {
  FaUserCircle,
  FaBell,
  FaEnvelope
} from "react-icons/fa";
import { getUserProfile } from "../utils/user";
import { getNotifications } from "../utils/notifications";
import { markAllNotificationsRead } from "../utils/notifications";
import { useRef } from "react";

import { markNotificationRead } from "../utils/notifications";



function Header({ setPage, setSelectedProject, searchTerm, setSearchTerm }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  // 🔔 Notifications (mock – replace with API later)
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);


  // ===== Fetch User =====
  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUserProfile();
        setUsername(
          data.username ||
          data.name ||
          data.full_name ||
          "User"
        );
        setRole(data.role || "");
      } catch {
        setUsername("User");
        setRole("");
      }
    }
    fetchUser();
  }, []);

useEffect(() => {
  let interval;

  async function fetchNotifications() {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.log("Notification fetch error", err);
    }
  }

  fetchNotifications(); // first load

  interval = setInterval(fetchNotifications, 10000); // 🔄 every 10 sec

  return () => clearInterval(interval); // cleanup
}, []);


useEffect(() => {
  if (!username) return;

  const socket = new WebSocket(
    `ws://127.0.0.1:8000/ws/notifications/`
  );

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // Add new notification to top
    setNotifications((prev) => [
      {
        id: Date.now(),       // temp ID
        message: data.message,
        is_read: false,
      },
      ...prev,
    ]);
  };

  socket.onerror = (err) => {
    console.error("WebSocket error", err);
  };

  return () => socket.close();
}, [username]);

useEffect(() => {
  function handleClickOutside(event) {
    if (notifRef.current && !notifRef.current.contains(event.target)) {
      setIsNotifOpen(false);
    }
  }

  if (isNotifOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isNotifOpen]);




  // ===== Lock Scroll when Sidebar Open =====
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isSidebarOpen]);

  const unreadCount = notifications.filter(n => n.is_read === false).length;




const handleLogout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  setPage("login");
};




const markAllRead = async () => {
  await markAllNotificationsRead();
  const data = await getNotifications();
  setNotifications(data);
};



  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="header">
        {/* LEFT */}
        <div className="logo" onClick={() => setPage("projects")}>
          TalentLink
        </div>

        {/* CENTER SEARCH */}
        <input
          type="text"
          className="header-search"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* RIGHT */}
        <div className="header-actions">
          {/* 🔔 Notifications */}
          {/* 🔔 Notifications */}
<div className="icon-wrapper" ref={notifRef}>
  <FaBell
    className="header-icon"
    onClick={() => setIsNotifOpen(!isNotifOpen)}
  />
  {unreadCount > 0 && (
    <span className="badge">{unreadCount}</span>
  )}

  {isNotifOpen && (
    <div className="notif-dropdown">
      <div className="notif-header">
        <span>Notifications</span>
        <button onClick={markAllRead}>Mark all read</button>
      </div>

      {notifications?.length === 0 ? (
        <p className="empty">No notifications</p>
      ) : (
notifications.map((n) => (
<div
  key={n.id}
  className={`notif-item ${n.is_read ? "" : "unread"}`}
  onClick={async () => {
    setIsNotifOpen(false);

    // ✅ MARK AS READ (BACKEND)
    if (!n.is_read) {
      await markNotificationRead(n.id);

      // ✅ UPDATE UI INSTANTLY
      setNotifications(prev =>
        prev.map(item =>
          item.id === n.id
            ? { ...item, is_read: true }
            : item
        )
      );
    }

    // ✅ NAVIGATION LOGIC
    if (n.project_id && n.proposal_id) {
      setSelectedProject(n.project_id);
      setPage("project-proposals");   // client → proposals
    }
    else if (n.project_id) {
      setSelectedProject(n.project_id);
      setPage("project-detail");      // project detail
    }
  }}
>
  <b>@{n.username}</b> {n.message}
  <div className="notif-time">{n.time_ago}</div>
</div>




        ))
      )}
    </div>
  )}
</div>

{/* 💬 Messaging */}
<div className="icon-wrapper" onClick={(e) => e.stopPropagation()}>
  <FaEnvelope
    className="header-icon"
    onClick={() => setPage("chat")}
  />
</div>


          {/* 💬 Messaging
          <div className="icon-wrapper">
            <FaEnvelope onClick={() => setPage("chat")} />
          </div> */}

          {/* ➕ Create Project (CLIENT ONLY) */}
          {role === "client" && (
            <button
              className="primary-btn"
              onClick={() => setPage("create-project")}
            >
              Create Project
            </button>
          )}

          {/* 👤 Profile */}
          {/* <div className="profile-mini" onClick={() => setIsSidebarOpen(true)}>
            <FaUserCircle size={26} />
            <div className="profile-text">
              <span>{username}</span>
              <small>{role}</small>
            </div>
          </div> */}
          <div className="profile-mini" onClick={() => setIsSidebarOpen(true)}>
          <FaUserCircle className="profile-avatar" />

          <div className="profile-text">
            <span className="profile-name">{username}</span>
            <span className="profile-role">{role}</span>
          </div>
        </div>

        </div>
      </div>

      {/* ================= OVERLAY ================= */}
      {isSidebarOpen && (
        <div
          className="profile-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <div className={`profile-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-user">
          <FaUserCircle size={44} />
          <div>
            <h4>{username}</h4>
            <p>{role}</p>
          </div>
        </div>

        <div className="sidebar-divider"></div>

        <ul className="sidebar-links">
          <li onClick={() => { setIsSidebarOpen(false); setPage("dashboard"); }}>
            Dashboard
          </li>

          {role === "client" && (
            <>
              <li onClick={() => { setIsSidebarOpen(false); setPage("my-projects"); }}>
                My Projects
              </li>
              <li onClick={() => { setIsSidebarOpen(false); setPage("contracts"); }}>
                My Contracts
              </li>
               <li onClick={() => setPage("ongoing-projects")}>
  Ongoing Projects
</li>

            </>
          )}

          {role === "freelancer" && (
            <>
              <li onClick={() => { setIsSidebarOpen(false); setPage("my-proposals"); }}>
                My Proposals
              </li>
              <li onClick={() => { setIsSidebarOpen(false); setPage("contracts"); }}>
                My Contracts
              </li>
              <li onClick={() => setPage("ongoing-projects")}>
  Ongoing Projects
</li>

            </>
          )}

          <li onClick={() => { setIsSidebarOpen(false); setPage("profile"); }}>
            Profile
          </li>

          <li className="danger" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>
    </>
  );
}

export default Header;
