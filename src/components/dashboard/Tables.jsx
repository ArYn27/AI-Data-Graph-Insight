import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ExternalLink, ChevronRight, Table as TableIcon, PlusCircle, ShieldCheck, Database } from 'lucide-react';
import { apiService } from '../../services/api';

const TablesExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [tables] = useState([
    { name: 'Demo eCommerce Database', type: 'POSTGRESQL', provider: 'NEON', status: 'Encrypted', iconColor: 'text-orange-600' },
  ]);

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold mb-2 tracking-tight text-stone-900">Data Sources</h2>
        <p className="text-stone-500 text-lg">Manage your connected enterprise databases.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
        <input 
          type="text" 
          placeholder="Search by name or provider..." 
          className="w-full bg-white border border-border rounded-xl py-3 pl-12 pr-4 focus:border-accent outline-none text-sm font-medium transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div 
            key={table.name}
            className="bg-panel border border-border hover:border-accent/40 rounded-3xl p-8 flex flex-col transition-all group shadow-sm hover:shadow-md"
          >
            <div className="mb-8 p-3 bg-bg w-fit rounded-2xl shadow-inner border border-border/50">
               <Database size={28} className={table.iconColor} />
            </div>
            
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-bold text-xl tracking-tight text-stone-900">{table.name}</h3>
                <span className="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">Demo</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                <span className="px-2 py-1 bg-bg rounded border border-border">{table.type} ({table.provider})</span>
                <span className="text-accent flex items-center gap-1.5 px-2 py-1 bg-accent/5 rounded border border-accent/10">
                  <ShieldCheck size={14} /> {table.status}
                </span>
              </div>
            </div>

            <button className="w-full bg-stone-100 border border-border text-stone-900 font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-stone-200 transition-all text-sm group-hover:border-stone-300 cursor-pointer">
              Explore Schema <ExternalLink size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablesExplorer;
