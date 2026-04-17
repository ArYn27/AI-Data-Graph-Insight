import React from 'react';
import { Database, Globe, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-50 pt-20 pb-10 border-t border-stone-200">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-6 text-stone-950 font-black text-xl tracking-tighter uppercase italic">
              <Database className="text-orange-700" size={24} />
              <span>DataLens <span className="text-orange-700">AI</span></span>
            </div>
            <p className="text-stone-600 text-sm font-medium leading-relaxed">
              Advancing deterministic data intelligence through graph-based modeling and explainable AI insights.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm">
            <div className="space-y-4">
              <h4 className="font-bold text-stone-900 uppercase tracking-widest text-xs">Product</h4>
              <nav className="flex flex-col gap-2 text-stone-600">
                <a href="#features" className="hover:text-orange-700 transition-colors">Features</a>
                <a href="#architecture" className="hover:text-orange-700 transition-colors">Architecture</a>
                <a href="/dashboard/overview" className="hover:text-orange-700 transition-colors">View Demo</a>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-stone-900 uppercase tracking-widest text-xs">Dev Resources</h4>
              <nav className="flex flex-col gap-2 text-stone-600">
                <a href="https://github.com/ArYn27/AI-Data-Graph-Insight" target="_blank" className="hover:text-orange-700 transition-colors">Documentation</a>
                <a href="https://github.com/ArYn27/AI-Data-Graph-Insight" target="_blank" className="hover:text-orange-700 transition-colors">API Reference</a>
                <a href="https://github.com/ArYn27/AI-Data-Graph-Insight" target="_blank" className="hover:text-orange-700 transition-colors">GitHub</a>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-stone-900 uppercase tracking-widest text-xs">Connect</h4>
              <div className="flex gap-4 text-stone-600">
                <Globe size={18} className="hover:text-orange-700 cursor-pointer" />
                <ArrowRight size={18} className="hover:text-orange-700 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50 gap-4">
          <div className="text-stone-400 text-[10px] uppercase font-bold tracking-[0.2em]">
            &copy; {new Date().getFullYear()} InsightGraph Neural Systems. All rights reserved.
          </div>
          <div className="flex gap-8 text-[10px] uppercase font-bold tracking-[0.2em] text-stone-400">
            <a href="#" className="hover:text-stone-600">Privacy Policy</a>
            <a href="#" className="hover:text-stone-600">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
