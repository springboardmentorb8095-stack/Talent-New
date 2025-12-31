
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  Stack,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
} from "@mui/material";
import { Add, ArrowBack, Logout } from "@mui/icons-material";

const NewProject = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    duration: "",
    skills: [],
  });

  const [newSkill, setNewSkill] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (
      !formData.title ||
      !formData.description ||
      !formData.budget ||
      !formData.duration
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      await api.post("http://127.0.0.1:8000/api/projects/", {
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        duration: formData.duration,
        skills: formData.skills,
      });

      setSuccess("Project posted successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.non_field_errors?.[0] ||
          "Failed to create project. Please login again."
      );
    } finally {
      setLoading(false);
    }
  };

  const avatarLetter = user?.username?.charAt(0)?.toUpperCase() || "U";

  const darkInputStyles = {
    "& .MuiInputBase-input": { color: "#EAF6F7" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#5E9FA6" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#A0C4C9" },
    "& .MuiInputLabel-root": { color: "#A0C4C9" },
    backgroundColor: "rgba(255,255,255,0.05)",
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #0F2E35 0%, #2F6F78 100%)",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="inherit" onClick={() => navigate("/dashboard")}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" fontWeight="bold" color="#EAF6F7">
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
                Client
              </Typography>
            </Box>
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
          py: 6,
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center" mb={5}>
            <Typography variant="h4" fontWeight="bold" color="#EAF6F7">
              Post a New Project
            </Typography>
            <Typography color="#A0C4C9">
              Describe your project and find the right talent
            </Typography>
          </Box>

          {(error || success) && (
            <Alert
              severity={success ? "success" : "error"}
              sx={{ mb: 3 }}
              onClose={() => {
                setError(null);
                setSuccess(null);
              }}
            >
              {error || success}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              background: "rgba(15, 46, 53, 0.85)",
              p: 4,
              borderRadius: 3,
            }}
          >
            <TextField
              required
              label="Project Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              sx={darkInputStyles}
            />

            <TextField
              required
              label="Project Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              sx={darkInputStyles}
            />

            <TextField
              required
              label="Budget"
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleChange}
              fullWidth
              sx={darkInputStyles}
            />

            <TextField
              required
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              fullWidth
              sx={darkInputStyles}
            />

            <Box>
              <Typography color="#EAF6F7" mb={1}>
                Skills Required
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                {formData.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleRemoveSkill(skill)}
                  />
                ))}
              </Stack>

              <TextField
                label="Add skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                fullWidth
                sx={darkInputStyles}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleAddSkill}>
                      <Add />
                    </IconButton>
                  ),
                }}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button variant="outlined" onClick={() => navigate("/dashboard")}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Posting..." : "Post Project"}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default NewProject;
