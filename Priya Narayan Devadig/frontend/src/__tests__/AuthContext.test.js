import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Test component that uses auth context
function TestComponent() {
    const { user, isAuthenticated } = useAuth();
    return (
        <div>
            <div data-testid="auth-status">
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </div>
            {user && <div data-testid="username">{user.username}</div>}
        </div>
    );
}

describe('AuthContext', () => {
    beforeEach(() => {
        localStorageMock.getItem.mockClear();
        localStorageMock.setItem.mockClear();
        localStorageMock.removeItem.mockClear();
    });

    test('provides authentication state', () => {
        localStorageMock.getItem.mockReturnValue(null);

        render(
            <BrowserRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });

    test('loads user from localStorage on mount', async () => {
        const mockUser = { username: 'testuser', email: 'test@example.com' };
        localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

        render(
            <BrowserRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
            expect(screen.getByTestId('username')).toHaveTextContent('testuser');
        });
    });
});
