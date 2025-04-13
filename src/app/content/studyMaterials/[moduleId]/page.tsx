'use client';
import ContentService from "@/services/content.service";
import { useState, useEffect } from "react";
import { StudyMaterial } from "@/types";
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getFileThumbnail } from '@/utils/file-helpers';
import MaterialViewer from '@/components/MaterialViewer';

export default function Studymaterials({
  params
}: {
  params: { moduleId: string }
}) {
  const router = useRouter();
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [selectedStudyMaterial, setSelectedStudyMaterial] = useState<StudyMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [expandedMaterialId, setExpandedMaterialId] = useState<string | null>(null);
  const [selectedMaterialForView, setSelectedMaterialForView] = useState<StudyMaterial | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0,
    fileUrl: '',
    type: '',
    isPreview: false,
  });

  useEffect(() => {
    fetchStudyMaterials(params.moduleId);
  }, [params.moduleId]);

  const fetchStudyMaterials = async (moduleId: string) => {
    try {
      setLoading(true);
      if (!moduleId) {
        throw new Error('Module ID is required');
      }
      const response = await ContentService.getModuleStudyMaterials(params.moduleId);
      setStudyMaterials(response.data);
    } catch (error) {
      console.error('Error fetching study materials:', error);
      setError(error instanceof Error ? error : new Error('Failed to fetch study materials'));
      toast.error('Failed to fetch study materials');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, fileUrl: URL.createObjectURL(file), type: file.type }));
    }
  };

  const handleCreateStudyMaterial = async () => {
    try {
      setLoading(true);
      if (!params.moduleId) {
        toast.error('Module ID is required');
        return;
      }
      const response = await ContentService.uploadStudyMaterial(params.moduleId, formData);
      setStudyMaterials([...studyMaterials, response.data]);
      resetForm();
      toast.success('Study material created successfully');
    } catch (error) {
      console.error('Error creating study material:', error);
      toast.error('Failed to create study material');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStudyMaterial = async (materialId: string) => {
    try {
      setLoading(true);
      if (!materialId) {
        toast.error('Material ID is required');
        return;
      }
      const response = await ContentService.updateStudyMaterial(materialId, formData);
      setStudyMaterials(studyMaterials.map(material =>
        material.id === materialId ? response.data : material
      ));
      resetForm();
      setSelectedStudyMaterial(response.data);
      toast.success('Study material updated successfully');
    } catch (error) {
      console.error('Error updating study material:', error);
      toast.error('Failed to update study material');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudyMaterial = async (materialId: string) => {
    try {
      setLoading(true);
      if (!materialId) {
        toast.error('Material ID is required');
        return;
      }
      await ContentService.deleteStudyMaterial(materialId);
      setStudyMaterials(studyMaterials.filter(material => material.id !== materialId));
      toast.success('Study material deleted successfully');
    } catch (error) {
      console.error('Error deleting study material:', error);
      toast.error('Failed to delete study material');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      order: 0,
      fileUrl: '',
      type: '',
      isPreview: false,
    });
  };

  const selectStudyMaterialForEdit = (material: StudyMaterial) => {
    setSelectedStudyMaterial(material);
    setFormData({
      title: material.title,
      description: material.description ?? '',
      order: material.order,
      fileUrl: material.fileUrl,
      type: material.type,
      isPreview: material.isPreview,
    });
  };

  const toggleMaterialExpansion = (materialId: string) => {
    setExpandedMaterialId(expandedMaterialId === materialId ? null : materialId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">Study Materials</h1>

        {/* Form Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">
            {selectedStudyMaterial ? 'Edit Study Material' : 'Create New Study Material'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="Material title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="Material description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">File</label>
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPreview"
                checked={formData.isPreview}
                onChange={handleInputChange}
                className="mr-2 bg-gray-700 text-red-500 rounded focus:ring-2 focus:ring-red-500"
              />
              <label className="text-sm font-medium text-gray-300">Is Preview</label>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => selectedStudyMaterial ? handleUpdateStudyMaterial(selectedStudyMaterial.id) : handleCreateStudyMaterial()}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {selectedStudyMaterial ? 'Update Material' : 'Create Material'}
            </button>
            {selectedStudyMaterial && (
              <button
                onClick={() => {
                  setSelectedStudyMaterial(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Materials List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Materials List</h2>
          <div className="space-y-4">
            {studyMaterials.map((material) => (
              <div key={material.id} className="bg-gray-700 rounded-lg overflow-hidden">
                <div 
                  className="flex cursor-pointer"
                  onClick={() => toggleMaterialExpansion(material.id)}
                >
                  <div className="relative w-48 h-32">
                    <Image
                      src={getFileThumbnail(material.type)}
                      alt={material.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-white">{material.title}</h3>
                        <div className="text-sm text-gray-400 mt-1">
                          {material.type}
                          {material.isPreview && <span className="ml-2 text-red-400">(Preview)</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectStudyMaterialForEdit(material);
                          }}
                          className="p-2 text-gray-400 hover:text-white"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStudyMaterial(material.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded content */}
                {expandedMaterialId === material.id && (
                  <div className="p-4 bg-gray-800">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">Description</h4>
                        <p className="text-white">{material.description}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">File Type</h4>
                        <p className="text-white">{material.type}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">Order</h4>
                        <p className="text-white">{material.order}</p>
                      </div>
                      <button
                        onClick={() => setSelectedMaterialForView(material)}
                        className="block w-full mt-4 px-4 py-2 bg-red-600 text-white text-center rounded-lg hover:bg-red-700"
                      >
                        View Material
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedMaterialForView && (
        <MaterialViewer
          fileUrl={selectedMaterialForView.fileUrl}
          fileType={selectedMaterialForView.type}
          title={selectedMaterialForView.title}
          onClose={() => setSelectedMaterialForView(null)}
        />
      )}
    </div>
  );
}
