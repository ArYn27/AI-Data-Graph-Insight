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
  Database
} from 'lucide-react';

const QualityCard = ({ title, value, status, type }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h4 className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1">{title}</h4>
        <div className="text-sm font-semibold text-zinc-300">{type}</div>
      </div>
      <div className={status === 'pass' ? 'text-accent' : 'text-orange-400'}>
        <CheckCircle2 size={16} />
      </div>
    </div>
    
    <div className="flex items-end justify-between">
      <div>
        <div className="text-xl font-bold mb-2">{value}</div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Completeness</div>
      </div>
      <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: value }}
          className={`h-full ${status === 'pass' ? 'bg-accent' : 'bg-orange-400'}`}
        />
      </div>
    </div>
    
    <div className="mt-4 pt-4 border-top border-zinc-800 flex justify-between items-center text-[10px]">
       <div className="flex gap-4">
          <div><span className="text-zinc-500">UNIQUENESS</span> <span className="text-white ml-2">100.0%</span></div>
          {type === 'INTEGER' && <div><span className="text-zinc-500">MEAN VALUE</span> <span className="text-accent ml-2">35,137.475</span></div>}
       </div>
    </div>
  </div>
);

const DataQuality = () => {
  const [selectedTable, setSelectedTable] = useState('olist_customers_dataset');
  const [running, setRunning] = useState(false);

  const handleRunAudit = () => {
    setRunning(true);
    setTimeout(() => setRunning(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold">Data Quality Audit</h2>
          <p className="text-zinc-500 text-sm">Analyze completeness, uniqueness, and statistical health.</p>
        </div>
        <button 
          onClick={handleRunAudit}
          disabled={running}
          className="btn btn-primary text-sm py-2 px-6 flex items-center gap-2"
        >
          {running ? <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" /> : <Sparkles size={18} />}
          Run Quality Audit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 flex gap-4">
          <div className="flex-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Database Source</label>
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center gap-3">
              <Database size={18} className="text-orange-400" />
              <span className="text-sm font-semibold">Demo eCommerce Database (Neon)</span>
            </div>
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Schema Table</label>
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors">
              <span className="text-sm font-semibold">{selectedTable}</span>
              <ChevronRight size={18} className="text-zinc-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4">
           <div className="p-3 bg-emerald-500/20 rounded-xl text-accent">
              <TableIcon size={24} />
           </div>
           <div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Records</div>
              <div className="text-2xl font-bold">99441</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QualityCard title="customer_id" value="100.0%" type="TEXT" status="pass" />
        <QualityCard title="customer_unique_id" value="100.0%" type="TEXT" status="pass" />
        <QualityCard title="customer_zip_code_prefix" value="100.0%" type="INTEGER" status="pass" />
        <QualityCard title="customer_city" value="100.0%" type="TEXT" status="pass" />
        <QualityCard title="customer_state" value="100.0%" type="TEXT" status="pass" />
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-accent" />
          <h3 className="font-bold">AI Data Health Insights</h3>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
          I've analyzed the <span className="text-white font-mono">{selectedTable}</span>. 
          The overall record health is excellent. I detected a potential skew in 
          <span className="text-white font-mono ml-1">customer_state</span> where 42% of 
          customers originate from 'SP' (São Paulo). Uniqueness for 
          <span className="text-white font-mono ml-1">customer_id</span> is verified at 100%.
        </p>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-zinc-800 rounded-full text-[10px] font-bold text-zinc-400">#HighSkew</span>
           <span className="px-3 py-1 bg-zinc-800 rounded-full text-[10px] font-bold text-zinc-400">#PerfectUnique</span>
           <span className="px-3 py-1 bg-zinc-800 rounded-full text-[10px] font-bold text-zinc-400">#E-commerceStandard</span>
        </div>
      </div>
    </div>
  );
};

export default DataQuality;
