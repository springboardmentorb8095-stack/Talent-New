
// //import logo from './logo.svg';
// //import './App.css';

// //function App() {
//   //return (
//     //<div className="App">
//       //<header className="App-header">
//         //<img src={logo} className="App-logo" alt="logo" />
//         //<p>
//           //Edit <code>src/App.js</code> and save to reload.
//         //</p>
//         //<a
//           //className="App-link"
//           //href="https://reactjs.org"
//           //target="_blank"
//           //rel="noopener noreferrer"
//         //>
//           //Learn React
//         //</a>
//       //</header>
//     //</div>
//   //);
// //}

// //export default App;
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import Layout from "./components/Layout";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <Layout>
//           <Routes>
//             <Route path="/" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//           </Routes>
//         </Layout>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import theme from './components/Theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App; 