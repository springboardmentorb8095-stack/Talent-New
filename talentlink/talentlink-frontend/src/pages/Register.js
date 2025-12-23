
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'freelancer',
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
      await register(formData);
      enqueueSnackbar('Registration successful! Please login.', {
        variant: 'success',
      });
      navigate('/login');
    } catch (err) {
      enqueueSnackbar('Registration failed. Try different username/email.', {
        variant: 'error',
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2c515cff, #1f5c63)',
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={10} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" align="center" gutterBottom color="white">
            Register for TalentLink
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
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <MenuItem value="freelancer">Freelancer</MenuItem>
                <MenuItem value="client">Client</MenuItem>
              </Select>
            </FormControl>

            <Box mt={3}>
              <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: '#2F6F78' }}>
                Register
              </Button>
            </Box>

            <Box mt={1}>
              <Button onClick={() => navigate('/login')} fullWidth sx={{ color: '#AEE5EA' }}>
                Already have an account? Login
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
