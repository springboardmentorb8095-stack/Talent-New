import { Box, Paper } from '@mui/material';

const AuthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #dcd6ff, #a79bff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={20}
        sx={{
          width: 380,
          minHeight: 520,
          borderRadius: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Purple curved side */}
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '40%',
            height: '100%',
            bgcolor: 'primary.main',
            borderTopLeftRadius: '80%',
            borderBottomLeftRadius: '80%',
          }}
        />

        <Box sx={{ position: 'relative', p: 4 }}>
          {children}
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthLayout;
