

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
} from "@mui/material";
import { MonetizationOn, CalendarToday, ArrowBack } from "@mui/icons-material";

function ProjectDetail() {
  const { id } = useParams();
  const { user, } = useAuth();
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

        const currentUsername = user?.username || localStorage.getItem("username");
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

  if (loading || !project) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0F2E35 0%, #2F6F78 100%)",
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
      {/* Top AppBar */}
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #0F2E35 0%, #2F6F78 100%)",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="inherit" onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#EAF6F7" }}>
              TalentLink
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "#5E9FA6",
                width: 40,
                height: 40,
                fontWeight: "bold",
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
            {/* Logout button removed */}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          background: "linear-gradient(135deg, #0F2E35 0%, #2F6F78 100%)",
          color: "#EAF6F7",
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 5, textAlign: "center" }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {project.title}
            </Typography>
            <Typography variant="body1" color="#A0C4C9">
              Explore the details of this project
            </Typography>
          </Box>

          {/* Project Details Card */}
          <Card
            elevation={6}
            sx={{
              mb: 5,
              borderRadius: 3,
              background: "rgba(15, 46, 53, 0.85)",
              color: "#EAF6F7",
            }}
          >
            <CardContent sx={{ p: 5 }}>
              <Divider sx={{ my: 3, borderColor: "#5E9FA6" }} />

              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <MonetizationOn sx={{ color: "#5E9FA6", fontSize: 40 }} />
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

                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CalendarToday sx={{ color: "#5E9FA6", fontSize: 40 }} />
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

              <Box mt={5}>
                <Typography variant="h6" gutterBottom sx={{ color: "#A0C4C9" }}>
                  Project Description
                </Typography>
                <Typography variant="body1" lineHeight={1.8}>
                  {project.description || "No description provided."}
                </Typography>
              </Box>

              <Box mt={5}>
                <Typography variant="h6" gutterBottom sx={{ color: "#A0C4C9" }}>
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
                          "&:hover": { bgcolor: "rgba(94, 159, 166, 0.2)" },
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="#A0C4C9">
                      No skills specified
                    </Typography>
                  )}
                </Stack>
              </Box>

              {/* Action Buttons */}
              <Box mt={6} sx={{ textAlign: "center" }}>
                {!isClient && (
                  <Button
                    component={Link}
                    to={`/projects/${id}/apply`}
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: "#5E9FA6",
                      "&:hover": { backgroundColor: "#2F6F78" },
                      px: 6,
                      py: 1.8,
                      fontSize: "1.2rem",
                      borderRadius: 3,
                    }}
                  >
                    SUBMIT PROPOSAL
                  </Button>
                )}

                {isProjectOwner && (
                  <Typography variant="body2" color="#A0C4C9" sx={{ mt: 3 }}>
                    You posted this project.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}

export default ProjectDetail;