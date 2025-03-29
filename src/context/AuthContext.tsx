'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/auth.service';

interface User {
  email: string;
  id: string;
  isEducator: boolean;
  isAdmin: boolean;
  name: string;
  pfp: string;
  phone: string;
  role: string;
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserProfile = async () => {
    try {
      const response = await authService.validateSession();
      if (response.success) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = authService.getAccessToken();
        console.log('Access token exists:', !!accessToken);
        
        const refreshToken = authService.getRefreshToken();
        console.log('Refresh token exists:', !!refreshToken);

        if (!accessToken && !refreshToken) {
          console.log('No tokens found, setting user to null');
          setUser(null);
          return;
        }

        if (!accessToken && refreshToken) {
          console.log('Attempting to refresh token...');
          try {
            await authService.refreshToken();
            console.log('Token refresh successful');
          } catch (error) {
            console.error('Token refresh failed:', error);
            setUser(null);
            return;
          }
        }

        await fetchUserProfile();
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        await fetchUserProfile(); // Fetch user profile after successful login
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      await authService.signup(name, email, password);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const response = await authService.verifyOtp(email, otp);
      if (response.success) {
        // Save the tokens received from OTP verification
        if (response.accessToken && response.refreshToken) {
          authService.setTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            success: true,
            message: response.message
          });
        }

        // Check if user wanted to register as educator
        const pendingEducatorRegistration = localStorage.getItem('pendingEducatorRegistration');
        
        if (pendingEducatorRegistration) {
          localStorage.removeItem('pendingEducatorRegistration');
          router.push('/educator/register');
        } else {
          router.push('/login');
        }
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push('/login');
    } catch (error: any) {
      console.error('Logout failed:', error);
      // Still clear local state even if server logout fails
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, verifyOtp }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);








