import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  Activity, 
  Cpu, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  GitFork,
  Terminal,
  Search,
  Loader2
} from 'lucide-react';
import { apiService } from '../../services/api';

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

const QuickAction = ({ title, desc, icon: Icon, colorClass, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-panel border border-border p-6 rounded-2xl hover:bg-stone-50 transition-all group cursor-pointer h-full shadow-sm hover:shadow-md"
  >
    <div className={`w-12 h-12 rounded-xl ${colorClass || 'bg-accent/10 text-accent'} flex items-center justify-center mb-6`}>
      <Icon size={24} />
    </div>
    <h3 className="font-bold text-lg mb-2 text-stone-900">{title}</h3>
    <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const Overview = ({ onConnectClick }) => {
  const [stats, setStats] = useState({ sources: 0, labels: 0, relationships: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.getStructuredSchema();
        if (data && data.error) {
          setError(data.error);
        } else if (data) {
          setStats({
            sources: data.nodes?.length > 0 ? 1 : 0,
            labels: data.nodes?.length || 0,
            relationships: data.relationships?.length || 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError("Could not reach the backend dashboard API.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex gap-8 max-w-[1400px]">
      <div className="flex-1 space-y-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard 
            label="Active Sources" 
            value={error ? "Error" : stats.sources} 
            subtext={error ? "Check connection" : "Auto-sync enabled"} 
            icon={Database} 
            colorClass={error ? "text-red-500" : "text-accent"}
          />
          <StatCard 
            label="Node Labels" 
            value={error ? 0 : stats.labels} 
            subtext="Unique entity types" 
            icon={Activity} 
            colorClass="text-emerald-600"
          />
          <StatCard 
            label="Rel Patterns" 
            value={error ? 0 : stats.relationships} 
            subtext="Graph connections" 
            icon={Zap} 
            colorClass="text-purple-600"
          />
          <StatCard 
            label="AI Enrichment" 
            value={error ? "Paused" : "Active"} 
            subtext={error ? "System locked" : "LLM Reasoning live"} 
            icon={Cpu} 
            colorClass={error ? "text-stone-400" : "text-blue-600"}
          />
        </div>

        {/* Functional Areas */}
        <section>
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] mb-8">Functional Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickAction 
              title="Entity Explorer"
              desc="Browse all graph node labels and their properties."
              icon={Search}
              colorClass="bg-blue-500/10 text-blue-600"
              onClick={() => navigate('/dashboard/tables')}
            />
            <QuickAction 
              title="Graph Lineage"
              desc="Visualize how entities relate across the graph."
              icon={GitFork}
              colorClass="bg-purple-500/10 text-purple-600"
              onClick={() => navigate('/dashboard/lineage')}
            />
            <QuickAction 
              title="AI Explorer"
              desc="Ask natural language questions to discover insights."
              icon={Terminal}
              colorClass="bg-stone-500/10 text-stone-600"
              onClick={() => navigate('/dashboard/query')}
            />
            <QuickAction 
              title="Connect Bridge"
              desc="Import new SQL schemas into your knowledge graph."
              icon={Zap}
              colorClass="bg-accent/10 text-accent"
              onClick={onConnectClick}
            />
          </div>
        </section>
      </div>

      {/* Connected Sources Sidebar */}
      <div className="w-80 space-y-6">
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em]">Graph Status</h2>
        <div className="bg-panel border border-border p-10 rounded-3xl text-center flex flex-col items-center justify-center min-h-[300px] shadow-sm">
           {isLoading ? (
             <div className="flex flex-col items-center gap-4">
               <Loader2 className="animate-spin text-accent" size={32} />
               <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Verifying Bridge...</span>
             </div>
           ) : error ? (
             <div className="space-y-6">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
                  <AlertTriangle className="text-red-500" size={32} />
                </div>
                <div>
                  <p className="text-red-600 font-bold mb-1">Bridge Interrupted</p>
                  <p className="text-stone-500 text-[10px] uppercase font-black tracking-tight leading-tight">Neo4j Connection Failed</p>
                </div>
                <div className="text-[10px] text-stone-400 bg-stone-50 p-3 rounded-lg border border-border text-left overflow-hidden text-ellipsis">
                  {error.substring(0, 100)}...
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full bg-stone-100 border border-border text-stone-900 px-6 py-3 rounded-xl text-xs font-bold hover:bg-stone-200 transition-colors"
                >
                  Reconnect Bridge
                </button>
             </div>
           ) : stats.sources > 0 ? (
             <div className="space-y-6">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto border border-accent/20">
                  <Database className="text-accent" size={32} />
                </div>
                <div>
                  <p className="text-stone-950 font-bold mb-1">Neo4j Database Connected</p>
                  <p className="text-stone-500 text-xs text-emerald-600 font-bold flex items-center justify-center gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Bridge active and healthy
                  </p>
                </div>
                <button 
                  onClick={onConnectClick}
                  className="w-full bg-stone-100 border border-border text-stone-900 px-6 py-3 rounded-xl text-xs font-bold hover:bg-stone-200 transition-colors"
                >
                  Update Connection
                </button>
             </div>
           ) : (
             <>
               <p className="text-stone-500 text-sm mb-6 max-w-[180px]">No databases connected yet.</p>
               <button 
                 onClick={onConnectClick}
                 className="bg-stone-100 border border-border text-stone-900 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-stone-200 transition-colors"
               >
                 Connect Now
               </button>
             </>
           )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
