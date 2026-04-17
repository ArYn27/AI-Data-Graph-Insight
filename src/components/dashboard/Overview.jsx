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
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="data-card"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg bg-zinc-800 border border-zinc-700 ${colorClass || 'text-accent'}`}>
        <Icon size={20} />
      </div>
      <div className="text-zinc-500 hover:text-white cursor-pointer transition-colors">
        <ArrowRight size={16} />
      </div>
    </div>
    <span className="card-label">{label}</span>
    <div className="card-value">{value}</div>
    <div className={`card-subtext ${subtext?.includes('!') ? 'warning' : ''}`}>{subtext}</div>
  </motion.div>
);

const QuickAction = ({ title, desc, icon: Icon, path }) => (
  <motion.div 
    whileHover={{ y: -4, borderColor: 'rgba(11, 221, 117, 0.4)' }}
    className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl cursor-pointer group transition-all"
  >
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-xl bg-zinc-800 text-zinc-400 group-hover:text-accent group-hover:bg-accent/10 transition-colors">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-zinc-500 text-sm">{desc}</p>
      </div>
    </div>
  </motion.div>
);

const Overview = () => {
  return (
    <div className="space-y-12">
      {/* Stats Grid */}
      <section>
        <div className="dashboard-grid">
          <StatCard 
            label="Active Sources" 
            value="1" 
            subtext="Auto-sync enabled" 
            icon={Database} 
          />
          <StatCard 
            label="Sync Health" 
            value="100%" 
            subtext="All systems healthy" 
            icon={Activity} 
            colorClass="text-emerald-400"
          />
          <StatCard 
            label="AI Enrichment" 
            value="Ready" 
            subtext="Groq Llama-3 active" 
            icon={Cpu} 
            colorClass="text-blue-400"
          />
          <StatCard 
            label="Performance" 
            value="42ms" 
            subtext="Average Latency" 
            icon={Zap} 
            colorClass="text-yellow-400"
          />
        </div>
      </section>

      {/* Functional Areas */}
      <section>
        <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Functional Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickAction 
            title="Explore Schema"
            desc="Browse tables and AI-generated documentation."
            icon={Search}
          />
          <QuickAction 
            title="Quality Audit"
            desc="Check for nulls, uniqueness, and data health."
            icon={ShieldCheck}
          />
          <QuickAction 
            title="Data Lineage"
            desc="Visualize how your data flows across tables."
            icon={GitFork}
          />
          <QuickAction 
            title="Query Runner"
            desc="Execute SQL and view live results."
            icon={Terminal}
          />
        </div>
      </section>

      {/* Connected Sources */}
      <section>
         <div className="flex justify-between items-center mb-6">
           <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Connected Sources</h2>
           <button className="text-accent text-sm hover:underline">View All</button>
         </div>
         
         <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl p-8 text-center">
            <p className="text-zinc-500 mb-4">No other databases connected yet.</p>
            <button className="btn btn-secondary py-2 px-4 text-sm">Connect Now</button>
         </div>
      </section>
    </div>
  );
};

export default Overview;
