
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  Chip,
  Fade,
  Stack,
  Divider,
  Tooltip,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Logout from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchNotifications,
  markNotificationRead,
  deleteNotification,
} from "../services/notificationApi";

/* ---------- Time Ago Helper ---------- */
const timeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diff = Math.floor((now - past) / 1000);

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isClient = user?.role === "client";
  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "U";

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const data = await fetchNotifications();
    setNotifications(data);
  };

  const handleRead = async (notification) => {
  if (!notification.is_read) {
    await markNotificationRead(notification.id);

    // 🔥 Update UI instantly
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id ? { ...n, is_read: true } : n
      )
    );
  }

  if (notification.link) {
    navigate(notification.link);
  }
};

  

  const handleDelete = async (id) => {
    await deleteNotification(id);
    loadNotifications();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* ===== HEADER ===== */}
      <AppBar position="static" elevation={0} sx={{ background: "#0B2228" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              sx={{ color: "#A0C4C9" }}
              onClick={() => navigate("/dashboard")}
            >
              <ArrowBack />
            </IconButton>

            <Typography variant="h6" sx={{ fontWeight: 800, color: "#5E9FA6" }}>
              Notifications
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "#5E9FA6" }}>{avatarLetter}</Avatar>

            <Box>
              <Typography sx={{ color: "#EAF6F7", fontWeight: 600 }}>
                {user?.username}
              </Typography>
              <Typography variant="caption" sx={{ color: "#A0C4C9" }}>
                {isClient ? "Client" : "Freelancer"}
              </Typography>
            </Box>

            <IconButton onClick={handleLogout} sx={{ color: "#E57373" }}>
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ===== PAGE CONTENT ===== */}
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0B2228 0%, #1A3D45 50%, #2F6F78 100%)",
          py: 8,
          color: "#EAF6F7",
        }}
      >
        <Container maxWidth="md">
          {notifications.length === 0 ? (
            <Typography sx={{ color: "#A0C4C9" }}>
              🎉 You have no notifications.
            </Typography>
          ) : (
            <Stack spacing={3}>
              {notifications.map((n) => (
                <Fade in key={n.id}>
                  <Card
                    sx={{
                      bgcolor: n.is_read
                        ? "rgba(15,46,53,0.7)"
                        : "rgba(15,46,53,0.9)",
                      border: n.is_read
                        ? "1px solid rgba(94,159,166,0.2)"
                        : "2px solid #4ADE80",
                      borderRadius: 3,
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="h6">{n.title}</Typography>

                        {!n.is_read && (
                          <Chip label="NEW" color="success" size="small" />
                        )}
                      </Box>

                      <Tooltip title={new Date(n.created_at).toLocaleString()}>
                        <Typography variant="caption" sx={{ color: "#A0C4C9" }}>
                          {timeAgo(n.created_at)}
                        </Typography>
                      </Tooltip>

                      <Divider sx={{ my: 2 }} />

                      <Typography sx={{ mb: 2 }}>{n.message}</Typography>

                      <Stack direction="row" spacing={2}>
                        
                       {!(n.is_read && !n.link) && (
                      <Button variant="contained" onClick={() => handleRead(n)}>
                         {n.link ? "Open" : "Mark as Read"}
                     </Button>
                        )}


                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(n.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Fade>
              ))}
            </Stack>
          )}
        </Container>
      </Box>
    </>
  );
}

export default NotificationsPage;
