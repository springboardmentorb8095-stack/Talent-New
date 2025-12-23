import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Set up axios defaults
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Verify token and get user info
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/auth/profile/');
            setCurrentUser(response.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
                email,
                password
            });

            const { access, refresh, user } = response.data;

            // Store tokens
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            // Set axios default header
            axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

            setCurrentUser(user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            console.log('Sending registration data:', userData);
            const response = await axios.post('http://127.0.0.1:8000/api/auth/register/', userData);
            console.log('Registration response:', response.data);

            const { access, refresh, user } = response.data;

            // Store tokens
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            // Set axios default header
            axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

            setCurrentUser(user);
            return { success: true };
        } catch (error) {
            console.error('Registration error:', error.response?.data);
            return {
                success: false,
                error: error.response?.data || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        delete axios.defaults.headers.common['Authorization'];
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};