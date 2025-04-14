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

    async createClass(
        contentId: string, 
        formData: FormData,
        onProgress?: (progress: number) => void
    ) {
        try {
            const response = await axios.post(
                `${API_URL}/content/${contentId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${this.getToken()}`
                    },
                    onUploadProgress: (progressEvent) => {
                        if (onProgress && progressEvent.total) {
                            const progress = (progressEvent.loaded / progressEvent.total) * 100;
                            onProgress(progress);
                        }
                    }
                }
            );
            
            if (response.data.success === false) {
                throw new Error(response.data.message || 'Failed to create class');
            }
            
            return response.data;
        } catch (error: any) {
            console.error('Create class error:', error);
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                'Failed to create class'
            );
        }
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

    async updateClass(
        classId: string, 
        formData: FormData,
        onProgress?: (progress: number) => void
    ) {
        try {
            const response = await axios.put(
                `${API_URL}/content/class/${classId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        if (onProgress && progressEvent.total) {
                            const progress = (progressEvent.loaded / progressEvent.total) * 100;
                            onProgress(progress);
                        }
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to update class');
        }
    }

    async deleteClass(contentId: string) {
        try {
            const response = await axios.delete(
                `${API_URL}/content/deleteClass/${contentId}`,  // Updated to match backend route
                {
                    headers: {
                        'Authorization': `Bearer ${this.getToken()}`
                    }
                }
            );
            
            if (response.data.success === false) {
                throw new Error(response.data.message || 'Failed to delete class');
            }
            
            return response.data;
        } catch (error: any) {
            console.error('Delete class error:', error);
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                'Failed to delete class'
            );
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

    private getToken() {
        // Get the token from localStorage or your auth service
        return localStorage.getItem('token') || '';
    }
}

export default new ContentService();
