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
        navigate(`/dashboard`);
      })
      .catch((err) => {
        console.error(err);
        alert("Submission failed");
      });
  };

  if (loading) {
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
          Loading...
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
                Freelancer
              </Typography>
            </Box>
            <IconButton color="inherit" onClick={logout}>
              <Logout />
            </IconButton>
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
        <Container maxWidth="md">
          {/* Project Info Header */}
          <Card
            elevation={6}
            sx={{
              mb: 5,
              borderRadius: 3,
              background: "rgba(15, 46, 53, 0.85)",
            }}
          >
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#EAF6F7" }}>
                {project?.title}
              </Typography>

              {/* Single horizontal Box for Budget and Duration */}
              <Box
                sx={{
                  mt: 2,
                  mb: 3,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 6,
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="h6" sx={{ color: "#A0C4C9", fontWeight: 500 }}>
                  Budget: ₹{project?.budget || "Not specified"}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: "#A0C4C9",
                    fontWeight: 500,
                    "&::before": {
                      content: '"•"',
                      mx: 2,
                      color: "#5E9FA6",
                    },
                  }}
                >
                  Duration: {project?.duration || "Not specified"}
                </Typography>
              </Box>

              <Typography variant="body1" color="#A0C4C9">
                Submit your proposal for this project
              </Typography>
            </CardContent>
          </Card>

          {/* Form Card */}
          <Card
            elevation={10}
            sx={{
              borderRadius: 4,
              background: "rgba(15, 46, 53, 0.95)",
              color: "#EAF6F7",
            }}
          >
            <CardContent sx={{ p: 6 }}>
              <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
                Submit Proposal
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  label="Cover Letter"
                  placeholder="Tell us why you're perfect for this project..."
                  multiline
                  rows={8}
                  fullWidth
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                  variant="outlined"
                  sx={{
                    mb: 4,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    "& .MuiInputBase-input": { color: "#EAF6F7" },
                    "& .MuiInputLabel-root": { color: "#A0C4C9", fontWeight: 500 },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#5E9FA6" },
                      "&:hover fieldset": { borderColor: "#A0C4C9" },
                      "&.Mui-focused fieldset": { borderColor: "#A0C4C9" },
                    },
                    "& .MuiInputBase-input::placeholder": { color: "#A0C4C9" },
                  }}
                />

                <TextField
                  label="Proposed Rate"
                  type="number"
                  placeholder="Enter your rate"
                  fullWidth
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, color: "#5E9FA6" }}>₹</Typography>,
                  }}
                  sx={{
                    mb: 6,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    "& .MuiInputBase-input": { color: "#EAF6F7" },
                    "& .MuiInputLabel-root": { color: "#A0C4C9", fontWeight: 500 },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#5E9FA6" },
                      "&:hover fieldset": { borderColor: "#A0C4C9" },
                      "&.Mui-focused fieldset": { borderColor: "#A0C4C9" },
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    py: 2,
                    fontSize: "1.2rem",
                    backgroundColor: "#5E9FA6",
                    "&:hover": { backgroundColor: "#2F6F78" },
                    borderRadius: 3,
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