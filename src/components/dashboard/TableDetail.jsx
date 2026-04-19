import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Table as TableIcon, 
  Database, 
  GitFork, 
  Columns, 
  Hash,
  ArrowRight,
  ShieldCheck,
  LucideLayout,
  List,
  LayoutGrid,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { apiService } from '../../services/api';
import { toSlug, fromSlug } from '../../utils/slugs';

const TableDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [table, setTable] = useState(null);
  const [relationships, setRelationships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data Preview State
  const [activeTab, setActiveTab] = useState('schema'); 
  const [tableData, setTableData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [dataError, setDataError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 50;

  useEffect(() => {
    const fetchTableDetail = async () => {
      try {
        const data = await apiService.getStructuredSchema();
        if (data) {
          const allTableNames = data.nodes.map(n => n.name);
          const actualName = fromSlug(slug, allTableNames);
          const tableNode = data.nodes.find(n => n.name === actualName);
          
          if (tableNode) {
            setTable(tableNode);
            const tableRels = data.relationships.filter(r => 
              r.source === actualName || r.target === actualName
            );
            setRelationships(tableRels);
          }
        }
      } catch (error) {
        console.error('Error fetching table detail:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTableDetail();
  }, [slug]);

  const fetchActualData = async (currentOffset = 0, append = false) => {
    if (!table) return;
    if (currentOffset === 0) {
      setIsDataLoading(true);
    } else {
      setIsFetchingMore(true);
    }
    setDataError(null);
    try {
      const result = await apiService.getTableData(table.name, PAGE_SIZE, currentOffset);
      if (result && result.rows) {
        setTableData(prev => append ? [...prev, ...result.rows] : result.rows);
        setOffset(currentOffset + result.rows.length);
        setHasMore(result.has_more);
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
      setDataError(error.response?.data?.detail || "Failed to fetch table data. Make sure the database is connected.");
    } finally {
      setIsDataLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'data' && table && tableData.length === 0) {
      fetchActualData(0, false);
    }
  }, [activeTab, table]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-stone-400 gap-4">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        <span className="font-bold uppercase tracking-widest text-[10px]">Deconstructing Table Metadata...</span>
      </div>
    );
  }

  if (!table) {
    return (
      <div className="text-center py-20 px-6">
        <h2 className="text-2xl font-bold text-stone-900 mb-4">Table Not Found</h2>
        <p className="text-stone-500 mb-8">The table you are looking for does not exist in the current schema.</p>
        <button onClick={() => navigate('/dashboard/tables')} className="btn-primary">
          Back to Explorer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/dashboard/tables')}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors font-bold text-sm"
        >
          <ArrowLeft size={18} /> Back to Explorer
        </button>

        <div className="bg-panel border border-border p-1 rounded-xl flex gap-1 shadow-sm">
          <button 
             onClick={() => setActiveTab('schema')}
             className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'schema' ? 'bg-accent text-white' : 'text-stone-500 hover:bg-stone-50'}`}
          >
            <List size={14} /> Schema Metadata
          </button>
          <button 
             onClick={() => setActiveTab('data')}
             className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'data' ? 'bg-accent text-white' : 'text-stone-500 hover:bg-stone-50'}`}
          >
            <LayoutGrid size={14} /> Data Preview
          </button>
        </div>
      </div>

      <header className="flex justify-between items-start border-b border-border pb-10">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-accent/10 rounded-3xl border border-accent/20 shadow-sm">
             <TableIcon size={32} className="text-accent" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold tracking-tight text-stone-950">{table.name}</h1>
              <span className="px-3 py-1 bg-stone-100 text-stone-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                SQL Entity
              </span>
            </div>
            <p className="text-stone-500 text-lg">
              {activeTab === 'schema' ? 'Detailed metadata and relational mapping.' : 'Live data snapshot from the source database.'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-panel border border-border px-6 py-4 rounded-2xl text-center shadow-sm">
             <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Columns</div>
             <div className="text-2xl font-bold text-stone-950">{table.properties.length}</div>
           </div>
           <div className="bg-panel border border-border px-6 py-4 rounded-2xl text-center shadow-sm">
             <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Relations</div>
             <div className="text-2xl font-bold text-stone-950">{relationships.length}</div>
           </div>
        </div>
      </header>

      {activeTab === 'schema' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Columns List */}
          <section className="bg-panel border border-border rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col">
            <div className="px-10 py-8 border-b border-border bg-stone-50/50 flex items-center justify-between">
              <h3 className="font-bold text-lg text-stone-950 flex items-center gap-2">
                <Columns size={20} className="text-stone-400" />
                Column Definitions
              </h3>
              <span className="text-[10px] bg-white border border-border px-3 py-1 rounded-full font-bold text-stone-500 uppercase tracking-widest">
                Schema Sync Ready
              </span>
            </div>
            <div className="p-4 overflow-y-auto max-h-[600px] scroll-hide">
              {table.properties.map((col, i) => (
                <div key={col} className="flex items-center justify-between p-4 hover:bg-stone-50 rounded-2xl transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 flex items-center justify-center font-mono text-[10px] text-stone-400 bg-stone-100 rounded-lg">
                       {i + 1}
                     </div>
                     <span className="font-bold text-stone-800 break-all">{col}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-accent px-2 py-0.5 bg-accent/5 rounded border border-accent/10 uppercase">
                      Indexed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Relationships List */}
          <section className="space-y-10">
             <div className="bg-panel border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
               <div className="px-10 py-8 border-b border-border bg-stone-50/50">
                 <h3 className="font-bold text-lg text-stone-950 flex items-center gap-2">
                   <GitFork size={20} className="text-stone-400" />
                   Graph Dependencies
                 </h3>
               </div>
               <div className="p-8 space-y-4">
                  {relationships.length > 0 ? relationships.map((rel, i) => (
                    <div key={i} className="p-6 bg-bg border border-border/50 rounded-3xl relative overflow-hidden group hover:border-accent/30 transition-all">
                       <div className="flex items-center justify-between relative z-10">
                          <div className="flex flex-col gap-1">
                             <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Source</span>
                             <span className="font-bold text-sm text-stone-900 break-all">{rel.source}</span>
                             <span className="text-[10px] font-bold text-accent mt-1 italic">{rel.from_col}</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 px-4 text-stone-300">
                             <span className="text-[9px] font-black uppercase tracking-widest">{rel.type}</span>
                             <ArrowRight size={20} className="text-accent" />
                          </div>
                          <div className="flex flex-col gap-1 text-right">
                             <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Target</span>
                             <span className="font-bold text-sm text-stone-900 break-all">{rel.target}</span>
                             <span className="text-[10px] font-bold text-accent mt-1 italic">{rel.to_col}</span>
                          </div>
                       </div>
                    </div>
                  )) : (
                    <div className="py-20 text-center text-stone-400">
                      <p className="text-sm font-medium">No direct graph relationships found.</p>
                    </div>
                  )}
               </div>
             </div>

             <div className="p-8 bg-stone-900 rounded-[2rem] text-white overflow-hidden relative shadow-xl">
                <div className="relative z-10 space-y-4">
                   <h4 className="text-accent font-black text-xs uppercase tracking-widest">Neural Insight</h4>
                   <p className="text-stone-400 text-sm leading-relaxed">
                     This table contains <span className="text-white font-bold">{table.properties.length} distinct columns</span> and is part of a cluster with <span className="text-white font-bold">{relationships.length} active relationships</span>. AI reasoning is currently indexing these paths for optimal discovery.
                   </p>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-10">
                  <Database size={120} />
                </div>
             </div>
          </section>
        </div>
      ) : (
        /* Data Preview Tab */
        <section className="bg-panel border border-border rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col min-h-[500px]">
           <div className="px-10 py-8 border-b border-border bg-stone-50/50 flex items-center justify-between">
              <h3 className="font-bold text-lg text-stone-950 flex items-center gap-2">
                <LayoutGrid size={20} className="text-stone-400" />
                Data Preview
              </h3>
              <div className="flex items-center gap-4">
                 {isDataLoading && <Loader2 size={16} className="animate-spin text-accent" />}
                 {tableData.length > 0 && (
                   <span className="text-[10px] bg-white border border-border px-3 py-1 rounded-full font-bold text-stone-500 uppercase tracking-widest">
                     {tableData.length} Rows Loaded
                   </span>
                 )}
                 {!isDataLoading && hasMore && (
                   <span className="text-[10px] bg-stone-100 border border-border px-3 py-1 rounded-full font-bold text-stone-400 uppercase tracking-widest">
                     More Available
                   </span>
                 )}
              </div>
           </div>
           
           <div className="p-0 overflow-x-auto">
             {isDataLoading && tableData.length === 0 ? (
               <div className="py-40 flex flex-col items-center justify-center text-stone-400 gap-4">
                  <Loader2 size={32} className="animate-spin text-accent" />
                  <span className="text-xs font-bold uppercase tracking-widest">Streaming Data...</span>
               </div>
             ) : dataError ? (
               <div className="py-40 flex flex-col items-center justify-center text-stone-400 gap-4 px-10 text-center">
                  <AlertCircle size={40} className="text-red-500" />
                  <div>
                    <p className="font-bold text-stone-900 mb-1">Connection Error</p>
                    <p className="text-xs">{dataError}</p>
                  </div>
                  <button 
                    onClick={() => fetchActualData(0, false)}
                    className="mt-4 px-6 py-2 bg-stone-100 border border-border rounded-xl text-xs font-bold hover:bg-stone-200 transition-colors"
                  >
                    Retry Connection
                  </button>
               </div>
             ) : tableData.length > 0 ? (
               <div className="min-w-full inline-block align-middle">
                 <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-stone-50/50 sticky top-0">
                        <tr>
                          <th className="px-4 py-4 text-left text-[10px] font-black text-stone-400 uppercase tracking-[0.15em] border-r border-border w-12">#</th>
                          {Object.keys(tableData[0]).map((key) => (
                            <th key={key} className="px-6 py-4 text-left text-[10px] font-black text-stone-400 uppercase tracking-[0.15em] border-r border-border last:border-r-0">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-border">
                        {tableData.map((row, i) => (
                          <tr key={i} className="hover:bg-stone-50 transition-colors">
                            <td className="px-4 py-4 text-[10px] font-mono text-stone-300 border-r border-border">{i + 1}</td>
                            {Object.values(row).map((val, j) => (
                              <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-stone-600 border-r border-border last:border-r-0 max-w-xs truncate">
                                {val === null ? <span className="italic text-stone-300">null</span> : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>

                 {/* Load More Footer */}
                 <div className="px-10 py-6 border-t border-border bg-stone-50/50 flex items-center justify-between">
                   <span className="text-xs text-stone-400 font-medium">
                     Showing <span className="font-bold text-stone-700">{tableData.length}</span> rows
                     {!hasMore && " — all records loaded"}
                   </span>
                   {hasMore ? (
                     <button
                       onClick={() => fetchActualData(offset, true)}
                       disabled={isFetchingMore}
                       className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       {isFetchingMore ? (
                         <><Loader2 size={14} className="animate-spin" /> Fetching...</>
                       ) : (
                         <>Load {PAGE_SIZE} More Rows <ArrowRight size={14} /></>
                       )}
                     </button>
                   ) : (
                     <span className="text-[10px] font-black uppercase tracking-widest text-accent px-4 py-2 bg-accent/5 border border-accent/20 rounded-xl">
                       ✓ All Records Loaded
                     </span>
                   )}
                 </div>
               </div>
             ) : (
               <div className="py-40 flex flex-col items-center justify-center text-stone-400 gap-4">
                  <Database size={32} className="opacity-20" />
                  <span className="text-xs font-bold uppercase tracking-widest">No data available for this table.</span>
               </div>
             )}
           </div>
        </section>
      )}
    </div>
  );
};

export default TableDetail;
