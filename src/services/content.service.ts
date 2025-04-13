import axios, { AxiosError } from 'axios';
import authService from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ContentService {
    async createModule(courseId: string, moduleData: any) {
        const response = await axios.post(`${API_URL}/content/createModule`, {
            courseId,
            ...moduleData
        }, {
            headers: {
                'Authorization': `Bearer ${authService.getAccessToken()}`
            }
        });
        return response.data;
    }

    async updateModule(moduleId: string, moduleData: any) {
        try {
            // Change the endpoint to match your backend route
            const response = await axios.put(`${API_URL}/content/updateModule/${moduleId}`, moduleData, {
                headers: {
                    'Authorization': `Bearer ${authService.getAccessToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Update module error:', error.response?.data);
                throw error;
            }
            throw error;
        }
    }

    async deleteModule(moduleId: string) {
        try {
            const response = await axios.delete(`${API_URL}/content/module/${moduleId}`, {
                headers: {
                    'Authorization': `Bearer ${authService.getAccessToken()}`
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Delete module error:', error.response?.data);
                throw error;
            }
            throw error;
        }
    }

    async getAllModules(courseId: string) {
        console.log('Making request to:', `${API_URL}/content/getAllModules/${courseId}`);
        try {
            const response = await axios.get(`${API_URL}/content/getAllModules/${courseId}`, {
                headers: {
                    Authorization: `Bearer ${authService.getAccessToken()}`
                }
            });
            // Ensure we always return an array in data property
            return {
                success: true,
                message: 'Modules retrieved successfully',
                data: Array.isArray(response.data.data) ? response.data.data : []
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                switch (error.response?.status) {
                    case 404:
                        return {
                            success: false,
                            message: 'No modules found for this course',
                            data: []
                        };
                    case 401:
                        try {
                            await authService.refreshToken();
                            const retryResponse = await axios.get(`${API_URL}/content/getAllModules/${courseId}`, {
                                headers: {
                                    Authorization: `Bearer ${authService.getAccessToken()}`
                                }
                            });
                            return {
                                success: true,
                                message: 'Modules retrieved successfully',
                                data: Array.isArray(retryResponse.data.data) ? retryResponse.data.data : []
                            };
                        } catch (refreshError) {
                            throw new Error('Authentication failed');
                        }
                    default:
                        console.error('Error in getAllModules:', error.response?.data);
                        throw error;
                }
            }
            console.error('Unexpected error:', error);
            throw error;
        }
    }

    async uploadStudyMaterial(moduleId: string, materialData: any) {
        const response = await axios.post(`${API_URL}/content/uploadStudyMaterial`, {
            materialData,
            moduleId
        }, {
            headers: {
                'Authorization': `Bearer ${authService.getAccessToken()}`
            }
        });
        return response.data;
    }

    async updateStudyMaterial(materialId: string, materialData: any) {
        const response = await axios.put(`${API_URL}/content/updateStudymaterial/${materialId}`, materialData, {
            headers: {
                'Authorization': `Bearer ${authService.getAccessToken()}`
            }
        });
        return response.data;
    }

    async deleteStudyMaterial(materialId: string) {
        const response = await axios.delete(`${API_URL}/content/deleteStudyMaterial/${materialId}`, {
            headers: {
                'Authorization': `Bearer ${authService.getAccessToken()}`
            }
        });
        return response.data;
    }

    async getModuleStudyMaterials(moduleId: string) {
        const response = await axios.get(`${API_URL}/content/getModuleStudyMaterials/${moduleId}`, {
            headers: {
                'Authorization': `Bearer ${authService.getAccessToken()}`
            }
        });
        return response.data;
    }

    async createClass(courseId: string, classData: any) {
        const formData = new FormData();
        
        // Add moduleId and duration to form data
        formData.append('moduleId', classData.moduleId);
        formData.append('duration', classData.duration.toString());
        
        // Add video file if it exists
        if (classData.video) {
            formData.append('video', classData.video);
        }

        const response = await axios.post(`${API_URL}/content/createClass`, formData, {
            headers: {
                'Authorization': `Bearer ${authService.getAccessToken()}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    async getAllClasses(courseId: string) {
        try {
            const response = await axios.get(`${API_URL}/content/getAllClassesOfCourse/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${authService.getAccessToken()}`
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching classes:', error.response?.data);
                throw error;
            }
            throw error;
        }
    }

    async getModuleClasses(moduleId: string) {
        try {
            const response = await axios.get(`${API_URL}/content/getModuleClasses/${moduleId}`, {
                headers: {
                    'Authorization': `Bearer ${authService.getAccessToken()}`
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching module classes:', error.response?.data);
                throw error;
            }
            throw error;
        }
    }

    async updateClass(classId: string, classData: any) {
        const response = await axios.put(`${API_URL}/content/updateClass/${classId}`, classData, {
            headers: {
                'Authorization': `Bearer ${authService.getAccessToken()}`
            }
        });
        return response.data;
    }

    async deleteClass(classId: string) {
        try {
            const response = await axios.delete(`${API_URL}/content/deleteClass/${classId}`, {
                headers: {
                    'Authorization': `Bearer ${authService.getAccessToken()}`
                }
            });
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.error('Delete class error:', error.response?.data);
                throw error.response?.data;
            }
            throw error;
        }
    }

    async saveVideoProgress(classId: string, progress: number) {
        try {
            const response = await axios.post(`${API_URL}/content/saveVideoProgress`, {
                classId,
                progress
            }, {
                headers: {
                    'Authorization': `Bearer ${authService.getAccessToken()}`
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Save video progress error:', error.response?.data);
                throw error;
            }
            throw error;
        }
    }

    private handleError(error: any) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.message;
            
            switch (status) {
                case 404:
                    return {
                        success: false,
                        message: message || 'Resource not found',
                        notFound: true
                    };
                case 403:
                    return {
                        success: false,
                        message: message || 'Permission denied',
                        forbidden: true
                    };
                case 401:
                    return {
                        success: false,
                        message: message || 'Authentication required',
                        unauthorized: true
                    };
                default:
                    return {
                        success: false,
                        message: message || 'An error occurred'
                    };
            }
        }
        return {
            success: false,
            message: 'An unexpected error occurred'
        };
    }
}



const contentService = new ContentService();
export default contentService;
