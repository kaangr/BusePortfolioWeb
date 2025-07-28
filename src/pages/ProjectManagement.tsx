import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAdmin } from '../contexts/AdminContext';
import { Project } from '../types';
import { Plus, Edit, Trash2, Save, X, Upload, Eye, Download } from 'lucide-react';

export function ProjectManagement() {
  const { data, addProject, updateProject, deleteProject } = useAdmin();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Project, 'id'>>();

  const onAddProject = (formData: Omit<Project, 'id'>) => {
    // Parse gallery string to array
    const galleryArray = formData.gallery.length > 0 
      ? (formData.gallery as unknown as string).split(',').map(url => url.trim())
      : [];
    
    addProject({
      ...formData,
      gallery: galleryArray
    });
    reset();
    setShowAddForm(false);
  };

  const onUpdateProject = (formData: Omit<Project, 'id'>) => {
    if (!editingProject) return;
    
    // Parse gallery string to array
    const galleryArray = formData.gallery.length > 0 
      ? (formData.gallery as unknown as string).split(',').map(url => url.trim())
      : [];
    
    updateProject(editingProject.id, {
      ...formData,
      gallery: galleryArray
    });
    setEditingProject(null);
    reset();
  };

  const startEdit = (project: Project) => {
    setEditingProject(project);
    reset({
      ...project,
      gallery: project.gallery.join(', ') as unknown as string[]
    });
  };

  const cancelEdit = () => {
    setEditingProject(null);
    reset();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bu projeyi silmek istediğinize emin misiniz?')) {
      deleteProject(id);
    }
  };

  const openBanner = (bannerUrl: string) => {
    window.open(bannerUrl, '_blank');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Proje Yönetimi</h1>
          <p className="text-gray-400">Portfolio projelerinizi yönetin</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Proje
        </button>
      </div>

      {/* Add Project Form */}
      {showAddForm && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Yeni Proje Ekle</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit(onAddProject)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Proje Başlığı</label>
                <input
                  type="text"
                  {...register('title', { required: 'Bu alan zorunludur' })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Modern Living Room Design"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Ana Görsel URL</label>
                <input
                  type="url"
                  {...register('image', { required: 'Bu alan zorunludur' })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/images/project-main.jpg"
                />
                {errors.image && <p className="text-red-400 text-sm mt-1">{errors.image.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Açıklama</label>
              <textarea
                rows={3}
                {...register('description', { required: 'Bu alan zorunludur' })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Proje hakkında detaylı açıklama..."
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Galeri URL'leri (virgülle ayırın)</label>
                <input
                  type="text"
                  {...register('gallery')}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/images/gallery1.jpg, /images/gallery2.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">3D Model URL (.glb)</label>
                <input
                  type="text"
                  {...register('modelUrl')}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/models/project.glb"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Afiş URL (.pdf)</label>
                <input
                  type="text"
                  {...register('bannerUrl')}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/banner/project-banner.pdf"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Proje Ekle
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {data.projects.map((project) => (
          <div key={project.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            {editingProject?.id === project.id ? (
              /* Edit Form */
              <form onSubmit={handleSubmit(onUpdateProject)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Proje Başlığı</label>
                    <input
                      type="text"
                      {...register('title', { required: 'Bu alan zorunludur' })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Ana Görsel URL</label>
                    <input
                      type="url"
                      {...register('image', { required: 'Bu alan zorunludur' })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Açıklama</label>
                  <textarea
                    rows={3}
                    {...register('description', { required: 'Bu alan zorunludur' })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Galeri URL'leri</label>
                    <input
                      type="text"
                      {...register('gallery')}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">3D Model URL</label>
                    <input
                      type="text"
                      {...register('modelUrl')}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Afiş URL</label>
                    <input
                      type="text"
                      {...register('bannerUrl')}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Kaydet
                  </button>
                </div>
              </form>
            ) : (
              /* Project Display */
              <div className="flex items-start gap-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-32 h-24 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder.jpg';
                  }}
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-gray-400 mb-3">{project.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>ID: #{project.id}</span>
                        <span>Galeri: {project.gallery.length} görsel</span>
                        {project.modelUrl && <span>3D Model: ✓</span>}
                        {project.bannerUrl && <span>Afiş: ✓</span>}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {project.bannerUrl && (
                        <button
                          onClick={() => openBanner(project.bannerUrl!)}
                          className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors"
                          title="Afişi Görüntüle"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => startEdit(project)}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 