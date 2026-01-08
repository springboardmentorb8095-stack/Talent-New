

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
} from "@mui/material";
import { Search, Logout, Folder, Add, Message, Description } from "@mui/icons-material";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [proposalsMap, setProposalsMap] = useState({});

  useEffect(() => {
    if (!user) return;

    const role = user.role || "freelancer";
    setIsClient(role === "client");

    if (role === "client") {
      api
        .get("http://127.0.0.1:8000/api/projects/")
        .then((res) => {
          const data = res.data.results || res.data || [];
          setProjects(data);
          setFilteredItems(data);

          data.forEach((project) => {
            api
              .get(`http://127.0.0.1:8000/api/proposals/projects/${project.id}/proposals/`)
              .then((res) => {
                setProposalsMap((prev) => ({
                  ...prev,
                  [project.id]: res.data.results || [],
                }));
              })
              .catch((err) =>
                console.error(`Failed to fetch proposals for project ${project.id}:`, err)
              );
          });

          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch client's projects:", err);
          setLoading(false);
        });
    } else {
      api
        .get("http://127.0.0.1:8000/api/proposals/my/")
        .then((res) => {
          const data = res.data.results || res.data || [];
          setProjects(data);
          setFilteredItems(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch freelancer's proposals:", err);
          setLoading(false);
        });
    }
  }, [user]);

  useEffect(() => {
    let result = [...projects];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((item) => {
        const title = isClient ? item.title : item.project_title || item.project?.title;
        return title?.toLowerCase().includes(term);
      });
    }

    if (!isClient && statusFilter !== "all") {
      result = result.filter((item) => item.status?.toLowerCase() === statusFilter);
    }

    setFilteredItems(result);
  }, [searchTerm, statusFilter, projects, isClient]);

  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "U";

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "success";
      case "rejected":
        return "error";
      default:
        return "warning";
    }
  };

  const handleStatusChange = (proposalId, newStatus) => {
    api
      .patch(`http://127.0.0.1:8000/api/proposals/${proposalId}/status/`, {
        status: newStatus,
      })
      .then(() => {
        setProposalsMap((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((projectId) => {
            updated[projectId] = updated[projectId].map((p) =>
              p.id === proposalId ? { ...p, status: newStatus } : p
            );
          });
          return updated;
        });
      })
      .catch(() => alert("Failed to update status. Please try again."));
  };

  return (
    <>
      {/* ===== HEADER ===== */}
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #0F2E35 0%, #2F6F78 100%)",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#EAF6F7" }}>
            TalentLink
          </Typography>

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
              <Typography sx={{ color: "#EAF6F7" }}>
                {user?.username || "User"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#A0C4C9" }}>
                {isClient ? "Client" : "Freelancer"}
              </Typography>
            </Box>

            

            {/* CONTRACT ICON WITH TOOLTIP */}
            <Tooltip title="Contract" arrow>
              <IconButton color="inherit" onClick={() => navigate("/contracts")}>
                <Description />
              </IconButton>
            </Tooltip>

            <IconButton color="inherit" onClick={logout}>
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          background: "linear-gradient(135deg, #0F2E35 0%, #2F6F78 100%)",
          color: "#EAF6F7",
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              background: "rgba(47, 111, 120, 0.3)",
              borderRadius: 3,
              p: 4,
              mb: 5,
              textAlign: "center",
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome back, {user?.username || "User"}!
            </Typography>
            <Typography variant="body1">
              {isClient
                ? "Manage your projects and find top talent."
                : "Explore opportunities and grow your career."}
            </Typography>
          </Box>

          <Box sx={{ textAlign: "center", mb: 5, display: "flex", justifyContent: "center", gap: 3 }}>
            {isClient && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate("/projects/new")}
                size="large"
                sx={{
                  backgroundColor: "#5E9FA6",
                  "&:hover": { backgroundColor: "#2F6F78" },
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                }}
              >
                Post New Project
              </Button>
            )}

            {!isClient && (
              <Button
                variant="contained"
                startIcon={<Folder />}
                onClick={() => navigate("/project-feed")}
                size="large"
                sx={{
                  backgroundColor: "#5E9FA6",
                  "&:hover": { backgroundColor: "#2F6F78" },
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                }}
              >
                View All Projects
              </Button>
            )}
          </Box>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={isClient ? 12 : 8}>
              <TextField
                fullWidth
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#A0C4C9" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  '& .MuiInputBase-input': { color: "#EAF6F7" },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: "#5E9FA6" },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: "#A0C4C9" },
                  '& .MuiInputLabel-root': { color: "#A0C4C9" },
                }}
              />
            </Grid>

            {!isClient && (
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "#A0C4C9" }}>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                    sx={{
                      color: "#EAF6F7",
                      ".MuiSvgIcon-root": { color: "#A0C4C9" },
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#5E9FA6" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#A0C4C9" },
                      backgroundColor: "rgba(255,255,255,0.1)",
                    }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="accepted">Accepted</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>

          {/* Dynamic Title: "My Posted Projects" for Client, "My Proposals" for Freelancer */}
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            {isClient ? "My Posted Projects" : "My Proposals"}
          </Typography>

          {loading ? (
            <Typography align="center" color="#A0C4C9">
              Loading...
            </Typography>
          ) : filteredItems.length === 0 ? (
            <Typography align="center" color="#A0C4C9">
              No {isClient ? "projects" : "proposals"} found. Try adjusting your search.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {filteredItems.map((item) => {
                const projectId = isClient ? item.id : item.project_id || item.project;
                const uniqueKey = isClient ? projectId : `${projectId}-${item.id}`;
                const title = isClient ? item.title : item.project_title || "Untitled Project";

                return (
                  <Grid item xs={12} md={6} key={uniqueKey}>
                    <Card
                      elevation={6}
                      sx={{
                        background: "rgba(15, 46, 53, 0.8)",
                        color: "#EAF6F7",
                        borderRadius: 3,
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {title}
                        </Typography>

                        {!isClient && item.status && (
                          <Chip
                            label={item.status.toUpperCase()}
                            color={getStatusColor(item.status)}
                            size="small"
                            sx={{ mb: 2 }}
                          />
                        )}

                        <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
                          <Button
                            variant="contained"
                            onClick={() => navigate(`/projects/${projectId}`)}
                            sx={{
                              backgroundColor: "#5E9FA6",
                              "&:hover": { backgroundColor: "#2F6F78" },
                            }}
                          >
                            View Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* Client Proposals Section */}
          {isClient && (
            <>
              <Typography variant="h5" gutterBottom sx={{ mt: 5, mb: 3 }}>
                My Proposals
              </Typography>
              {Object.keys(proposalsMap).length === 0 ? (
                <Typography align="center" color="#A0C4C9">
                  No proposals found yet.
                </Typography>
              ) : (
                Object.entries(proposalsMap).map(([projectId, proposals]) => (
                  <Box key={projectId} sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Project: {projects.find((p) => p.id.toString() === projectId)?.title || "Untitled Project"}
                    </Typography>

                    {proposals.length === 0 ? (
                      <Typography color="#A0C4C9">No proposals for this project yet.</Typography>
                    ) : (
                      <Grid container spacing={3}>
                        {proposals.map((proposal) => (
                          <Grid item xs={12} md={6} key={proposal.id}>
                            <Card
                              elevation={6}
                              sx={{
                                background: "rgba(15, 46, 53, 0.8)",
                                color: "#EAF6F7",
                                borderRadius: 3,
                              }}
                            >
                              <CardContent>
                                <Typography variant="body1" gutterBottom>
                                  Freelancer: {proposal.freelancer_username || "Unknown"}
                                </Typography>
                                <Typography variant="body2">
                                  Proposed Rate: ${proposal.proposed_rate}
                                </Typography>
                                <Chip
                                  label={proposal.status.toUpperCase()}
                                  color={getStatusColor(proposal.status)}
                                  size="small"
                                  sx={{ mt: 1 }}
                                />

                                {/* Accept & Reject Buttons - Only show when status is pending */}
                                {proposal.status?.toLowerCase() === "pending" && (
                                  <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                                    <Button
                                      variant="contained"
                                      color="success"
                                      onClick={() => handleStatusChange(proposal.id, "accepted")}
                                    >
                                      Accept
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="error"
                                      onClick={() => handleStatusChange(proposal.id, "rejected")}
                                    >
                                      Reject
                                    </Button>
                                  </Box>
                                )}

                                <Box sx={{ mt: 2 }}>
                                  <Button
                                    variant="contained"
                                    onClick={() => navigate(`/projects/${projectId}`)}
                                    sx={{
                                      backgroundColor: "#5E9FA6",
                                      "&:hover": { backgroundColor: "#2F6F78" },
                                    }}
                                  >
                                    View Project
                                  </Button>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                ))
              )}
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;