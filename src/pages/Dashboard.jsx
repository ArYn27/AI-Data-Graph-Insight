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
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <Database className="text-accent" size={28} />
          <span>DataLens AI</span>
        </div>

        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={`/dashboard/${item.path}`} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-link w-full border-none bg-transparent cursor-pointer" onClick={() => navigate('/')}>
             <PlusCircle size={20} className="text-accent" />
             {sidebarOpen && <span>Connect New DB</span>}
          </button>
          <button className="nav-link w-full border-none bg-transparent cursor-pointer text-red-400" onClick={handleLogout}>
            <LogOut size={20} className="text-red-500" />
            {sidebarOpen && <span className="text-red-500">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Welcome back, Explorer ✨
            </h1>
            <p className="text-zinc-400">
              Your Intelligent Data Dictionary is synced and ready.
            </p>
          </div>
          
          <button className="btn btn-primary flex items-center gap-2">
            <Database size={18} />
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
