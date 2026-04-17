import React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Activity, 
  Cpu, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  GitFork,
  Terminal,
  Search
} from 'lucide-react';

const StatCard = ({ label, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-panel border border-border p-6 rounded-2xl flex flex-col justify-between shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="text-stone-400 font-bold text-[10px] uppercase tracking-widest">{label}</div>
      <div className={colorClass || 'text-accent'}>
        <Icon size={20} />
      </div>
    </div>
    <div>
      <div className="text-3xl font-bold mb-1 tracking-tight text-stone-900">{value}</div>
      <div className="text-stone-500 text-[11px] font-medium">{subtext}</div>
    </div>
  </div>
);

const QuickAction = ({ title, desc, icon: Icon, colorClass }) => (
  <div className="bg-panel border border-border p-6 rounded-2xl hover:bg-stone-50 transition-all group cursor-pointer h-full shadow-sm hover:shadow-md">
    <div className={`w-12 h-12 rounded-xl ${colorClass || 'bg-accent/10 text-accent'} flex items-center justify-center mb-6`}>
      <Icon size={24} />
    </div>
    <h3 className="font-bold text-lg mb-2 text-stone-900">{title}</h3>
    <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const Overview = () => {
  return (
    <div className="flex gap-8 max-w-[1400px]">
      <div className="flex-1 space-y-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard 
            label="Active Sources" 
            value="0" 
            subtext="Auto-sync enabled" 
            icon={Database} 
          />
          <StatCard 
            label="Sync Health" 
            value="100%" 
            subtext="All systems healthy" 
            icon={Activity} 
            colorClass="text-emerald-600"
          />
          <StatCard 
            label="AI Enrichment" 
            value="Ready" 
            subtext="Gemini-2.8 Flash active" 
            icon={Cpu} 
            colorClass="text-blue-600"
          />
          <StatCard 
            label="Performance" 
            value="42ms" 
            subtext="Average Latency" 
            icon={Zap} 
            colorClass="text-purple-600"
          />
        </div>

        {/* Functional Areas */}
        <section>
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] mb-8">Functional Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickAction 
              title="Explore Schema"
              desc="Browse tables and AI-generated documentation."
              icon={Search}
              colorClass="bg-blue-500/10 text-blue-600"
            />
            <QuickAction 
              title="Quality Audit"
              desc="Check for nulls, uniqueness, and data health."
              icon={ShieldCheck}
              colorClass="bg-orange-500/10 text-orange-600"
            />
            <QuickAction 
              title="Data Lineage"
              desc="Visualize how your data flows across tables."
              icon={GitFork}
              colorClass="bg-purple-500/10 text-purple-600"
            />
            <QuickAction 
              title="Query Runner"
              desc="Execute SQL and view live results."
              icon={Terminal}
              colorClass="bg-stone-500/10 text-stone-600"
            />
          </div>
        </section>
      </div>

      {/* Connected Sources Sidebar */}
      <div className="w-80 space-y-6">
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em]">Connected Sources</h2>
        <div className="bg-panel border border-border p-10 rounded-3xl text-center flex flex-col items-center justify-center min-h-[300px] shadow-sm">
           <p className="text-stone-500 text-sm mb-6 max-w-[180px]">No databases connected yet.</p>
           <button className="bg-stone-100 border border-border text-stone-900 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-stone-200 transition-colors">
             Connect Now
           </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
