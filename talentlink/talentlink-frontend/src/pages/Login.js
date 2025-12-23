

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Avatar,
  Link
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';

const Login = () => {
  const [data, setData] = useState({ username: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ username: data.username.trim(), password: data.password });
      enqueueSnackbar('Login successful!', { variant: 'success' });
      navigate('/dashboard');
    } catch (err) {
      enqueueSnackbar('Login failed — check username/password', { variant: 'error' });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2d5d69ff, #1f5c63)',
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={10} sx={{ p: 5, borderRadius: 4, textAlign: 'center' }}>
          <Avatar sx={{ mx: 'auto', bgcolor: '#2F6F78', width: 60, height: 60, mb: 2 }}>
            <LoginIcon sx={{ fontSize: 35 }} />
          </Avatar>

          <Typography variant="h4" fontWeight="bold" gutterBottom color="white">
            Login to TalentLink
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              label="Username"
              name="username"
              value={data.username}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              autoFocus
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
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 4, mb: 2, py: 1.5, borderRadius: 3, bgcolor: '#2F6F78' }}
            >
              Login
            </Button>

            <Link
              component="button"
              variant="body1"
              onClick={() => navigate('/register')}
              sx={{ display: 'block', color: '#AEE5EA' }}
            >
             NO ACCOUNT? REGISTER HERE
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
