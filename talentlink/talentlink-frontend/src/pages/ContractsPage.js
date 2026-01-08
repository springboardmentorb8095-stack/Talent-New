

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ContractsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [contracts, setContracts] = useState([]);
  const [acceptedProposals, setAcceptedProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState("");
  const [loading, setLoading] = useState(true);

  const isClient = user?.role === "client";
  const avatarLetter = user?.username?.[0]?.toUpperCase() || "U";

  /* -----------------------------
     Load Contracts
  ------------------------------ */
  const loadContracts = useCallback(() => {
    api
      .get("http://127.0.0.1:8000/api/contracts/my/")
      .then((res) => {
        const data = res.data.results || res.data || [];
        setContracts(data);
      })
      .catch((err) => console.error("Failed to fetch contracts:", err));
  }, []);

  /* -----------------------------
     Load Accepted Proposals (Client)
  ------------------------------ */
  const loadAcceptedProposals = useCallback(() => {
    if (!user || !isClient) {
      setLoading(false);
      return;
    }

    api
      .get("http://127.0.0.1:8000/api/projects/")
      .then((res) => {
        const projects = res.data.results || res.data || [];
        const proposalPromises = projects.map((project) =>
          api
            .get(`http://127.0.0.1:8000/api/proposals/projects/${project.id}/proposals/`)
            .then((res) => {
              const proposals = res.data.results || [];
              return proposals
                .filter((p) => p.status.toLowerCase() === "accepted")
                .map((p) => ({
                  ...p,
                  project_title: project.title,
                }));
            })
            .catch(() => [])
        );

        Promise.all(proposalPromises)
          .then((allProposals) => {
            setAcceptedProposals(allProposals.flat());
            setLoading(false);
          })
          .catch(() => setLoading(false));
      })
      .catch(() => setLoading(false));
  }, [user, isClient]);

  useEffect(() => {
    loadContracts();
    loadAcceptedProposals();
  }, [loadContracts, loadAcceptedProposals]);

  /* -----------------------------
     Create Contract
  ------------------------------ */
  const createContract = () => {
    if (!selectedProposal) return;

    api
      .post(`http://127.0.0.1:8000/api/contracts/create/${selectedProposal}/`)
      .then(() => {
        alert("Contract created successfully!");
        setSelectedProposal("");
        loadContracts();
        loadAcceptedProposals();
      })
      .catch(() => alert("Failed to create contract."));
  };

  /* -----------------------------
     Update Contract Status
  ------------------------------ */
  const updateContractStatus = (contractId, status) => {
    api
      .patch(`http://127.0.0.1:8000/api/contracts/${contractId}/status/`, {
        status,
      })
      .then(() => loadContracts())
      .catch(() => alert("Failed to update contract status."));
  };

  return (
    <>
      {/* HEADER */}
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #0F2E35 0%, #2F6F78 100%)",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="inherit" onClick={() => navigate("/dashboard")}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#EAF6F7" }}>
              Contracts
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "#5E9FA6", width: 40, height: 40 }}>
              {avatarLetter}
            </Avatar>
            <Box>
              <Typography sx={{ color: "#EAF6F7" }}>
                {user?.username || "User"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#A0C4C9" }}>
                {user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : "Role"}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ minHeight: "calc(100vh - 64px)", p: 4, bgcolor: "#0F2E35" }}>
        {/* CLIENT: CREATE CONTRACT */}
        {isClient && (
          <>
            <Typography
              variant="h5"
              sx={{ color: "#EAF6F7", mb: 3, fontWeight: "bold" }}
            >
              Create Contract from Accepted Proposal
            </Typography>

            {loading ? (
              <Typography sx={{ color: "#A0C4C9" }}>
                Loading accepted proposals...
              </Typography>
            ) : acceptedProposals.length === 0 ? (
              <Typography sx={{ color: "#A0C4C9", mb: 4 }}>
                No accepted proposals available.
              </Typography>
            ) : (
              <Box sx={{ display: "flex", gap: 2, mb: 4, alignItems: "end" }}>
                <FormControl sx={{ minWidth: 400 }}>
                  <InputLabel sx={{ color: "#A0C4C9" }}>
                    Select Proposal
                  </InputLabel>
                  <Select
                    value={selectedProposal}
                    onChange={(e) => setSelectedProposal(e.target.value)}
                    sx={{
                      color: "#EAF6F7",
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "#5E9FA6",
                      },
                    }}
                  >
                    {acceptedProposals.map((proposal) => (
                      <MenuItem key={proposal.id} value={proposal.id}>
                        {proposal.project_title} – Freelancer:{" "}
                        {proposal.freelancer_username} (₹
                        {proposal.proposed_rate})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  onClick={createContract}
                  disabled={!selectedProposal}
                  sx={{
                    backgroundColor: "#5E9FA6",
                    "&:hover": { backgroundColor: "#2F6F78" },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  CREATE CONTRACT
                </Button>
              </Box>
            )}
          </>
        )}

        {/* CONTRACT LIST */}
        <Typography
          variant="h5"
          sx={{ color: "#EAF6F7", mb: 3, fontWeight: "bold" }}
        >
          My Contracts
        </Typography>

        {contracts.length === 0 ? (
          <Typography sx={{ color: "#A0C4C9" }}>
            No contracts found.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {contracts.map((contract) => {
              const projectTitle =
                contract.project_title ||
                contract.project?.title ||
                "Untitled Project";

              const status = (contract.status || "pending").toLowerCase();
              const isActive = status === "active";
              const freelancerId =
                contract.freelancer_id ||
                contract.proposal?.freelancer?.id;

              return (
                <Grid item xs={12} md={6} key={contract.id}>
                  <Card
                    sx={{
                      bgcolor: "rgba(15,46,53,0.8)",
                      color: "#EAF6F7",
                      borderRadius: 3,
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Project: {projectTitle}
                      </Typography>

                      <Typography variant="body1" sx={{ mb: 2 }}>
                        Start Date:{" "}
                        {contract.start_date
                          ? new Date(
                              contract.start_date
                            ).toLocaleDateString()
                          : "-"}
                      </Typography>

                      <Chip
                        label={status.toUpperCase()}
                        color={
                          status === "completed"
                            ? "primary"
                            : status === "cancelled"
                            ? "error"
                            : "success"
                        }
                        sx={{ mb: 3 }}
                      />

                      {isActive && (
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Button
                            variant="contained"
                            onClick={() =>
                              navigate(`/messages?user_id=${freelancerId}`)
                            }
                            sx={{
                              backgroundColor: "#5E9FA6",
                              "&:hover": { backgroundColor: "#2F6F78" },
                            }}
                          >
                            Message
                          </Button>

                          <Button
                            variant="contained"
                            onClick={() =>
                              updateContractStatus(contract.id, "completed")
                            }
                            sx={{
                              backgroundColor: "#4CAF50",
                              "&:hover": { backgroundColor: "#388E3C" },
                            }}
                          >
                            Mark Completed
                          </Button>

                          <Button
                            variant="contained"
                            onClick={() =>
                              updateContractStatus(contract.id, "cancelled")
                            }
                            sx={{
                              backgroundColor: "#D32F2F",
                              "&:hover": { backgroundColor: "#B71C1C" },
                            }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </>
  );
};

export default ContractsPage;