import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../contexts/AuthContext';

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('Navbar Component', () => {
    beforeEach(() => {
        localStorageMock.getItem.mockClear();
    });

    test('renders navbar with logo', () => {
        localStorageMock.getItem.mockReturnValue(null);

        render(
            <BrowserRouter>
                <AuthProvider>
                    <Navbar />
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByText(/Freelance Marketplace/i)).toBeInTheDocument();
    });

    test('shows login and register links when not authenticated', () => {
        localStorageMock.getItem.mockReturnValue(null);

        render(
            <BrowserRouter>
                <AuthProvider>
                    <Navbar />
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByText(/Login/i)).toBeInTheDocument();
        expect(screen.getByText(/Register/i)).toBeInTheDocument();
    });

    test('shows dashboard and logout when authenticated', () => {
        const mockUser = { username: 'testuser', email: 'test@example.com' };
        localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

        render(
            <BrowserRouter>
                <AuthProvider>
                    <Navbar />
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    });
});
