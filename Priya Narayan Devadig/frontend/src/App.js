import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProjectFeed from './pages/ProjectFeed';
import ProjectDetail from './pages/ProjectDetail';
import CreateProject from './pages/CreateProject';
import SubmitProposal from './pages/SubmitProposal';
import Contracts from './pages/Contracts';
import Messages from './pages/Messages';
import SubmitReview from './pages/SubmitReview';
import Reviews from './pages/Reviews';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/projects"
                            element={
                                <PrivateRoute>
                                    <ProjectFeed />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/projects/create"
                            element={
                                <PrivateRoute>
                                    <CreateProject />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/projects/:id"
                            element={
                                <PrivateRoute>
                                    <ProjectDetail />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/projects/:id/submit-proposal"
                            element={
                                <PrivateRoute>
                                    <SubmitProposal />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/contracts"
                            element={
                                <PrivateRoute>
                                    <Contracts />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/messages"
                            element={
                                <PrivateRoute>
                                    <Messages />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/review/:contractId"
                            element={
                                <PrivateRoute>
                                    <SubmitReview />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/reviews"
                            element={
                                <PrivateRoute>
                                    <Reviews />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;