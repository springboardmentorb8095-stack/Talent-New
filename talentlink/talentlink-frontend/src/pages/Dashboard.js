
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Typography, Container, Button, Paper, Avatar, Box } from '@mui/material';
import { Logout } from '@mui/icons-material';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const avatarLetter = user?.username?.charAt(0).toUpperCase() || 'U';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F2E35 0%, #2F6F78 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={12}
          sx={{
            p: 6,
            borderRadius: 4,
            textAlign: 'center',
            background: '#0C2328',
            color: '#EAF6F7',
          }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 3,
              bgcolor: '#2F6F78',
              border: '4px solid #5E9FA6',
              fontSize: '4rem',
            }}
          >
            {avatarLetter}
          </Avatar>

          <Typography variant="h4" fontWeight="bold" gutterBottom>
            LOGIN SUCCESSFUL
          </Typography>

          <Button
            variant="contained"
            startIcon={<Logout />}
            onClick={logout}
            sx={{
              mt: 3,
              px: 5,
              py: 1.5,
              backgroundColor: '#2F6F78',
              '&:hover': { backgroundColor: '#5E9FA6' },
            }}
          >
            Logout
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
