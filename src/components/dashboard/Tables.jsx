import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  ChevronRight, 
  Table as TableIcon, 
  PlusCircle, 
  ShieldCheck, 
  Database, 
  Loader2, 
  RefreshCw,
  Brain,
  Sparkles,
  GitFork
} from 'lucide-react';
import { apiService } from '../../services/api';
import { toSlug } from '../../utils/slugs';

const TablesExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tables, setTables] = useState([]);
  const [connectionInfo, setConnectionInfo] = useState(null);
  const [documentation, setDocumentation] = useState(null);
  const [activeTab, setActiveTab] = useState('schema'); // 'schema' or 'docs'
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [schemaData, connData, docsData] = await Promise.all([
        apiService.getStructuredSchema(),
        apiService.getConnectionInfo(),
        apiService.getDocumentation()
      ]);

      if (schemaData && schemaData.nodes) {
        const formattedTables = schemaData.nodes.map(node => ({
          name: node.name,
          type: 'SQL_TABLE',
          count: node.count,
          properties: node.properties,
          iconColor: 'text-accent'
        }));
        setTables(formattedTables);
      }
      
      setConnectionInfo(connData);
      if (docsData && Object.keys(docsData).length > 0) {
        setDocumentation(docsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateDocs = async () => {
    setIsGenerating(true);
    try {
      const docs = await apiService.generateDocumentation();
      setDocumentation(docs);
    } catch (error) {
      console.error('Error generating documentation:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to generate documentation.';
      alert(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredTables = tables.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderSchemaExplorer = () => (
    <div className="space-y-12">
      {/* DB Instance Card */}
      {!isLoading && connectionInfo && connectionInfo.connected && (
        <section className="bg-white border border-border rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center text-accent border border-accent/20">
                <Database size={36} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl font-black text-stone-900 uppercase tracking-tight">{connectionInfo.dialect} Instance</h3>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100 rounded">Active Bridge</span>
                </div>
                <p className="text-stone-400 font-mono text-xs text-balance">{connectionInfo.uri}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="bg-stone-50 border border-border px-6 py-3 rounded-2xl">
                 <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 text-center">Tables</p>
                 <p className="text-xl font-black text-stone-900 text-center">{tables.length}</p>
               </div>
               <button 
                 onClick={fetchData}
                 className="btn-secondary h-[58px] px-8 hover:bg-stone-100"
               >
                 <RefreshCw size={18} />
                 Sync Schema
               </button>
            </div>
          </div>

          <div className="pt-10 border-t border-border/60">
            <div className="flex items-center justify-between mb-8">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Filter tables in this instance..." 
                  className="w-full bg-stone-50 border border-border rounded-xl py-3 pl-12 pr-4 focus:border-accent outline-none text-sm font-medium transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTables.map((table) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={table.name}
                  className="bg-stone-50/50 border border-border/80 hover:border-accent/40 rounded-3xl p-6 flex flex-col transition-all group hover:bg-white hover:shadow-lg hover:shadow-accent/5"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-2.5 bg-white w-fit rounded-xl shadow-sm border border-border/50">
                      <TableIcon size={20} className={table.iconColor} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">{table.count} COLUMNS</span>
                  </div>
                  
                  <h4 className="font-bold text-base tracking-tight text-stone-900 mb-4 truncate">{table.name}</h4>
                  
                  <div className="flex flex-wrap gap-1.5 mb-8">
                    {table.properties.slice(0, 2).map(prop => (
                      <span key={prop} className="text-[8px] font-black uppercase tracking-widest text-stone-500 px-2 py-1 bg-white rounded border border-border/50">
                        {prop}
                      </span>
                    ))}
                    {table.properties.length > 2 && (
                      <span className="text-[8px] font-black uppercase tracking-widest text-accent px-2 py-1">
                        +{table.properties.length - 2}
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={() => navigate(`/dashboard/tables/${toSlug(table.name)}`)}
                    className="w-full bg-white border border-border text-stone-900 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-stone-950 hover:text-white transition-all text-xs uppercase tracking-widest cursor-pointer mt-auto"
                  >
                    Explore <ChevronRight size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );

  const renderDocumentation = () => (
    <div className="space-y-10">
      {!documentation && !isGenerating && (
        <div className="bg-white border border-dashed border-border rounded-[2.5rem] p-20 text-center space-y-8">
          <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-accent">
            <Brain size={40} />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-stone-900 mb-2 italic uppercase tracking-tight">Generate Neural Specs</h3>
            <p className="text-stone-500">Let our AI engine analyze your schema to produce high-fidelity technical documentation including overviews, field analysis, and relationship mappings.</p>
          </div>
          <button 
            onClick={handleGenerateDocs}
            className="btn-primary"
          >
            <Sparkles size={18} />
            Generate AI Documentation
          </button>
        </div>
      )}

      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-40 text-stone-400 gap-6">
          <Loader2 size={48} className="animate-spin text-accent" />
          <div className="text-center">
            <span className="font-black uppercase tracking-widest text-xs block mb-2">Neural Analysis in Progress...</span>
            <p className="text-stone-500 text-sm max-w-xs">AI is mapping your structural intelligence and generating technical narratives.</p>
          </div>
        </div>
      )}

      {documentation && !isGenerating && (
        <div className="space-y-12">
          {Object.entries(documentation).map(([tableName, docs]) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={tableName} 
              className="bg-white border border-border rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-stone-50 border-b border-border p-8 flex items-center gap-4 text-stone-950 font-black italic uppercase">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-accent border border-border shadow-sm">
                   <TableIcon size={20} />
                 </div>
                 {tableName}
              </div>
              
              <div className="p-10 space-y-10">
                <section>
                  <h4 className="text-[10px] font-black text-stone-950 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Overview
                  </h4>
                  <p className="text-stone-600 leading-relaxed font-medium italic">
                    {docs.overview}
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-6 bg-stone-50 rounded-2xl border border-border">
                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">Fields</p>
                    <p className="text-xl font-black text-stone-950">{docs.schema_summary?.total_fields || 0}</p>
                  </div>
                  <div className="p-6 bg-stone-50 rounded-2xl border border-border overflow-hidden">
                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">Primary Key</p>
                    <p className="text-xs font-bold text-stone-950 font-mono truncate">{docs.schema_summary?.pk || 'None'}</p>
                  </div>
                  <div className="p-6 bg-stone-50 rounded-2xl border border-border overflow-hidden">
                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">Foreign Key</p>
                    <p className="text-xs font-bold text-stone-950 font-mono truncate">{docs.schema_summary?.fk || 'None'}</p>
                  </div>
                  <div className="p-6 bg-stone-50 rounded-2xl border border-border">
                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">Relations</p>
                    <p className="text-xl font-black text-stone-950">{docs.schema_summary?.relationships_count || 0}</p>
                  </div>
                </div>

                <section>
                  <h4 className="text-[10px] font-black text-stone-950 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Neural Field Analysis
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="pb-4 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Field</th>
                          <th className="pb-4 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Type</th>
                          <th className="pb-4 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {docs.fields?.map((field, fIdx) => (
                          <tr key={fIdx} className="group transition-colors hover:bg-stone-50/20">
                            <td className="py-5 pr-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-stone-950 font-mono text-xs">{field.name}</span>
                                {field.key_type && (
                                  <span className="px-1 py-0.5 bg-accent/10 text-accent text-[7px] font-black uppercase rounded border border-accent/20">
                                    {field.key_type}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-5 pr-4">
                              <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest bg-stone-100 px-2 py-1 rounded">
                                {field.type}
                              </span>
                            </td>
                            <td className="py-5">
                              <p className="text-stone-500 text-sm font-medium leading-relaxed italic">{field.description}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {docs.relationships?.length > 0 && (
                  <section>
                    <h4 className="text-[10px] font-black text-stone-950 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                      Relationships
                    </h4>
                    <div className="space-y-3">
                      {docs.relationships.map((rel, rIdx) => (
                        <div key={rIdx} className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl border border-border text-xs font-bold text-stone-700 font-mono italic">
                           <GitFork size={14} className="text-accent shrink-0" />
                           {rel}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-3xl font-bold mb-2 tracking-tight text-stone-900 italic uppercase">Structural Intelligence</h2>
          <p className="text-stone-500 text-lg">Unified metadata management and AI documentation.</p>
        </div>
        
        <div className="flex bg-stone-100 p-1 rounded-2xl border border-border">
          {[
            { id: 'schema', label: 'Schema Explorer', icon: TableIcon },
            { id: 'docs', label: 'AI Documentation', icon: Brain }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer
                ${activeTab === tab.id 
                  ? 'bg-white text-stone-900 shadow-sm border border-border' 
                  : 'text-stone-400 hover:text-stone-600'
                }
              `}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40 text-stone-400 gap-4">
          <Loader2 size={40} className="animate-spin text-accent" />
          <span className="font-bold uppercase tracking-widest text-xs tracking-[0.3em]">Neural Registry...</span>
        </div>
      ) : (
        <div className="dashboard-view-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'schema' ? renderSchemaExplorer() : renderDocumentation()}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {!isLoading && activeTab === 'schema' && (!connectionInfo || !connectionInfo.connected) && (
        <div className="bg-white border border-dashed border-border rounded-[2.5rem] p-20 text-center space-y-6">
          <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-300">
            <Database size={40} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2 italic uppercase tracking-tight">No Active Bridge</h3>
            <p className="text-stone-500 max-w-sm mx-auto">Connect a SQL database to begin mapping your structural intelligence.</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard/overview')}
            className="btn-primary"
          >
            Go to Bridge Control
          </button>
        </div>
      )}
    </div>
  );
};

export default TablesExplorer;
