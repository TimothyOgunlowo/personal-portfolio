# Infinite Canvas Workspace

A modern, single-user infinite canvas workspace application inspired by Milanote and Figma. Built with React, TypeScript, Konva.js, and Supabase.

## ✨ Features

### Core Functionality

- **Infinite Canvas**: Smooth panning and zooming with Konva.js
- **Nested Boards**: Organize content hierarchically with board-within-board navigation
- **Multiple Content Types**:
  - 📁 Boards (folders)
  - 📝 Sticky Notes
  - 📄 Text Cards
  - 📋 Rich Text Documents
  - 🖼️ Images
  - 📎 Files

### User Experience

- **Grid Snapping**: Subtle grid alignment (10-15px threshold)
- **Zoom Transitions**: Smooth animations when diving into nested boards
- **Search**: Global and board-specific content search
- **Theme Toggle**: Light and dark mode support
- **Minimap**: Real-time viewport position indicator
- **Keyboard Shortcuts**:
  - `V` - Select tool
  - `B` - Board tool
  - `S` - Sticky note
  - `T` - Text card
  - `D` - Document
  - `I` - Image
  - `F` - File
  - `⌘K` / `Ctrl+K` - Search

### UI Components

- **Bottom Toolbar**: Figma-inspired floating toolbar with tool selection
- **Left Sidebar**: Collapsible board tree view and quick-add buttons
- **Top Bar**: Breadcrumb navigation, search, and theme toggle
- **Document Editor**: Rich text editor with formatting options

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Canvas Rendering**: Konva.js (react-konva)
- **Backend/Database**: Supabase (PostgreSQL + Storage)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account ([create one here](https://supabase.com))

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd personal-portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a New Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project
3. Wait for the database to initialize

#### Run the Database Setup Script

Copy the SQL from `src/lib/supabase.ts` (the commented section) and run it in the Supabase SQL editor:

1. Open your project in Supabase
2. Go to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Paste the entire SQL schema from the comments in `src/lib/supabase.ts`
5. Click **Run**

This will create:
- `boards` table
- `items` table
- `files` table
- Necessary indexes and triggers
- Row Level Security (RLS) policies

#### Create Storage Bucket

1. Go to **Storage** in the Supabase dashboard
2. Click **New bucket**
3. Name it `uploads`
4. Set to **Public** (or private if you prefer authenticated access)
5. Click **Create bucket**

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

You can find these values in:
- Supabase Dashboard → Settings → API

### 5. Run the Development Server

```bash
npm run dev
```

The app will open at [http://localhost:5173](http://localhost:5173)

## 📁 Project Structure

```
src/
├── components/
│   ├── canvas/           # Canvas and Konva components
│   ├── items/            # Content type components
│   ├── toolbar/          # UI toolbars
│   ├── search/           # Search functionality
│   ├── editor/           # Document editor
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Core utilities
├── store/                # State management
└── App.tsx
```

## 🎨 Database Schema

See `src/lib/supabase.ts` for the complete schema definition.

## 🔮 Roadmap (V2 Features)

- ✨ **AI/Gemini Integration**: Smart content suggestions
- 🔍 **Semantic Search**: AI-powered discovery
- 🕸️ **Mind-Node Network**: Visual connections
- 👥 **Real-time Collaboration**: Multi-user support
- 📱 **Mobile Responsive**: Touch-optimized
- ✏️ **Drawing Tool**: Freehand sketching
- 📊 **Layout Containers**: Structured organization

## 📄 License

MIT License

---

**Note**: This is V1 focusing on core functionality. The architecture supports planned V2 features.
