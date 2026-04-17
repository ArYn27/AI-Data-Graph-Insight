import React from 'react';
import { Link } from 'react-router-dom';
import { Database } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
            <Database size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-stone-950">InsightGraph <span className="text-accent">AI</span></span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          <a href="#features" className="text-sm font-medium text-stone-600 hover:text-accent transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-stone-600 hover:text-accent transition-colors">Workflow</a>
          <a href="#architecture" className="text-sm font-medium text-stone-600 hover:text-accent transition-colors">Architecture</a>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/auth" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors px-4">
            Sign In
          </Link>
          <Link to="/auth" className="btn-primary px-6 py-2.5 text-sm shadow-md shadow-accent/10 whitespace-nowrap">
            Start Building
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
