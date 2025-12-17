// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import { deepPurple, amber } from "@mui/material/colors";

// const theme = createTheme({
//   palette: {
//     mode: "light",
//     primary: { main: deepPurple[500] },
//     secondary: { main: amber[500] },
//     background: { default: "#f5f5f5", paper: "#ffffff" },
//   },
//   typography: {
//     fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
//     button: { textTransform: "none" },
//   },
//   components: {
//     MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
//     MuiTextField: { styleOverrides: { root: { marginBottom: 16 } } },
//   },
// });

// export default function Theme({ children }) {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       {children}
//     </ThemeProvider>
//   );
// }
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue for professional matchmaking
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0', // Purple accent
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: { fontWeight: 600 },
    button: { textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
      },
    },
  },
});

export default theme; 
