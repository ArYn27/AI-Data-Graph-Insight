import React, { useState } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Table, 
  ShieldCheck, 
  GitFork, 
  Terminal, 
  LogOut, 
  Database,
  PlusCircle,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load components
import Overview from '../components/dashboard/Overview';
import TablesExplorer from '../components/dashboard/Tables';
import DataQuality from '../components/dashboard/DataQuality';
import Lineage from '../components/dashboard/Lineage';
import QueryRunner from '../components/dashboard/QueryRunner';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Overview', path: 'overview', icon: LayoutDashboard },
    { name: 'Tables', path: 'tables', icon: Table },
    { name: 'Data Quality', path: 'quality', icon: ShieldCheck },
    { name: 'Lineage', path: 'lineage', icon: GitFork },
    { name: 'Query Runner', path: 'query', icon: Terminal },
  ];

  const handleLogout = () => {
    // Implement logout logic if needed
    navigate('/auth');
  };

  return (
    <div className="flex h-screen bg-bg text-stone-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-border flex flex-col p-6">
        <div className="flex items-center gap-2 mb-12 px-2">
          <Database className="text-accent" size={24} />
          <span className="font-bold text-lg tracking-tight text-stone-950">DataLens AI</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={`/dashboard/${item.path}`} 
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm
                ${isActive ? 'bg-accent text-white shadow-md shadow-accent/20' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'}
              `}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="space-y-4 pt-6 border-t border-border mt-auto">
          <button className="flex items-center gap-3 px-4 py-2 text-accent text-sm font-bold hover:translate-x-1 transition-transform border-none bg-transparent cursor-pointer" onClick={() => navigate('/')}>
             <PlusCircle size={18} />
             <span>Connect New DB</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-2 text-red-600 text-sm font-bold hover:translate-x-1 transition-transform border-none bg-transparent cursor-pointer" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto scroll-hide p-10">
        <header className="flex justify-between items-start mb-12 px-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-stone-950">
              Welcome back, Explorer ✨
            </h1>
            <p className="text-stone-500 text-lg">
              Your Intelligent Data Dictionary is synced and ready.
            </p>
          </div>
          
          <button className="btn-primary flex items-center gap-2">
            <Database size={20} />
            Connect New Database
          </button>
        </header>

        <div className="dashboard-content">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="overview" element={<Overview />} />
              <Route path="tables" element={<TablesExplorer />} />
              <Route path="quality" element={<DataQuality />} />
              <Route path="lineage" element={<Lineage />} />
              <Route path="query" element={<QueryRunner />} />
              <Route path="/" element={<Overview />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
