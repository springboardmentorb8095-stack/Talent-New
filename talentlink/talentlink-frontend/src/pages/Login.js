
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
  Avatar,
  Link,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Login as LoginIcon } from "@mui/icons-material";

const Login = () => {
  const [data, setData] = useState({ username: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({
        username: data.username.trim(),
        password: data.password,
      });
      enqueueSnackbar("Login successful!", { variant: "success" });
      navigate("/dashboard");
    } catch (err) {
      enqueueSnackbar("Login failed — check username or password", {
        variant: "error",
      });
    }
  };

  /* ===== Dark TextField Styles ===== */
  const darkTextFieldStyles = {
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

  return (
    <>
      {/* ===== HEADER ===== */}
      <AppBar position="static" elevation={0} sx={{ background: "#0B2228" }}>
        <Toolbar sx={{ justifyContent: "space-between", py:1 }}>
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
            sx={{ color: "#A0C4C9" }}
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </Toolbar>
      </AppBar>

      {/* ===== LOGIN PAGE ===== */}
      <Box
        sx={{
          minHeight: "calc(110vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0B2228 0%, #1A3D45 50%, #2F6F78 100%)",
        }}
      >
        <Container maxWidth="xs">
          <Paper
            elevation={12}
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
              <LoginIcon sx={{ fontSize: 36 }} />
            </Avatar>

            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "#EAF6F7" }}
            >
              Welcome Back
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: "#A0C4C9", mb: 3 }}
            >
              Login to continue to TalentLink
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Username"
                name="username"
                value={data.username}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                autoFocus
                sx={darkTextFieldStyles}
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                value={data.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                sx={darkTextFieldStyles}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 4,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  bgcolor: "#5E9FA6",
                  "&:hover": { bgcolor: "#4A858C" },
                }}
              >
                Login
              </Button>

              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/register")}
                sx={{
                  display: "block",
                  color: "#A0C4C9",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              >
                Don’t have an account? Register
              </Link>
            </Box>
            
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

export default Login;
