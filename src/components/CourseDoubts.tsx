'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { Doubt } from '@/types';
import { toast } from 'react-hot-toast';

interface DoubtFormData {
    title: string;
    description: string;
    contentId: string;
}

export default function CourseDoubts({ courseId, contentId }: { courseId: string; contentId: string }) {
    const [doubts, setDoubts] = useState<Doubt[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<DoubtFormData>({
        title: '',
        description: '',
        contentId: contentId
    });

    useEffect(() => {
        loadDoubts();
    }, [courseId, contentId]);

    const loadDoubts = async () => {
        try {
            const response = await fetch(`/api/v1/doubts/${contentId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            const data = await response.json();
            setDoubts(data.doubts);
        } catch (error) {
            toast.error('Failed to load doubts');
        }
    };

    const handleSubmitDoubt = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/v1/doubts/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to create doubt');

            const data = await response.json();
            setDoubts([...doubts, data.data]);
            setShowForm(false);
            setFormData({ title: '', description: '', contentId });
            toast.success('Doubt posted successfully');
        } catch (error) {
            toast.error('Failed to post doubt');
        }
    };

    return (
        <div className="space-y-6">
            {/* New Doubt Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    <Plus className="w-5 h-5" />
                    Ask a Doubt
                </button>
            </div>

            {/* Doubt Form */}
            {showForm && (
                <form onSubmit={handleSubmitDoubt} className="space-y-4 border p-4 rounded-lg">
                    <div>
                        <label className="block mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                            minLength={5}
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 border rounded"
                            rows={4}
                            required
                            minLength={20}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 border rounded hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            )}

            {/* Doubts List */}
            <div className="space-y-4">
                {doubts.map((doubt) => (
                    <div key={doubt.id} className="border p-4 rounded-lg">
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="font-semibold">{doubt.title}</h4>
                                <p className="text-gray-600 mt-1">{doubt.description}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-sm ${
                                doubt.status === 'answered' 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {doubt.status}
                            </span>
                        </div>
                        {doubt.status === 'answered' && (
                            <div className="mt-4 pl-4 border-l-2">
                                <p className="text-gray-800">{doubt.message}</p>
                            </div>
                        )}
                    </div>
                ))}
                {doubts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No doubts posted yet
                    </div>
                )}
            </div>
        </div>
    );
}