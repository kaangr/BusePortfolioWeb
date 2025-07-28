import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAdmin } from '../contexts/AdminContext';
import { iconOptions } from '../contexts/AdminContext';
import { Skill } from '../types';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

export function SkillsManagement() {
  const { data, addSkill, updateSkill, deleteSkill } = useAdmin();
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<Omit<Skill, 'id'>>();
  const selectedIcon = watch('icon');

  const onAddSkill = (formData: Omit<Skill, 'id'>) => {
    addSkill(formData);
    reset();
    setShowAddForm(false);
  };

  const onUpdateSkill = (formData: Omit<Skill, 'id'>) => {
    if (!editingSkill) return;
    updateSkill(editingSkill.id, formData);
    setEditingSkill(null);
    reset();
  };

  const startEdit = (skill: Skill) => {
    setEditingSkill(skill);
    reset(skill);
  };

  const cancelEdit = () => {
    setEditingSkill(null);
    reset();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu beceriyi silmek istediğinize emin misiniz?')) {
      deleteSkill(id);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(option => option.value === iconName);
    return iconOption?.component;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Beceri Yönetimi</h1>
          <p className="text-gray-400">Teknik becerilerinizi yönetin</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Beceri
        </button>
      </div>

      {/* Add Skill Form */}
      {showAddForm && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Yeni Beceri Ekle</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit(onAddSkill)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Beceri Adı</label>
                <input
                  type="text"
                  {...register('name', { required: 'Bu alan zorunludur' })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AutoCAD, Photoshop, vb."
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">İkon Seçin</label>
                <select
                  {...register('icon', { required: 'Bu alan zorunludur' })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">İkon seçin...</option>
                  {iconOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
                {errors.icon && <p className="text-red-400 text-sm mt-1">{errors.icon.message}</p>}
              </div>
            </div>

            {/* Icon Preview */}
            {selectedIcon && (
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">İkon Önizleme:</h3>
                <div className="flex items-center gap-3">
                  {(() => {
                    const IconComponent = getIconComponent(selectedIcon);
                    return IconComponent ? <IconComponent className="w-6 h-6" /> : null;
                  })()}
                  <span>{watch('name') || 'Beceri Adı'}</span>
                </div>
              </div>
            )}

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
                Beceri Ekle
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.skills.map((skill) => (
          <div key={skill.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            {editingSkill?.id === skill.id ? (
              /* Edit Form */
              <form onSubmit={handleSubmit(onUpdateSkill)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Beceri Adı</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Bu alan zorunludur' })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">İkon</label>
                  <select
                    {...register('icon', { required: 'Bu alan zorunludur' })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Edit Icon Preview */}
                {selectedIcon && (
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const IconComponent = getIconComponent(selectedIcon);
                        return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
                      })()}
                      <span className="text-sm">{watch('name') || 'Beceri Adı'}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                  >
                    <Save className="w-3 h-3" />
                    Kaydet
                  </button>
                </div>
              </form>
            ) : (
              /* Skill Display */
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {(() => {
                    const IconComponent = getIconComponent(skill.icon);
                    return IconComponent ? <IconComponent className="w-6 h-6 text-blue-400" /> : null;
                  })()}
                  <div>
                    <h3 className="font-medium">{skill.name}</h3>
                    <p className="text-sm text-gray-400">{skill.icon}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(skill)}
                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {data.skills.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Henüz hiç beceri eklenmemiş.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            İlk becerinizi ekleyin
          </button>
        </div>
      )}
    </div>
  );
} 