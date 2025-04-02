import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  success: boolean;
  message: string;
}

class AuthService {
  async login(email: string, password: string) {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
      email,
      password,
    });

    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    if (response.data.accessToken && response.data.refreshToken) {
      this.setTokens(response.data);
    }
    return response.data
  }

  async signup(name: string, email: string, password: string) {
    return axios.post(`${API_URL}/auth/signup`, {
      name,
      email,
      password,
    });

  }

  async verifyOtp(email: string, otp: string) {
    const response = await axios.post<AuthResponse>(`${API_URL}/otp/verify`, {
      email,
      otp,
    });

    if (response.data.accessToken && response.data.refreshToken) {
      this.setTokens(response.data);
    }
    return response.data;
  }

  async refreshToken() {
    try {
    
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token found');

      const response = await axios.post<AuthResponse>(`${API_URL}/auth/refreshtoken`, {
        token: refreshToken
      });

      if (response.data.accessToken && response.data.refreshToken) {
        this.setTokens(response.data);
      }
      return response.data;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  async logout() {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await axios.post(`${API_URL}/auth/logout`, { refreshToken });
      }
    } finally {
      this.clearTokens();
    }
  }

  setTokens(data: AuthResponse) {
    document.cookie = `accessToken=${data.accessToken}; path=/`;
    document.cookie = `refreshToken=${data.refreshToken}; path=/`;
  }

  getAccessToken() {
    return this.getCookie('accessToken');
  }

  getRefreshToken() {
    return this.getCookie('refreshToken');
  }

  clearTokens() {
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  }

  private getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  }

  async validateSession() {
    try {
      const response = await axios.get(`${API_URL}/auth/validate`, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid session');
      }
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Setup axios interceptor for automatic token refresh
  setupAxiosInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        if (config.url === `${API_URL}/auth/login`) {
          return config;
        }
        const token = this.getAccessToken();
        console.log('refreshing token.. ')
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
          return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          if(originalRequest.url === `${API_URL}/auth/login`) {
            return Promise.reject(error);
          }
          
          try {
            await this.refreshToken();
            const token = this.getAccessToken();
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axios(originalRequest);
          } catch (refreshError) {
            this.clearTokens();
            // window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

const authService = new AuthService();
authService.setupAxiosInterceptors();
export default authService;



