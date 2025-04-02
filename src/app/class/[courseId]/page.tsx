'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Class, Module } from '@/types'
import contentService from '@/services/content.service'
import { toast } from 'react-hot-toast'
import { Loader2, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

export default function ClassPage({ params }: { params: { courseId: string } }) {
    const router = useRouter();
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [expandedClassId, setExpandedClassId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        moduleId: '',
        duration: 0,
        video: null as File | null,
    });

    useEffect(() => {
        fetchClasses()
    }, [params.courseId])

    const fetchClasses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await contentService.getAllClasses(params.courseId);

            if (response.success) {
                const transformedClasses = response.data.map((cls: any) => ({
                    id: cls.id,
                    moduleId: cls.moduleId,
                    fileId: cls.fileId,
                    views: cls.views || 0,
                    duration: cls.duration ? new Date(cls.duration) : null
                }));
                
                setClasses(transformedClasses);
            } else {
                throw new Error(response.message || 'Failed to fetch classes');
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error.message || 'Failed to fetch classes';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'duration' ? parseFloat(value) : value
        }))
    }   
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'startDate' | 'endDate') => {
        const { value } = e.target
        setFormData(prev => ({
            ...prev,
            [field]: new Date(value)
        }))
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                video: e.target.files![0]
            }));
        }
    };

    async function createClass() {
        try {
            if (!formData.moduleId) {
                toast.error('Please select a module');
                return;
            }

            if (!formData.video) {
                toast.error('Please upload a video file');
                return;
            }

            setLoading(true);
            const response = await contentService.createClass(params.courseId, formData);
            
            if (response.success) {
                const newClass = response.data;
                setClasses(prevClasses => [...prevClasses, newClass]);
                resetForm();
                toast.success('Class created successfully');
            } else {
                throw new Error(response.message || 'Failed to create class');
            }
        } catch (error: any) {
            console.error('Error creating class:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to create class');
        } finally {
            setLoading(false);
        }
    }

    const handleUpdateClass = async () => {
        try {
            if (!selectedClass) {
                toast.error('No class selected for update');
                return;
            }
            const response = await contentService.updateClass(selectedClass.id, formData);
            setClasses(classes.map(cls => cls.id === selectedClass.id ? response.class : cls));
            setSelectedClass(null);
            resetForm();
            toast.success('Class updated successfully');
        } catch (error) {
            toast.error('Failed to update class');
        }
    };

    const handleDeleteClass = async (classId: string) => {
        if (!confirm('Are you sure you want to delete this class?')) return;
        
        try {
            setLoading(true);
            const response = await contentService.deleteClass(classId);
            
            if (response.success) {
                setClasses(prevClasses => prevClasses.filter(cls => cls.id !== classId));
                setSelectedClass(null);
                resetForm();
                toast.success('Class deleted successfully');
            } else {
                throw new Error(response.message || 'Failed to delete class');
            }
        } catch (error: any) {
            console.error('Error deleting class:', error);
            toast.error(error.message || 'Failed to delete class');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            moduleId: '',
            duration: 0,
            video: null,
        });
        setSelectedClass(null);
    };

    const toggleClassExpansion = (classId: string) => {
        setExpandedClassId(expandedClassId === classId ? null : classId);
    };

    const selectClassForEdit = (cls: Class) => {
        setSelectedClass(cls);
        setFormData({
            moduleId: cls.moduleId,
            duration: cls.duration ? new Date(cls.duration).getTime() / 1000 : 0,
            video: null,
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-white">Class Management</h1>

            {/* Form Section */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-white">
                    {selectedClass ? 'Edit Class' : 'Create New Class'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Module ID</label>
                        <input
                            type="text"
                            name="moduleId"
                            value={formData.moduleId}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                            placeholder="Module ID"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Video File</label>
                        <input
                            type="file"
                            name="video"
                            onChange={handleFileChange}
                            accept="video/*"
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Duration (seconds)</label>
                        <input
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                            placeholder="Duration in seconds"
                            min="0"
                            step="1"
                            required
                        />
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        onClick={selectedClass ? handleUpdateClass : createClass}
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {selectedClass ? 'Update Class' : 'Create Class'}
                    </button>
                    {selectedClass && (
                        <button
                            onClick={resetForm}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {/* Classes List */}
            <div className="space-y-4">
                {classes.map((cls) => (
                    <div key={cls.id} className="bg-gray-800 rounded-lg overflow-hidden">
                        <div 
                            className="flex justify-between items-center p-4 cursor-pointer"
                            onClick={() => toggleClassExpansion(cls.id)}
                        >
                            <div>
                                <h3 className="text-lg font-medium text-white">Module: {cls.moduleId}</h3>
                                <p className="text-sm text-gray-400">Views: {cls.views}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        selectClassForEdit(cls);
                                    }}
                                    className="p-2 text-blue-500 hover:bg-blue-900 rounded-full"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClass(cls.id);
                                    }}
                                    className="p-2 text-red-500 hover:bg-red-900 rounded-full"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                {expandedClassId === cls.id ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                        </div>
                        
                        {expandedClassId === cls.id && (
                            <div className="p-4 border-t border-gray-700">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <strong className="text-gray-400">Views:</strong>
                                        <span className="text-white ml-2">{cls.views}</span>
                                    </div>
                                    <div>
                                        <strong className="text-gray-400">Duration:</strong>
                                        <span className="text-white ml-2">
                                            {cls.duration ? new Date(cls.duration).toISOString().substr(11, 8) : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <strong className="text-gray-400">Video URL:</strong>
                                        <a href={cls.fileId} 
                                           target="_blank" 
                                           rel="noopener noreferrer" 
                                           className="text-blue-400 ml-2 hover:text-blue-300">
                                            {cls.fileId}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
