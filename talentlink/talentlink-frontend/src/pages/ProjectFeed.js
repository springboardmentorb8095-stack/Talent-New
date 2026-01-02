
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
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
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

function ProjectFeed() {
  const { user, } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "U";

  useEffect(() => {
    // Fetch all projects from backend for freelancers
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
  }, []);

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
            <IconButton color="inherit" component={Link} to="/dashboard">
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
                Freelancer
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
              New Projects
            </Typography>
            <Typography variant="body1" color="#A0C4C9">
              Browse all new projects and submit your proposals
            </Typography>
          </Box>

          {loading ? (
            <Typography align="center">Loading...</Typography>
          ) : projects.length === 0 ? (
            <Typography align="center" color="text.secondary">
              No new projects available
            </Typography>
          ) : (
            <Stack spacing={3}>
              {projects.map((project) => (
                <Card
                  key={project.id}
                  elevation={6}
                  sx={{
                    background: "rgba(15, 46, 53, 0.85)",
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ color: "#EAF6F7" }}>
                      {project.title}
                    </Typography>
                    <Typography variant="body1" color="#A0C4C9" sx={{ mb: 2 }}>
                      Budget: ₹{project.budget} | Duration: {project.duration}
                    </Typography>
                    <Typography variant="body2" color="#CFE8EA" sx={{ mb: 2 }}>
                      {project.description}
                    </Typography>

                    <Button
                      component={Link}
                      to={`/projects/${project.id}`}
                      variant="contained"
                      sx={{
                        backgroundColor: "#5E9FA6",
                        "&:hover": { backgroundColor: "#2F6F78" },
                      }}
                    >
                      View & Submit Proposal
                    </Button>
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