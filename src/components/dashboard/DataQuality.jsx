import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart3, 
  Table as TableIcon,
  ChevronRight,
  Sparkles,
  Database,
  Zap,
  LayoutGrid
} from 'lucide-react';

const QualityCard = ({ title, type, completeness, uniqueness, mean, status }) => (
  <div className="bg-panel border border-border p-6 rounded-2xl space-y-6 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-bold text-sm mb-1 tracking-tight text-stone-900">{title}</h4>
        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{type}</span>
      </div>
      <div className={status === 'success' ? 'text-emerald-600' : 'text-orange-600'}>
        {status === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[9px] font-bold text-stone-500 uppercase tracking-[0.15em]">Completeness</span>
        <span className="text-xs font-bold text-stone-900">{completeness}%</span>
      </div>
      <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200/50">
        <div 
          className={`h-full transition-all duration-1000 ${status === 'success' ? 'bg-emerald-500 shadow-sm' : 'bg-orange-500 shadow-sm'}`}
          style={{ width: `${completeness}%` }}
        />
      </div>
    </div>

    <div className="flex justify-between pt-2 border-t border-border/30">
      <div>
        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Uniqueness</span>
        <span className="text-sm font-bold tracking-tight text-stone-900">{uniqueness}%</span>
      </div>
      <div className="text-right">
        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Mean Value</span>
        <span className="text-sm font-bold tracking-tight text-accent">{mean}</span>
      </div>
    </div>
  </div>
);

const DataQuality = () => {
  const [selectedDb] = useState('Demo eCommerce Database (Neon)');
  const [results] = useState([
    { title: 'geolocation_zip_code_prefix', type: 'INTEGER', completeness: 100, uniqueness: 100, mean: '42,852.04', status: 'success' },
    { title: 'geolocation_lat', type: 'NUMERIC', completeness: 93.2, uniqueness: 5.0, mean: '-23.12', status: 'warning' },
    { title: 'geolocation_lng', type: 'NUMERIC', completeness: 93.2, uniqueness: 5.7, mean: '-46.032', status: 'warning' },
    { title: 'geolocation_city', type: 'TEXT', completeness: 93.2, uniqueness: 31.0, mean: '-', status: 'warning' },
    { title: 'geolocation_state', type: 'TEXT', completeness: 93.2, uniqueness: 0.1, mean: '-', status: 'warning' },
  ]);

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-bold mb-2 tracking-tight text-stone-900">Data Quality Audit</h2>
        <p className="text-stone-500 text-lg">Analyze completeness, uniqueness, and statistical health.</p>
      </header>

      <div className="flex flex-wrap gap-4 items-end bg-panel border border-border p-6 rounded-2xl shadow-sm">
        <div className="flex-1 min-w-[240px]">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 block">Database Source</label>
          <div className="bg-stone-50 border border-border p-3 rounded-xl flex justify-between items-center text-sm font-medium cursor-pointer hover:border-accent/40 transition-all">
             <div className="flex items-center gap-3">
                <Database size={16} className="text-orange-600" />
                <span className="text-stone-900">{selectedDb}</span>
             </div>
             <ChevronRight size={16} className="rotate-90 text-stone-400" />
          </div>
        </div>
        <div className="flex-1 min-w-[240px]">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 block">Schema Table</label>
          <div className="bg-stone-50 border border-border p-3 rounded-xl flex justify-between items-center text-sm font-medium cursor-pointer hover:border-accent/40 transition-all">
             <span className="text-stone-900">geolocation_unique</span>
             <ChevronRight size={16} className="rotate-90 text-stone-400" />
          </div>
        </div>
        <button className="btn-primary flex items-center gap-2 h-[46px] px-8">
           <Zap size={18} />
           Run Quality Audit
        </button>
      </div>

      <div className="bg-panel border border-border p-4 rounded-2xl w-fit flex items-center gap-4 px-6 mb-8 shadow-sm">
         <div className="p-2 bg-accent/10 rounded-lg text-accent">
            <LayoutGrid size={20} />
         </div>
         <div>
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block">Total Records</span>
            <span className="text-xl font-bold tracking-tight text-stone-900">19177</span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((col) => (
          <QualityCard key={col.title} {...col} />
        ))}
      </div>
    </div>
  );
};

export default DataQuality;
