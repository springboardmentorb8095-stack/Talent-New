

import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Box,
  Grid,
  Divider,
  Chip,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Button,
  Fade,
  Zoom,
} from "@mui/material";
import {
  MonetizationOn,
  CalendarToday,
  Logout,
  ArrowBack,
} from "@mui/icons-material";

function ProjectDetail() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [isProjectOwner, setIsProjectOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  const isClient = user?.role === "client";
  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "U";

  useEffect(() => {
    api
      .get(`http://127.0.0.1:8000/api/projects/${id}/`)
      .then((res) => {
        setProject(res.data);

        const currentUsername =
          user?.username || localStorage.getItem("username");
        if (res.data.posted_by_username === currentUsername) {
          setIsProjectOwner(true);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch project:", err);
        setLoading(false);
      });
  }, [id, user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading || !project) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0B2228 0%, #1A3D45 50%, #2F6F78 100%)",
        }}
      >
        <Typography variant="h5" color="#EAF6F7">
          Loading project details...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* ===== HEADER ===== */}
      <AppBar position="static" elevation={0} sx={{ background: "#0B2228" }}>
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton sx={{ color: "#A0C4C9" }} onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, letterSpacing: 1, color: "#5E9FA6" }}
            >
              Project Details
            </Typography>
          </Box>

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
              <Typography variant="body2" sx={{ color: "#EAF6F7" }}>
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

      {/* ===== PAGE BACKGROUND ===== */}
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          background:
            "linear-gradient(135deg, #0B2228 0%, #1A3D45 50%, #2F6F78 100%)",
          py: 8,
          color: "#EAF6F7",
        }}
      >
        <Container maxWidth="lg">
          {/* ===== HERO ===== */}
          {project && (
            <Zoom in timeout={600}>
              <Box
                sx={{
                  textAlign: "center",
                  mb: 6,
                  background: "rgba(47, 111, 120, 0.25)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 4,
                  py: 5,
                  px: 4,
                  border: "1px solid rgba(94,159,166,0.3)",
                }}
              >
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  {project.title}
                </Typography>
                <Typography color="#A0C4C9">
                  Detailed overview of the project
                </Typography>
              </Box>
            </Zoom>
          )}

          {/* ===== PROJECT CARD ===== */}
          <Fade in timeout={900}>
            <Card
              sx={{
                borderRadius: 4,
                background: "rgba(15, 46, 53, 0.85)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(94,159,166,0.3)",
              }}
            >
              <CardContent sx={{ p: 6 }}>
                {/* Meta */}
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <MonetizationOn sx={{ color: "#5E9FA6", fontSize: 42 }} />
                      <Box>
                        <Typography variant="caption" color="#A0C4C9">
                          BUDGET
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          ${parseFloat(project.budget || 0).toFixed(2)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CalendarToday sx={{ color: "#5E9FA6", fontSize: 42 }} />
                      <Box>
                        <Typography variant="caption" color="#A0C4C9">
                          DURATION
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {project.duration || "N/A"} days
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 5, borderColor: "#5E9FA6" }} />

                {/* Description */}
                <Typography variant="h6" sx={{ color: "#A0C4C9" }} gutterBottom>
                  Project Description
                </Typography>
                <Typography lineHeight={1.9}>
                  {project.description || "No description provided."}
                </Typography>

                {/* Skills */}
                <Box mt={5}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#A0C4C9" }}
                  >
                    Skills Required
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {(project.skills || []).length > 0 ? (
                      project.skills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          variant="outlined"
                          sx={{
                            color: "#EAF6F7",
                            borderColor: "#5E9FA6",
                            mb: 1,
                            "&:hover": {
                              bgcolor: "rgba(94,159,166,0.2)",
                            },
                          }}
                        />
                      ))
                    ) : (
                      <Typography color="#A0C4C9">
                        No skills specified
                      </Typography>
                    )}
                  </Stack>
                </Box>

                {/* Actions */}
                <Box mt={7} textAlign="center">
                  {!isClient && (
                    <Button
                      component={Link}
                      to={`/projects/${id}/apply`}
                      variant="contained"
                      size="large"
                      sx={{
                        px: 7,
                        py: 2,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        borderRadius: 3,
                        bgcolor: "#5E9FA6",
                        "&:hover": {
                          bgcolor: "#4A858C",
                          transform: "translateY(-3px)",
                        },
                        transition: "0.3s",
                      }}
                    >
                      Submit Proposal
                    </Button>
                  )}

                  {isProjectOwner && (
                    <Typography variant="body2" color="#A0C4C9" mt={3}>
                      You posted this project.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Container>
      </Box>
    </>
  );
}

export default ProjectDetail;