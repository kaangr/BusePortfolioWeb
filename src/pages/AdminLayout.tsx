import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, FileText, FolderOpen, Wrench, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const menuItems = [
  { path: '/admin', icon: Home, label: 'Dashboard' },
  { path: '/admin/content', icon: FileText, label: 'İçerik Yönetimi' },
  { path: '/admin/projects', icon: FolderOpen, label: 'Proje Yönetimi' },
  { path: '/admin/skills', icon: Wrench, label: 'Beceri Yönetimi' }
];

export function AdminLayout() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-4">
          <div className="mb-8">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-gray-400 text-sm">Buse Arıca Portfolio</p>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Güvenli Çıkış
            </button>
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
} 