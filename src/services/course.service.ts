import axios from 'axios';
import authService from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class CourseService {
  async getAllCourses() {
    try {
      const response = await axios.get(`${API_URL}/courses/all`, {
        headers: {
          'Authorization': `Bearer ${authService.getAccessToken()}`
        }
      });
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
    try {
      const response = await axios.get(`${API_URL}/courses/search?name=${encodeURIComponent(query)}&description=${encodeURIComponent(query)}&about=${encodeURIComponent(query)}`);
      return {
        success: true,
        message: 'Courses searched successfully',
        courses: response.data.courses || []
      };
    } catch (error) {
      console.error('Error searching courses:', error);
      return {
        success: false,
        message:  axios.isAxiosError(error) ? error.response?.data?.message : 'Failed to search courses',
        courses: []
      };
    }
  }

  async createCourse(courseData: any, submitData: { 
    name: string;  // Changed from title to name
    description: string; 
    about: string; 
    price: number; 
    thumbnail: string | undefined; 
  }) {
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

  async getCoursesByEducator(educatorId: string) {
    try {
      const response = await axios.get(`${API_URL}/courses/educator/${educatorId}`, {
        headers: {
          'Authorization': `Bearer ${authService.getAccessToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching educator courses:', error);
      throw error;
    }
  }
}

export default new CourseService();








