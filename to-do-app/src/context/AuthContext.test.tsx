import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, AuthContext } from './AuthContext';

// Mock api
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    defaults: { headers: { common: {} } }
  }
}));

// Import and type the mocked API
import api from '../services/api';
const mockedApi = api as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  defaults: { headers: { common: Record<string, string> } };
};

// Mock component that uses AuthContext
const TestComponent = () => {
  return (
    <AuthContext.Consumer>
      {(value) => (
        <div>
          <div data-testid="loading">{String(value.loading)}</div>
          <div data-testid="error">{value.error || 'no-error'}</div>
          <div data-testid="currentUser">{value.currentUser ? 'logged-in' : 'logged-out'}</div>
          <button onClick={() => value.login({ username: 'test', password: 'password' })}>Login</button>
          <button onClick={() => value.logout()}>Logout</button>
          <button onClick={() => value.clearError()}>Clear Error</button>
          <button onClick={() => value.register({username: 'testuser', firstName: 'Test', lastName: 'User', email: 'test@example.com', password: 'password' })}>Register</button>
          <button onClick={() => value.updateProfile({ firstName: 'Updated' })}>Update Profile</button>
        </div>
      )}
    </AuthContext.Consumer>
  );
};

describe('AuthContext', () => {
  // Type the localStorage mock methods
  let mockLocalStorage: {
    getItem: ReturnType<typeof vi.fn>;
    setItem: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
    clear: ReturnType<typeof vi.fn>;
  };
  
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock localStorage
    mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
  });

  it('provides initial state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
    expect(screen.getByTestId('currentUser')).toHaveTextContent('logged-out');
  });
  
  it('loads user from token in localStorage', async () => {
    const mockUser = {
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Setup localStorage mock to return a token
    mockLocalStorage.getItem.mockReturnValue('existing-token');
    
    // Mock API response for fetching current user
    mockedApi.get.mockResolvedValueOnce({ data: mockUser });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for loading to complete
    expect(await screen.findByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('currentUser')).toHaveTextContent('logged-in');
    expect(mockedApi.get).toHaveBeenCalledWith('/api/users/me');
    expect(mockedApi.defaults.headers.common['Authorization']).toBe('Bearer existing-token');
  });

  it('handles logout correctly', async () => {
    const mockUser = {
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Setup initial logged in state
    mockedApi.post.mockResolvedValueOnce({ 
      data: { token: 'test-token', user: mockUser }
    });
    
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Login first
    const loginButton = screen.getByText('Login');
    await user.click(loginButton);
    expect(await screen.findByTestId('currentUser')).toHaveTextContent('logged-in');
    
    // Then logout
    await user.click(screen.getByText('Logout'));
    
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
    expect(screen.getByTestId('currentUser')).toHaveTextContent('logged-out');
    expect(mockedApi.defaults.headers.common['Authorization']).toBeUndefined();
  });

  it('handles login failure correctly', async () => {
    // Mock API to simulate login failure
    const errorMessage = 'Invalid credentials';
    mockedApi.post.mockRejectedValueOnce({ 
      response: { data: { message: errorMessage } }
    });
    
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const loginButton = screen.getByText('Login');
    await user.click(loginButton);
    
    expect(await screen.findByTestId('error')).toHaveTextContent(errorMessage);
    expect(screen.getByTestId('currentUser')).toHaveTextContent('logged-out');
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
  });

  it('updates state after login', async () => {
    const mockUser = {
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockedApi.post.mockResolvedValueOnce({ 
      data: { token: 'test-token', user: mockUser }
    });
    
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const loginButton = screen.getByText('Login');
    await user.click(loginButton);
    
    // Should set token in localStorage
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
    
    // Should update auth headers
    expect(mockedApi.defaults.headers.common['Authorization']).toBe('Bearer test-token');
    
    // Should update current user
    expect(await screen.findByTestId('currentUser')).toHaveTextContent('logged-in');
  });
  
  it('handles registration correctly', async () => {
    mockedApi.post.mockResolvedValueOnce({ data: { success: true } });
    
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const registerButton = screen.getByText('Register');
    await user.click(registerButton);
    
    expect(mockedApi.post).toHaveBeenCalledWith('/api/auth/register', {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password',
      username: 'testuser'
    });
  });
  
  it('handles registration failure', async () => {
    const errorMessage = 'Email already exists';
    mockedApi.post.mockRejectedValueOnce({ 
      response: { data: { message: errorMessage } }
    });
    
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const registerButton = screen.getByText('Register');
    await user.click(registerButton);
    
    expect(await screen.findByTestId('error')).toHaveTextContent(errorMessage);
  });
  
  it('handles profile update correctly', async () => {
    const mockUser = {
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedUser = {
      ...mockUser,
      firstName: 'Updated'
    };
    
    // Mock successful login first
    mockedApi.post.mockResolvedValueOnce({ 
      data: { token: 'test-token', user: mockUser }
    });
    
    // Mock profile update
    mockedApi.put.mockResolvedValueOnce({ data: updatedUser });
    
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Login first
    const loginButton = screen.getByText('Login');
    await user.click(loginButton);
    expect(await screen.findByTestId('currentUser')).toHaveTextContent('logged-in');
    
    // Update profile
    const updateButton = screen.getByText('Update Profile');
    await user.click(updateButton);
    
    expect(mockedApi.put).toHaveBeenCalledWith('/api/users/me', { firstName: 'Updated' });
  });
  
  it('clears error when requested', async () => {
    // Set up an error first
    const errorMessage = 'Invalid credentials';
    mockedApi.post.mockRejectedValueOnce({ 
      response: { data: { message: errorMessage } }
    });
    
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Generate an error
    const loginButton = screen.getByText('Login');
    await user.click(loginButton);
    expect(await screen.findByTestId('error')).toHaveTextContent(errorMessage);
    
    // Clear the error
    const clearButton = screen.getByText('Clear Error');
    await user.click(clearButton);
    
    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
  });
  
  it('handles session expiration', async () => {
    // Setup localStorage mock to return a token
    mockLocalStorage.getItem.mockReturnValue('expired-token');
    
    // Mock API error for fetching current user
    mockedApi.get.mockRejectedValueOnce({ response: { status: 401 } });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for loading to complete
    expect(await screen.findByTestId('loading')).toHaveTextContent('false');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockedApi.defaults.headers.common['Authorization']).toBeUndefined();
    expect(screen.getByTestId('error')).toHaveTextContent('Session expired. Please login again.');
  });
});