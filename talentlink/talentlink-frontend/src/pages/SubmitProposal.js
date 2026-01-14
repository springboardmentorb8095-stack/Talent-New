


import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material";
import { ArrowBack, Logout } from "@mui/icons-material";

function SubmitProposal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [coverLetter, setCoverLetter] = useState("");
  const [rate, setRate] = useState("");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "U";

  useEffect(() => {
    api
      .get(`http://127.0.0.1:8000/api/projects/${id}/`)
      .then((res) => {
        setProject(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post("http://127.0.0.1:8000/api/proposals/create/", {
        project: id,
        cover_letter: coverLetter,
        proposed_rate: rate,
        status: "pending",
      })
      .then(() => {
        alert("Proposal submitted successfully");
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error(err);
        alert("Submission failed");
      });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0F2E35, #2F6F78)",
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
      {/* ================= HEADER ================= */}
      <AppBar position="static" elevation={0} sx={{ background: "#0B2228" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton sx={{ color: "#A0C4C9" }} onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#5E9FA6" }}>
                          TalentLink
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "#5E9FA6", fontWeight: "bold" }}>
              {avatarLetter}
            </Avatar>
            <Box>
              <Typography variant="body1" color="#EAF6F7">
                {user?.username || "User"}
              </Typography>
              <Typography variant="caption" color="#A0C4C9">
                Freelancer
              </Typography>
            </Box>
            <IconButton onClick={handleLogout} sx={{ color: "#E57373" }}>
                  <Logout fontSize="large" />
             </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ================= MAIN CONTENT ================= */}
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          background: "linear-gradient(135deg, #0F2E35, #2F6F78)",
          py: 6,
        }}
      >
        <Container maxWidth="md">
          {/* ================= PROJECT SUMMARY ================= */}
          <Card
            elevation={6}
            sx={{
              mb: 5,
              borderRadius: 4,
              background: "rgba(15, 46, 53, 0.9)",
              textAlign: "center",
            }}
          >
            <CardContent sx={{ p: 5 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom color="#EAF6F7">
                {project?.title}
              </Typography>

              <Divider sx={{ my: 3, borderColor: "#5E9FA6" }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 5,
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="h6" color="#A0C4C9">
                  Budget: ₹{project?.budget || "N/A"}
                </Typography>
                <Typography variant="h6" color="#A0C4C9">
                  Duration: {project?.duration || "N/A"}
                </Typography>
              </Box>

              <Typography variant="body1" color="#A0C4C9" mt={3}>
                Create a strong proposal to impress the client
              </Typography>
            </CardContent>
          </Card>

          {/* ================= PROPOSAL FORM ================= */}
          <Card
            elevation={10}
            sx={{
              borderRadius: 4,
              background: "rgba(15, 46, 53, 0.95)",
              transition: "0.3s",
              "&:hover": {
                boxShadow: "0 0 30px rgba(94,159,166,0.3)",
              },
            }}
          >
            <CardContent sx={{ p: 6 }}>
              <Typography
                variant="h4"
                align="center"
                fontWeight="bold"
                gutterBottom
                color="#EAF6F7"
              >
                Submit Proposal
              </Typography>

              <Divider sx={{ my: 4, borderColor: "#5E9FA6" }} />

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  label="Cover Letter"
                  multiline
                  rows={8}
                  fullWidth
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                  placeholder="Explain your experience, approach, and why you're the right fit..."
                  sx={{
                    mb: 4,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    "& .MuiInputBase-input": { color: "#EAF6F7" },
                    "& .MuiInputLabel-root": { color: "#A0C4C9" },
                    "& fieldset": { borderColor: "#5E9FA6" },
                    "&:hover fieldset": { borderColor: "#A0C4C9" },
                  }}
                />

                <TextField
                  label="Proposed Rate"
                  type="number"
                  fullWidth
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  required
                  sx={{
                    mb: 5,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    "& .MuiInputBase-input": { color: "#EAF6F7" },
                    "& .MuiInputLabel-root": { color: "#A0C4C9" },
                    "& fieldset": { borderColor: "#5E9FA6" },
                    "&:hover fieldset": { borderColor: "#A0C4C9" },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    py: 2,
                    fontSize: "1.15rem",
                    borderRadius: 3,
                    backgroundColor: "#5E9FA6",
                    "&:hover": { backgroundColor: "#2F6F78" },
                  }}
                >
                  Submit Proposal
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}

export default SubmitProposal;
