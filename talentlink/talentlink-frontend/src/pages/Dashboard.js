// 
import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Typography,
  Container,
  Button,
  Paper,
  Avatar,
  useTheme
} from '@mui/material';
import { Logout } from '@mui/icons-material';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();

  const avatarLetter = user?.username?.charAt(0).toUpperCase() || 'U';

  return (
    <Container maxWidth="sm" sx={{ mt: 12, mb: 8 }}>
      <Paper
        elevation={12}
        sx={{
          borderRadius: 4,
          textAlign: 'center',
          p: 6,
          background: `linear-gradient(
            135deg,
            ${theme.palette.primary.light} 0%,
            ${theme.palette.primary.main} 100%
          )`,
          color: 'white',
        }}
      >
        {/* Avatar */}
        <Avatar
          sx={{
            width: 120,
            height: 120,
            mx: 'auto',
            mb: 3,
            bgcolor: 'white',
            color: theme.palette.primary.main,
            fontSize: '4rem',
            fontWeight: 'bold',
          }}
        >
          {avatarLetter}
        </Avatar>

        {/* Title */}
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Login Successful!
        </Typography>

        {/* User Info */}
        {user && (
          <>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {user.username}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.85, mb: 3 }}>
              {user.email}
            </Typography>
          </>
        )}

        {/* Logout Button */}
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Logout />}
          onClick={logout}
          sx={{
            px: 5,
            py: 1.5,
            borderRadius: 3,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            bgcolor: 'white',
            color: 'primary.main',
            '&:hover': {
              bgcolor: theme.palette.primary.light,
            },
          }}
        >
          Logout
        </Button>
      </Paper>
    </Container>
  );
};

export default Dashboard;
