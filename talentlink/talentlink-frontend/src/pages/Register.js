
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  AppBar,
  Toolbar,
} from "@mui/material";
import { PersonAdd } from "@mui/icons-material";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const { register } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending role:", formData.role); // ✅ DEBUG
      await register(formData);
      enqueueSnackbar("Registration successful! Please login.", {
        variant: "success",
      });
      navigate("/login");
    } catch (err) {
      enqueueSnackbar("Registration failed. Try different username/email.", {
        variant: "error",
      });
    }
  };

  /* ===== Dark Input Styles ===== */
  const darkInputStyles = {
    "& .MuiInputBase-input": { color: "#EAF6F7" },
    "& .MuiInputLabel-root": { color: "#A0C4C9" },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#5E9FA6",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#A0C4C9",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#5E9FA6",
    },
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 2,
  };

  const darkSelectStyles = {
    "& .MuiSelect-select": { color: "#EAF6F7" },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#5E9FA6",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#A0C4C9",
    },
    "& .MuiSvgIcon-root": { color: "#A0C4C9" },
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 2,
  };

  return (
    <>
      {/* ===== HEADER ===== */}
      <AppBar position="static" elevation={0} sx={{ background: "#0B2228" }}>
        <Toolbar sx={{ justifyContent: "space-between" , py:1}}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              letterSpacing: 1,
              color: "#5E9FA6",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            TalentLink
          </Typography>

          <Button
            color="inherit"
            sx={{ color: "#A0C4C9"}}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* ===== REGISTER PAGE ===== */}
      <Box
        sx={{
          // minHeight: "calc(110vh - 64px)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0B2228 0%, #1A3D45 50%, #2F6F78 100%)",
        }}
      >
        <Container maxWidth="xs">
          <Paper
            elevation={10}
            sx={{
              p: 5,
              borderRadius: 4,
              textAlign: "center",
              background: "rgba(15, 46, 53, 0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(94,159,166,0.3)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
            }}
          >
            <Avatar
              sx={{
                mx: "auto",
                bgcolor: "#5E9FA6",
                width: 64,
                height: 64,
                mb: 2,
                boxShadow: "0 0 15px rgba(94,159,166,0.5)",
              }}
            >
              <PersonAdd sx={{ fontSize: 36 }} />
            </Avatar>

            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "#EAF6F7" }}
            >
              Create Account
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: "#A0C4C9", mb: 3 }}
            >
              Join TalentLink and start your journey
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Username"
                name="username"
                fullWidth
                margin="normal"
                value={formData.username}
                onChange={handleChange}
                required
                sx={darkInputStyles}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                required
                sx={darkInputStyles}
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                required
                sx={darkInputStyles}
              />

              {/* ===== ROLE SELECT (LOGIC UNCHANGED) ===== */}
              <FormControl fullWidth margin="normal" sx={darkSelectStyles}>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="freelancer">Freelancer</MenuItem>
                  <MenuItem value="client">Client</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  bgcolor: "#5E9FA6",
                  "&:hover": { bgcolor: "#4A858C" },
                }}
              >
                Register
              </Button>

              <Button
                onClick={() => navigate("/login")}
                fullWidth
                sx={{
                  mt: 1,
                  color: "#A0C4C9",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              >
                Already have an account? Login
              </Button>
            </form>
          </Paper>
        </Container>
       </Box>
       {/* ===== FOOTER ===== */}
            <Box
              sx={{
                py: 3,
                textAlign: "center",
                background: "#0B2228",
                color: "#A0C4C9",
              }}
            >
              <Typography variant="body2">
                © {new Date().getFullYear()} TalentLink. All rights reserved.
              </Typography>
            </Box>
    </>
  );
};

export default Register;
