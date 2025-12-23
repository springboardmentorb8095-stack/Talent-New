// // src/pages/Home.js
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Container, Box, Typography, Button, Paper } from '@mui/material';

// const Home = () => {
//   const navigate = useNavigate();

//   return (
//     <Container
//       maxWidth="sm"
//       sx={{
//         height: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}
//     >
//       <Paper
//         elevation={12}
//         sx={{
//           p: 6,
//           borderRadius: 4,
//           textAlign: 'center',
//           width: '100%',
//           background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
//           color: 'white',
//         }}
//       >
//         <Typography variant="h3" fontWeight="bold" gutterBottom>
//           Welcome to TalentLink
//         </Typography>
//         <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
//           Connect with clients and freelancers easily
//         </Typography>

//         <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
//           <Button
//             variant="contained"
//             size="large"
//             onClick={() => navigate('/login')}
//             sx={{
//               px: 5,
//               py: 1.5,
//               borderRadius: 3,
//               fontWeight: 'bold',
//               backgroundColor: 'white',
//               color: '#1976d2',
//               '&:hover': { backgroundColor: '#f0f0f0' },
//             }}
//           >
//             Login
//           </Button>

//           <Button
//             variant="contained"
//             size="large"
//             onClick={() => navigate('/register')}
//             sx={{
//               px: 5,
//               py: 1.5,
//               borderRadius: 3,
//               fontWeight: 'bold',
//               backgroundColor: 'white',
//               color: '#1976d2',
//               '&:hover': { backgroundColor: '#f0f0f0' },
//             }}
//           >
//             Register
//           </Button>
//         </Box>
//       </Paper>
//     </Container>
//   );
// };

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper } from '@mui/material';

const Home = () => {
  const navigate = useNavigate();

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
            boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{ letterSpacing: '0.15em' }}
          >
            WELCOME 
          </Typography>

          <Typography variant="h6" sx={{ mb: 4, opacity: 0.85 }}>
            Connect with clients and freelancers easily
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                px: 5,
                py: 1.5,
                backgroundColor: '#2F6F78',
                '&:hover': { backgroundColor: '#5E9FA6' },
              }}
            >
              Login
            </Button>

            <Button
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{
                px: 5,
                py: 1.5,
                backgroundColor: '#2F6F78',
                '&:hover': { backgroundColor: '#5E9FA6' },
              }}
            >
              Register
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;
