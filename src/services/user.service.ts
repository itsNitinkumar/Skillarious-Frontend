import axios from 'axios';
import authService from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class UserService {
  private getHeaders() {
    return {
      'Authorization': `Bearer ${authService.getAccessToken()}`
    };
  }

  async updateProfile(profileData: any) {
    try {
      const response = await axios.put(`${API_URL}/users/updateprofile`, profileData, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await axios.get(`${API_URL}/users/getprofile`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
}

export default new UserService();

