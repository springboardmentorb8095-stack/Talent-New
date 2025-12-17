// // // src/pages/Login.js ← Replace your entire file with this
// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { useSnackbar } from 'notistack';
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Container,
//   Paper,
//   Avatar,
//   Link
// } from '@mui/material';
// import { Login as LoginIcon } from '@mui/icons-material';
// const Login = () => {
//   const [data, setData] = useState({ username: '', password: '' });
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const { enqueueSnackbar } = useSnackbar();
//   const handleChange = (e) => {
//     setData({ ...data, [e.target.name]: e.target.value });
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // This sends EXACTLY what Django expects
//       await login({ username: data.username.trim(), password: data.password });
//       enqueueSnackbar('Login successful!', { variant: 'success' });
//       navigate('/dashboard');
//     } catch (err) {
//       enqueueSnackbar('Login failed — check username/password', { variant: 'error' });
//     }
//   };
//   return (
//     <Container maxWidth="xs">
//       <Paper elevation={10} sx={{ mt: 8, p: 5, borderRadius: 4, textAlign: 'center' }}>
//         <Avatar sx={{ mx: 'auto', bgcolor: 'primary.main', width: 60, height: 60, mb: 2 }}>
//           <LoginIcon sx={{ fontSize: 35 }} />
//         </Avatar>
//         <Typography variant="h4" fontWeight="bold" gutterBottom>
//           Login to TalentLink
//         </Typography>
//         <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
//           <TextField
//             label="Username"
//             name="username"
//             value={data.username}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//             required
//             autoFocus
//           />
//           <TextField
//             label="Password"
//             name="password"
//             type="password"
//             value={data.password}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//             required
//           />
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             size="large"
//             sx={{ mt: 4, mb: 2, py: 1.5, borderRadius: 3 }}
//           >
//             Login
//           </Button>
//           <Link
//             component="button"
//             variant="body1"
//             onClick={() => navigate('/register')}
//             sx={{ display: 'block' }}
//           >
//             No account? Register here
//           </Link>
//         </Box>
//       </Paper>
//     </Container>
//   );
// };
// export default Login; 
// src/pages/Login.js  ← Replace your entire file with this
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
      // This sends EXACTLY what Django expects
      await login({ username: data.username.trim(), password: data.password });
      enqueueSnackbar('Login successful!', { variant: 'success' });
      navigate('/dashboard');
    } catch (err) {
      enqueueSnackbar('Login failed — check username/password', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={10} sx={{ mt: 8, p: 5, borderRadius: 4, textAlign: 'center' }}>
        <Avatar sx={{ mx: 'auto', bgcolor: 'primary.main', width: 60, height: 60, mb: 2 }}>
          <LoginIcon sx={{ fontSize: 35 }} />
        </Avatar>

        <Typography variant="h4" fontWeight="bold" gutterBottom>
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
            sx={{ mt: 4, mb: 2, py: 1.5, borderRadius: 3 }}
          >
            Login
          </Button>

          <Link
            component="button"
            variant="body1"
            onClick={() => navigate('/register')}
            sx={{ display: 'block' }}
          >
            No account? Register here
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;