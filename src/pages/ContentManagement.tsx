import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAdmin } from '../contexts/AdminContext';
import { Content } from '../types';
import { Save, Languages, AlertCircle } from 'lucide-react';

export function ContentManagement() {
  const { data, updateContent } = useAdmin();
  const [activeTab, setActiveTab] = useState<'en' | 'tr'>('en');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<Content>({
    defaultValues: data.content
  });

  const onSubmit = async (formData: Content) => {
    setSaveStatus('saving');
    try {
      updateContent(formData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const tabs = [
    { key: 'en' as const, label: 'English', flag: '🇺🇸' },
    { key: 'tr' as const, label: 'Türkçe', flag: '🇹🇷' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">İçerik Yönetimi</h1>
          <p className="text-gray-400">Çok dilli içerik düzenleme</p>
        </div>
        <div className="flex items-center gap-4">
          {saveStatus === 'saved' && (
            <div className="flex items-center gap-2 text-green-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Değişiklikler kaydedildi</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Kaydetme hatası</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Language Tabs */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex space-x-1 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span>{tab.flag}</span>
                <Languages className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Başlık ({activeTab === 'en' ? 'English' : 'Türkçe'})
              </label>
              <input
                type="text"
                {...register(`${activeTab}.title`, { required: 'Bu alan zorunludur' })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Interior Designer / İç Mimar"
              />
              {errors[activeTab]?.title && (
                <p className="text-red-400 text-sm mt-1">{errors[activeTab]?.title?.message}</p>
              )}
            </div>

            {/* About Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Hakkımda Başlığı ({activeTab === 'en' ? 'English' : 'Türkçe'})
              </label>
              <input
                type="text"
                {...register(`${activeTab}.aboutTitle`, { required: 'Bu alan zorunludur' })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="About Me / Hakkımda"
              />
              {errors[activeTab]?.aboutTitle && (
                <p className="text-red-400 text-sm mt-1">{errors[activeTab]?.aboutTitle?.message}</p>
              )}
            </div>

            {/* About Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Hakkımda Açıklaması ({activeTab === 'en' ? 'English' : 'Türkçe'})
              </label>
              <textarea
                rows={5}
                {...register(`${activeTab}.about`, { required: 'Bu alan zorunludur' })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Kendinizden bahsedin..."
              />
              {errors[activeTab]?.about && (
                <p className="text-red-400 text-sm mt-1">{errors[activeTab]?.about?.message}</p>
              )}
            </div>

            {/* Skills Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Beceriler Başlığı ({activeTab === 'en' ? 'English' : 'Türkçe'})
              </label>
              <input
                type="text"
                {...register(`${activeTab}.skills`, { required: 'Bu alan zorunludur' })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Technical Skills / Teknik Beceriler"
              />
              {errors[activeTab]?.skills && (
                <p className="text-red-400 text-sm mt-1">{errors[activeTab]?.skills?.message}</p>
              )}
            </div>

            {/* Projects Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Projeler Başlığı ({activeTab === 'en' ? 'English' : 'Türkçe'})
              </label>
              <input
                type="text"
                {...register(`${activeTab}.projects`, { required: 'Bu alan zorunludur' })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Featured Projects / Öne Çıkan Projeler"
              />
              {errors[activeTab]?.projects && (
                <p className="text-red-400 text-sm mt-1">{errors[activeTab]?.projects?.message}</p>
              )}
            </div>

            {/* View Projects Button Text */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Projeleri Görüntüle Butonu ({activeTab === 'en' ? 'English' : 'Türkçe'})
              </label>
              <input
                type="text"
                {...register(`${activeTab}.viewProjects`, { required: 'Bu alan zorunludur' })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="View My Projects / Projelerimi Görüntüle"
              />
              {errors[activeTab]?.viewProjects && (
                <p className="text-red-400 text-sm mt-1">{errors[activeTab]?.viewProjects?.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isDirty || saveStatus === 'saving'}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              isDirty && saveStatus !== 'saving'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-5 h-5" />
            {saveStatus === 'saving' ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
} 