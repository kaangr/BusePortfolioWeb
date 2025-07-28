import React from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { FileText, FolderOpen, Wrench, BarChart3 } from 'lucide-react';

export function AdminDashboard() {
  const { data } = useAdmin();

  const stats = [
    {
      label: 'Toplam Proje',
      value: data.projects.length,
      icon: FolderOpen,
      color: 'bg-blue-500'
    },
    {
      label: 'Beceriler',
      value: data.skills.length,
      icon: Wrench,
      color: 'bg-green-500'
    },
    {
      label: 'Dil Desteği',
      value: 2,
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      label: '3D Modeller',
      value: data.projects.filter(p => p.modelUrl).length,
      icon: BarChart3,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Portfolio yönetim paneliniz</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Son Projeler</h2>
        <div className="space-y-3">
          {data.projects.slice(0, 5).map((project) => (
            <div key={project.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-12 h-12 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder.jpg';
                  }}
                />
                <div>
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="text-sm text-gray-400">
                    {project.modelUrl ? '3D Model ✓' : 'Sadece Galeri'}
                    {project.bannerUrl && ' • Afiş ✓'}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                #{project.id}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-left">
            <FileText className="w-6 h-6 mb-2" />
            <h3 className="font-medium">İçerik Düzenle</h3>
            <p className="text-sm text-blue-200">Sayfa metinlerini güncelle</p>
          </button>
          <button className="p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-left">
            <FolderOpen className="w-6 h-6 mb-2" />
            <h3 className="font-medium">Yeni Proje</h3>
            <p className="text-sm text-green-200">Portfolyona proje ekle</p>
          </button>
          <button className="p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-left">
            <Wrench className="w-6 h-6 mb-2" />
            <h3 className="font-medium">Beceri Ekle</h3>
            <p className="text-sm text-purple-200">Yeni bir yazılım becerisi</p>
          </button>
        </div>
      </div>
    </div>
  );
} 