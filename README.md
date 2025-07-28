# Buse Arıca Portfolio Website

Modern, responsive portfolio website for interior designer Buse Arıca.

## Features

- **Multi-language Support**: English and Turkish content
- **3D Model Viewer**: Interactive 3D models using Three.js
- **PDF Banner Support**: Downloadable project banners
- **Admin Panel**: Complete content management system
- **Responsive Design**: Works on all devices
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Admin Panel Features

### Access
Visit `/admin` to access the admin panel with the following features:

### Content Management (`/admin/content`)
- Edit multi-language content (English/Turkish)
- Update about section, titles, and descriptions
- Real-time preview and validation

### Project Management (`/admin/projects`)
- Add, edit, and delete portfolio projects
- Upload 3D models (.glb files)
- Add project galleries with multiple images
- Attach PDF banners to projects
- Full CRUD operations

### Skills Management (`/admin/skills`)
- Add, edit, and delete technical skills
- Choose from various Lucide icons
- Live icon preview
- Drag and drop reordering

### Data Persistence
All changes are automatically saved to localStorage for persistence across sessions.

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js + React Three Fiber
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Build Tool**: Vite

## File Structure

```
src/
├── components/          # Reusable UI components
│   ├── Background.tsx   # Animated background
│   ├── ModelViewer.tsx  # 3D model viewer
│   ├── ProjectCard.tsx  # Project card with banner support
│   └── ...
├── contexts/           # React contexts
│   └── AdminContext.tsx # Admin data management
├── pages/              # Admin panel pages
│   ├── AdminLayout.tsx
│   ├── AdminDashboard.tsx
│   ├── ContentManagement.tsx
│   ├── ProjectManagement.tsx
│   └── SkillsManagement.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
└── App.tsx            # Main portfolio component
```

## Setup and Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Content Management

### Adding 3D Models
1. Place `.glb` files in `public/models/`
2. Use admin panel to add model URLs to projects
3. Models are automatically loaded and displayed

### Adding Project Banners
1. Place PDF files in `public/banner/`
2. Use admin panel to link banners to projects
3. Banners appear as download buttons on project cards

### File Naming Convention
- Models: `/models/project-name.glb`
- Banners: `/banner/project-banner.pdf`
- Images: `/images/project-image.jpg`

## Contributing

This is a personal portfolio website. For suggestions or bug reports, please contact the developer.

## License

Private project - All rights reserved.
