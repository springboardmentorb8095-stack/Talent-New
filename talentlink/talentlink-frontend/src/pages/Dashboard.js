

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  Divider,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Search,
  Logout,
  FolderOpen,
  AddCircle,
  MonetizationOn,
  AccessTime,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import { fetchNotifications, markNotificationRead } from "../services/notificationApi";

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
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const [searchParams] = useSearchParams();
  const [totalAvailableProjects, setTotalAvailableProjects] = useState(0);

  const myProjectsCount = isClient ? projects.length : 0;
  const pendingProposalsCount = isClient
    ? Object.values(proposalsMap).flat().filter((p) => p.status === "pending").length
    : projects.filter((p) => p.status === "pending").length;

  const activeContractsCount = isClient
    ? Object.values(proposalsMap).flat().filter((p) => p.status === "accepted").length
    : projects.filter((p) => p.status === "accepted").length;

  const proposalsRef = useRef(null);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "proposals" && proposalsRef.current) {
      setTimeout(() => {
        proposalsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 400);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchNotifications()
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Failed to load notifications", err));
  }, []);

  const handleNotificationClick = async () => {
    try {
      await Promise.all(
        notifications.filter((n) => !n.is_read).map((n) => markNotificationRead(n.id))
      );
      navigate("/notifications");
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

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

      // Fetch total projects for project feed
      api
        .get("http://127.0.0.1:8000/api/projects/")
        .then((res) => {
          const data = res.data.results || res.data || [];
          setTotalAvailableProjects(data.length);
        })
        .catch((err) => console.error("Failed to fetch projects feed:", err));
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
      case "pending":
        return "warning";
      default:
        return "default";
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
      <AppBar position="static" elevation={0} sx={{ background: "#0B2228" }}>
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, letterSpacing: 1, color: "#5E9FA6" }}
          >
            {/* You can put your app name/logo here if you want */}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Tooltip title="Notifications" arrow>
              <IconButton onClick={handleNotificationClick} sx={{ color: "#A0C4C9" }}>
                <Badge badgeContent={unreadCount} color="error" overlap="circular">
                  <NotificationsIcon fontSize="large" />
                </Badge>
              </IconButton>
            </Tooltip>

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
                <Typography variant="subtitle1" sx={{ color: "#EAF6F7", fontWeight: 600 }}>
                  {user?.username || "User"}
                </Typography>
                <Typography variant="caption" sx={{ color: "#A0C4C9" }}>
                  {isClient ? "Client" : "Freelancer"}
                </Typography>
              </Box>
            </Box>

            <IconButton onClick={logout} sx={{ color: "#E57373" }}>
              <Logout fontSize="large" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0B2228 0%, #1A3D45 50%, #2F6F78 100%)",
          color: "#EAF6F7",
          py: { xs: 4, md: 8 },
        }}
      >
        <Container maxWidth="xl">
          <Zoom in timeout={600}>
            <Box
              sx={{
                textAlign: "center",
                mb: 8,
                background: "rgba(47, 111, 120, 0.25)",
                backdropFilter: "blur(10px)",
                borderRadius: 4,
                py: 6,
                px: 4,
                border: "1px solid rgba(94, 159, 166, 0.3)",
                boxShadow: "0 12px 35px rgba(0,0,0,0.45)",
                transition: "all 0.35s ease",
                "&:hover": {
                  transform: "translateY(-10px)",
                  boxShadow: "0 18px 45px rgba(94,159,166,0.45)",
                  borderColor: "#5E9FA6",
                },
              }}
            >
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Welcome back, {user?.username || "User"}!
              </Typography>
              <Typography variant="h6" sx={{ color: "#A0C4C9", maxWidth: "700px", mx: "auto" }}>
                {isClient
                  ? "Post projects, review proposals, and hire the best talent."
                  : "Apply to projects, build your reputation, and grow your career."}
              </Typography>
            </Box>
          </Zoom>

          <Box sx={{ textAlign: "center", mb: 6 }}>
            {isClient ? (
              <Button
                variant="contained"
                size="large"
                startIcon={<AddCircle />}
                onClick={() => navigate("/projects/new")}
                sx={{
                  bgcolor: "#5E9FA6",
                  px: 5,
                  py: 2,
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  borderRadius: 3,
                  boxShadow: "0 8px 25px rgba(94, 159, 166, 0.4)",
                  "&:hover": { bgcolor: "#4A858C", transform: "translateY(-3px)" },
                  transition: "all 0.3s",
                }}
              >
                Post a New Project
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                startIcon={<FolderOpen />}
                onClick={() => navigate("/projects")}
                sx={{
                  bgcolor: "#5E9FA6",
                  px: 5,
                  py: 2,
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  borderRadius: 3,
                  boxShadow: "0 8px 25px rgba(94, 159, 166, 0.4)",
                  "&:hover": { bgcolor: "#4A858C", transform: "translateY(-3px)" },
                  transition: "all 0.3s",
                }}
              >
                Browse Projects
              </Button>
            )}
          </Box>

          <Zoom in timeout={700}>
            <Grid container spacing={4} sx={{ mb: 10 }}>
              {/* Total Projects / My Projects */}
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    bgcolor: "rgba(15, 46, 53, 0.85)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(94, 159, 166, 0.35)",
                    borderRadius: 4,
                    boxShadow: "0 12px 35px rgba(0,0,0,0.45)",
                    transition: "all 0.35s ease",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 18px 45px rgba(94,159,166,0.45)",
                      borderColor: "#5E9FA6",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 6 }}>
                    <FolderOpen sx={{ fontSize: 46, color: "#5E9FA6", mb: 1 }} />
                    <Typography variant="h3" fontWeight="bold" sx={{ color: "#EAF6F7", mb: 0.5 }}>
                      {isClient ? myProjectsCount : totalAvailableProjects}
                    </Typography>
                    <Typography sx={{ letterSpacing: 1.5, fontWeight: 800, color: "#A0C4C9" }}>
                      {isClient ? "MY PROJECTS" : "PROJECTS FEED"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Pending Proposals */}
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    bgcolor: "rgba(15, 46, 53, 0.85)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(94, 159, 166, 0.35)",
                    borderRadius: 4,
                    boxShadow: "0 12px 35px rgba(0,0,0,0.45)",
                    transition: "all 0.35s ease",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 18px 45px rgba(230,162,60,0.45)",
                      borderColor: "#E6A23C",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 6 }}>
                    <AccessTime sx={{ fontSize: 46, color: "#E6A23C", mb: 1 }} />
                    <Typography variant="h3" fontWeight="bold" sx={{ color: "#EAF6F7", mb: 0.5 }}>
                      {pendingProposalsCount}
                    </Typography>
                    <Typography sx={{ letterSpacing: 1.5, fontWeight: 800, color: "#A0C4C9" }}>
                      PENDING PROPOSALS
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Active Contracts */}
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    bgcolor: "rgba(15, 46, 53, 0.85)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(94, 159, 166, 0.35)",
                    borderRadius: 4,
                    boxShadow: "0 12px 35px rgba(0,0,0,0.45)",
                    transition: "all 0.35s ease",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 18px 45px rgba(103,194,58,0.45)",
                      borderColor: "#67C23A",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 6 }}>
                    <CheckCircle sx={{ fontSize: 46, color: "#67C23A", mb: 1 }} />
                    <Typography variant="h3" fontWeight="bold" sx={{ color: "#EAF6F7", mb: 0.5 }}>
                      {activeContractsCount}
                    </Typography>
                    <Typography sx={{ letterSpacing: 1.5, fontWeight: 800, color: "#A0C4C9" }}>
                      ACTIVE CONTRACTS
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Zoom>

          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} md={isClient ? 12 : 8}>
              <TextField
                fullWidth
                placeholder="Search by project title..."
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
                  "& .MuiInputBase-root": {
                    bgcolor: "rgba(15, 46, 53, 0.6)",
                    color: "#EAF6F7",
                    borderRadius: 3,
                  },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#5E9FA6" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#A0C4C9" },
                }}
              />
            </Grid>

            {!isClient && (
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "#A0C4C9" }}>Filter by Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Filter by Status"
                    sx={{
                      bgcolor: "rgba(15, 46, 53, 0.6)",
                      color: "#EAF6F7",
                      borderRadius: 3,
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#5E9FA6" },
                      "& .MuiSvgIcon-root": { color: "#A0C4C9" },
                    }}
                  >
                    <MenuItem value="all">All Proposals</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="accepted">Accepted</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>

          <Fade in timeout={800}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
                {isClient ? "My Posted Projects" : "My Proposals"}
              </Typography>

              {loading ? (
                <Typography align="center" sx={{ py: 8, fontSize: "1.2rem", color: "#A0C4C9" }}>
                  Loading your data...
                </Typography>
              ) : filteredItems.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography variant="h6" color="#A0C4C9">
                    No {isClient ? "projects" : "proposals"} found.
                  </Typography>
                  <Typography color="#A0C4C9" mt={1}>
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filters."
                      : isClient
                      ? "Start by posting your first project!"
                      : "Browse projects and submit your first proposal."}
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={4}>
                  {filteredItems.map((item) => {
                    const projectId = isClient ? item.id : item.project_id || item.project;
                    const title = isClient
                      ? item.title
                      : item.project_title || item.project?.title || "Untitled Project";

                    return (
                      <Grid item xs={12} md={6} lg={4} key={isClient ? projectId : item.id}>
                        <Fade in timeout={1000}>
                          <Card
                            sx={{
                              bgcolor: "rgba(15, 46, 53, 0.85)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(94, 159, 166, 0.3)",
                              borderRadius: 4,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-10px)",
                                boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
                                borderColor: "#5E9FA6",
                              },
                            }}
                          >
                            <CardContent sx={{ p: 4 }}>
                              <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {title}
                              </Typography>

                              {!isClient && item.status && (
                                <Chip
                                  icon={
                                    item.status === "accepted" ? (
                                      <CheckCircle />
                                    ) : item.status === "rejected" ? (
                                      <Cancel />
                                    ) : (
                                      <AccessTime />
                                    )
                                  }
                                  label={item.status.toUpperCase()}
                                  color={getStatusColor(item.status)}
                                  sx={{ mb: 3, fontWeight: 600 }}
                                />
                              )}

                              {item.proposed_rate && !isClient && (
                                <Box
                                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3, color: "#A0C4C9" }}
                                >
                                  <MonetizationOn fontSize="small" />
                                  <Typography variant="body1">
                                    Proposed: <strong>${item.proposed_rate}</strong>
                                  </Typography>
                                </Box>
                              )}

                              <Button
                                fullWidth
                                variant="contained"
                                onClick={() => navigate(`/projects/${projectId}`)}
                                sx={{
                                  mt: 2,
                                  bgcolor: "#5E9FA6",
                                  py: 1.5,
                                  fontWeight: 600,
                                  "&:hover": { bgcolor: "#4A858C" },
                                }}
                              >
                                View Details
                              </Button>
                            </CardContent>
                          </Card>
                        </Fade>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Box>
          </Fade>

          {isClient && (
            <Box ref={proposalsRef} sx={{ mt: 10 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Proposals Received
              </Typography>
              <Divider sx={{ bgcolor: "rgba(94, 159, 166, 0.3)", my: 3 }} />

              {Object.keys(proposalsMap).length === 0 || projects.length === 0 ? (
                <Typography sx={{ py: 6, textAlign: "center", color: "#A0C4C9", fontSize: "1.2rem" }}>
                  No proposals received yet.
                </Typography>
              ) : (
                Object.entries(proposalsMap).map(([projectId, proposals]) => {
                  const project = projects.find((p) => p.id.toString() === projectId);
                  if (!project) return null;

                  return (
                    <Box key={projectId} sx={{ mb: 6 }}>
                      <Typography variant="h5" gutterBottom sx={{ color: "#5E9FA6" }}>
                        {project.title}
                      </Typography>

                      {proposals.length === 0 ? (
                        <Typography color="#A0C4C9">No proposals yet for this project.</Typography>
                      ) : (
                        <Grid container spacing={4}>
                          {proposals.map((proposal) => (
                            <Grid item xs={12} md={6} lg={4} key={proposal.id}>
                              <Card
                                sx={{
                                  bgcolor: "rgba(15, 46, 53, 0.85)",
                                  border: "1px solid rgba(94, 159, 166, 0.3)",
                                  borderRadius: 4,
                                  transition: "0.3s",
                                  "&:hover": { borderColor: "#5E9FA6", transform: "translateY(-5px)" },
                                }}
                              >
                                <CardContent sx={{ p: 4 }}>
                                  <Typography variant="h6" gutterBottom>
                                    {proposal.freelancer_username || "Freelancer"}
                                  </Typography>

                                  <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="#A0C4C9">
                                      Proposed Rate
                                    </Typography>
                                    <Typography variant="h6" fontWeight="bold">
                                      ${proposal.proposed_rate}
                                    </Typography>
                                  </Box>

                                  <Chip
                                    label={proposal.status.toUpperCase()}
                                    color={getStatusColor(proposal.status)}
                                    sx={{ mb: 3 }}
                                  />

                                  {proposal.status?.toLowerCase() === "pending" && (
                                    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                                      <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckCircle />}
                                        onClick={() => handleStatusChange(proposal.id, "accepted")}
                                        fullWidth
                                      >
                                        Accept
                                      </Button>
                                      <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<Cancel />}
                                        onClick={() => handleStatusChange(proposal.id, "rejected")}
                                        fullWidth
                                      >
                                        Reject
                                      </Button>
                                    </Box>
                                  )}

                                  <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                      borderColor: "#5E9FA6",
                                      color: "#5E9FA6",
                                      "&:hover": {
                                        bgcolor: "rgba(94, 159, 166, 0.2)",
                                        borderColor: "#5E9FA6",
                                      },
                                    }}
                                    onClick={() => navigate(`/projects/${projectId}`)}
                                  >
                                    View Project
                                  </Button>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </Box>
                  );
                })
              )}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;