

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
  Chip,
  Divider,
  Fade,
  Stack,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  AccessTime,
  MonetizationOn,
  Logout,
  FolderOpen,
} from "@mui/icons-material";

const STATUS_TABS = ["all", "pending", "accepted", "rejected"];

const Proposals = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const [clientProposals, setClientProposals] = useState({}); // { projectTitle: [proposals] }
  const [freelancerProposals, setFreelancerProposals] = useState([]);

  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "U";

  useEffect(() => {
    if (!user) return;
    setIsClient(user.role === "client");
  }, [user]);

  useEffect(() => {
    if (!user) return;

    if (isClient) {
      api
        .get("http://127.0.0.1:8000/api/projects/")
        .then(async (res) => {
          const projects = res.data.results || res.data || [];
          const map = {};

          await Promise.all(
            projects.map((project) =>
              api
                .get(`http://127.0.0.1:8000/api/proposals/projects/${project.id}/proposals/`)
                .then((pRes) => {
                  map[project.id] = {
                    title: project.title,
                    proposals: pRes.data.results || [],
                  };
                })
            )
          );

          setClientProposals(map);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      api
        .get("http://127.0.0.1:8000/api/proposals/my/")
        .then((res) => {
          setFreelancerProposals(res.data.results || res.data || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user, isClient]);

  const updateStatus = (proposalId, newStatus) => {
    api
      .patch(`http://127.0.0.1:8000/api/proposals/${proposalId}/status/`, { status: newStatus })
      .then(() => {
        setClientProposals((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((key) => {
            updated[key].proposals = updated[key].proposals.map((p) =>
              p.id === proposalId ? { ...p, status: newStatus } : p
            );
          });
          return updated;
        });
      })
      .catch(() => alert("Failed to update proposal status"));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted": return "success";
      case "rejected": return "error";
      case "pending": return "warning";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted": return <CheckCircle />;
      case "rejected": return <Cancel />;
      default: return <AccessTime />;
    }
  };

  const filteredFreelancerProposals = freelancerProposals.filter(
    (p) => statusFilter === "all" || p.status?.toLowerCase() === statusFilter
  );

  return (
    <>
      {/* ================= HEADER ================= */}
      <AppBar position="static" elevation={0} sx={{ background: "#0B2228" }}>
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, letterSpacing: 1, color: "#5E9FA6" }}
          >
            Proposals
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
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

            <IconButton onClick={logout} sx={{ color: "#E57373" }}>
              <Logout fontSize="large" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ================= MAIN CONTENT ================= */}
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0B2228 0%, #1A3D45 50%, #2F6F78 100%)",
          color: "#EAF6F7",
          py: { xs: 4, md: 8 },
        }}
      >
        <Container maxWidth="xl">
          {/* Title & Description */}
          <Fade in timeout={600}>
            <Box sx={{ mb: 6, textAlign: { xs: "center", md: "left" } }}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {isClient ? "Proposals Received" : "My Proposals"}
              </Typography>
              <Typography sx={{ color: "#A0C4C9", maxWidth: 600 }}>
                {isClient
                  ? "Review and manage proposals from talented freelancers"
                  : "Track the status of all your submitted proposals"}
              </Typography>
            </Box>
          </Fade>

          {/* Status Filter Tabs */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ mb: 6, flexWrap: "wrap", justifyContent: { xs: "center", md: "flex-start" } }}
          >
            {STATUS_TABS.map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "contained" : "outlined"}
                onClick={() => setStatusFilter(status)}
                sx={{
                  textTransform: "capitalize",
                  minWidth: 110,
                  bgcolor: statusFilter === status ? "#5E9FA6" : "transparent",
                  borderColor: "#5E9FA6",
                  color: "#EAF6F7",
                  "&:hover": { bgcolor: statusFilter === status ? "#4A858C" : "rgba(94,159,166,0.15)" },
                }}
              >
                {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </Stack>

          <Divider sx={{ bgcolor: "rgba(94,159,166,0.3)", mb: 6 }} />

          {loading ? (
            <Typography align="center" sx={{ py: 10, color: "#A0C4C9" }}>
              Loading proposals...
            </Typography>
          ) : isClient ? (
            /* ================= CLIENT VIEW ================= */
            Object.keys(clientProposals).length === 0 ? (
              <Box sx={{ textAlign: "center", py: 10 }}>
                <Typography variant="h6" color="#A0C4C9">
                  No proposals received yet
                </Typography>
              </Box>
            ) : (
              Object.entries(clientProposals).map(([projectId, { title, proposals }]) => {
                const filtered = proposals.filter(
                  (p) => statusFilter === "all" || p.status?.toLowerCase() === statusFilter
                );

                if (filtered.length === 0) return null;

                return (
                  <Box key={projectId} sx={{ mb: 8 }}>
                    <Typography variant="h5" sx={{ color: "#5E9FA6", mb: 3, fontWeight: 600 }}>
                      {title}
                    </Typography>

                    <Grid container spacing={4}>
                      {filtered.map((proposal) => (
                        <Grid item xs={12} sm={6} md={4} key={proposal.id}>
                          <Fade in timeout={700}>
                            <Card
                              sx={{
                                bgcolor: "rgba(15,46,53,0.85)",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(94,159,166,0.3)",
                                borderRadius: 4,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "translateY(-8px)",
                                  boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
                                  borderColor: "#5E9FA6",
                                },
                              }}
                            >
                              <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" gutterBottom>
                                  {proposal.freelancer_username || "Freelancer"}
                                </Typography>

                                <Box sx={{  mb: 2 }}>
                                  <Typography variant="body2" color="#A0C4C9">
                                              Proposed Rate :
                                 </Typography>
                                  <Typography variant="h6" fontWeight="bold">
                                            ${proposal.proposed_rate}
                                 </Typography>
                                </Box>

                                <Chip
                                  icon={getStatusIcon(proposal.status)}
                                  label={proposal.status?.toUpperCase() || "UNKNOWN"}
                                  color={getStatusColor(proposal.status)}
                                  sx={{ mb: 3 }}
                                />

                                {proposal.status?.toLowerCase() === "pending" && (
                                  <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                                    <Button
                                      fullWidth
                                      variant="contained"
                                      color="success"
                                      startIcon={<CheckCircle />}
                                      onClick={() => updateStatus(proposal.id, "accepted")}
                                    >
                                      ACCEPT
                                    </Button>
                                    <Button
                                      fullWidth
                                      variant="contained"
                                      color="error"
                                      startIcon={<Cancel />}
                                      onClick={() => updateStatus(proposal.id, "rejected")}
                                    >
                                      REJECT
                                    </Button>
                                  </Stack>
                                )}

                                <Button
                                  fullWidth
                                  variant="outlined"
                                  startIcon={<FolderOpen />}
                                  onClick={() => navigate(`/projects/${projectId}`)}
                                  sx={{
                                    borderColor: "#5E9FA6",
                                    color: "#5E9FA6",
                                    fontWeight: 600,
                                    "&:hover": {
                                      bgcolor: "rgba(94,159,166,0.15)",
                                      borderColor: "#5E9FA6",
                                    },
                                  }}
                                >
                                  View Project
                                </Button>
                              </CardContent>
                            </Card>
                          </Fade>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                );
              })
            )
          ) : (
            /* ================= FREELANCER VIEW ================= */
            filteredFreelancerProposals.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 10 }}>
                <Typography variant="h6" color="#A0C4C9">
                  No proposals found
                </Typography>
                {statusFilter !== "all" && (
                  <Typography color="#A0C4C9" mt={1}>
                    Try changing the status filter
                  </Typography>
                )}
              </Box>
            ) : (
              <Grid container spacing={4}>
                {filteredFreelancerProposals.map((proposal) => (
                  <Grid item xs={12} sm={6} md={4} key={proposal.id}>
                    <Fade in timeout={700}>
                      <Card
                        sx={{
                          bgcolor: "rgba(15,46,53,0.85)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(94,159,166,0.3)",
                          borderRadius: 4,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
                            borderColor: "#5E9FA6",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Typography variant="h6" gutterBottom>
                            {proposal.project_title || "Project"}
                          </Typography>

                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <MonetizationOn fontSize="small" sx={{ color: "#A0C4C9" }} />
                            <Typography variant="h6" fontWeight={600}>
                              ${proposal.proposed_rate}
                            </Typography>
                          </Box>

                          <Chip
                            icon={getStatusIcon(proposal.status)}
                            label={proposal.status?.toUpperCase() || "UNKNOWN"}
                            color={getStatusColor(proposal.status)}
                            sx={{ mb: 3 }}
                          />

                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<FolderOpen />}
                            onClick={() => navigate(`/projects/${proposal.project_id || proposal.project}`)}
                            sx={{
                              borderColor: "#5E9FA6",
                              color: "#5E9FA6",
                              fontWeight: 600,
                              "&:hover": {
                                bgcolor: "rgba(94,159,166,0.15)",
                                borderColor: "#5E9FA6",
                              },
                            }}
                          >
                            View Project
                          </Button>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            )
          )}
        </Container>
      </Box>
    </>
  );
};

export default Proposals;