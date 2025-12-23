

// export default theme; 
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2F6F78',     // Main teal (LOGIN button)
      light: '#5E9FA6',
      dark: '#0F2E35',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#5E9FA6',
    },
    background: {
      default: '#0F2E35',  // Page background
      paper: '#0C2328',    // Cards
    },
    text: {
      primary: '#EAF6F7',
      secondary: '#9FBEC3',
    },
  },

  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      letterSpacing: '0.2em',
      fontWeight: 300,
    },
    button: {
      textTransform: 'uppercase',
      fontWeight: 600,
      letterSpacing: '0.1em',
    },
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#0C2328',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#E0E0E0',
          borderRadius: 4,
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          paddingTop: 12,
          paddingBottom: 12,
        },
      },
    },
  },
});

export default theme;
