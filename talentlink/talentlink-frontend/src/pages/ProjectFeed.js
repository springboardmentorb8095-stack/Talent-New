

import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Box,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material";
import { Logout } from "@mui/icons-material";

function ProjectFeed() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // ✅ Fix: Determine role from user object
  const [isClient, setIsClient] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "U";

  useEffect(() => {
    if (user) {
      setIsClient(user.role === "client"); // dynamically set role
    }

    api
      .get("http://127.0.0.1:8000/api/projects/")
      .then((res) => {
        setProjects(res.data.results || res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setLoading(false);
      });
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* ===================== HEADER ===================== */}
      <AppBar position="static" elevation={0} sx={{ background: "#0B2228" }}>
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
         
          <Typography
                      variant="h5"
                      sx={{ fontWeight: 800, letterSpacing: 1, color: "#5E9FA6" }}
                    >
                      Projects
                    </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "#5E9FA6",
                width: 48,
                height: 48,
                fontWeight: "bold",
                fontSize: "1.4rem",
                boxShadow: "0 0 15px rgba(94, 159, 166, 0.4)",
              }}
            >
              {avatarLetter}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ color: "#EAF6F7" }}>
                {user?.username || "User"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#A0C4C9" }}>
                {isClient ? "Client" : "Freelancer"}
              </Typography>
            </Box>
            <IconButton onClick={handleLogout} sx={{ color: "#E57373" }}>
              <Logout fontSize="large" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ===================== MAIN CONTENT ===================== */}
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          background: "linear-gradient(135deg, #0F2E35, #2F6F78)",
          py: 6,
          color: "#EAF6F7",
        }}
      >
        <Container maxWidth="lg">
          {/* Page Title */}
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Available Projects
            </Typography>
            <Typography variant="body1" color="#A0C4C9">
              Discover projects and submit proposals that match your skills
            </Typography>
          </Box>

          {/* Content */}
          {loading ? (
            <Typography align="center" color="#EAF6F7">
              Loading projects...
            </Typography>
          ) : projects.length === 0 ? (
            <Typography align="center" color="#A0C4C9">
              No projects available at the moment
            </Typography>
          ) : (
            <Stack spacing={4}>
              {projects.map((project) => (
                <Card
                  key={project.id}
                  elevation={8}
                  sx={{
                    background: "rgba(15, 46, 53, 0.9)",
                    borderRadius: 4,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(0.98)",
                      boxShadow: "0 0 25px rgba(94,159,166,0.35)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {project.title}
                    </Typography>

                    <Typography variant="body2" color="#A0C4C9" gutterBottom>
                      Budget: ₹{project.budget} &nbsp;•&nbsp; Duration:{" "}
                      {project.duration}
                    </Typography>

                    <Divider sx={{ my: 2, borderColor: "#5E9FA6" }} />

                    <Typography
                      variant="body1"
                      color="#CFE8EA"
                      sx={{ mb: 3, lineHeight: 1.7 }}
                    >
                     Description: {project.description}
                    </Typography>

                    <Box textAlign="right">
  <Button
    component={Link}
    to={`/projects/${project.id}`}
    variant="contained"
    size="large"
    sx={{
      backgroundColor: "#5E9FA6",
      px: 4,
      borderRadius: 3,
      "&:hover": {
        backgroundColor: "#2F6F78",
      },
    }}
  >
    {isClient ? "View Project Details" : "View & Submit Proposal"}
  </Button>
</Box>

                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Container>
      </Box>
    </>
  );
}

export default ProjectFeed;
