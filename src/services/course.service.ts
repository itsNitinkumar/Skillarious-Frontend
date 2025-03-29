import axios from 'axios';
import authService from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class CourseService {
  async getAllCourses() {
    try {
      const response = await axios.get(`${API_URL}/courses/all`);
      return response.data;
    } catch (error) {
      console.error('Error in getAllCourses:', error);
      throw error;
    }
  }

  async getSingleCourse(id: string) {
    const response = await axios.get(`${API_URL}/courses/single/${id}`);
    return response.data;
  }

  async searchCourses(query: string) {
    const response = await axios.get(`${API_URL}/courses/search?query=${query}`);
    return response.data;
  }

  async createCourse(courseData: any) {
    const response = await axios.post(`${API_URL}/courses/create`, courseData, {
      headers: {
        'Authorization': `Bearer ${authService.getAccessToken()}`
      }
    });
    return response.data;
  }

  async updateCourse(courseId: string, courseData: any) {
    console.log('courseId', courseId)
    const response = await axios.put(`${API_URL}/courses/update/${courseId}`, courseData, {
      headers: {
        'Authorization': `Bearer ${authService.getAccessToken()}`
      }
    });
    return response.data;
  }

  async deleteCourse(courseId: string) {
    const response = await axios.delete(`${API_URL}/courses/delete/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${authService.getAccessToken()}`
      }
    });
    return response.data;
  }
}

export default new CourseService();




