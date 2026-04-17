import React, { useState } from 'react';
import { Database, ChevronRight, Sparkles, GitFork } from 'lucide-react';

const QueryRunner = () => {
  const [query, setQuery] = useState(`SELECT 
    oi.order_id,
    oi.product_id,
    oi.seller_id,
    oi.price,
    s.seller_city,
    op.payment_type
FROM olist_order_items_dataset oi
JOIN olist_sellers_dataset s ON oi.seller_id = s.seller_id
LEFT JOIN olist_order_payments_dataset op ON oi.order_id = op.order_id
LIMIT 10;`);
  const [activeTab, setActiveTab] = useState('impact');

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="flex justify-between items-center text-stone-900">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900">SQL Lab</h2>
            <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded font-bold uppercase tracking-widest border border-accent/20">AI Enhanced</span>
          </div>
          <p className="text-stone-500 text-sm">Run queries with automated graph impact analysis.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-panel border border-border px-4 py-2 rounded-xl flex items-center gap-6 text-sm shadow-sm">
             <div className="flex items-center gap-2 text-orange-600 font-bold">
               <Database size={16} />
               <span>Demo eCommerce DB</span>
               <ChevronRight size={14} className="rotate-90 text-stone-400" />
             </div>
          </div>
          <button className="btn-primary flex items-center gap-2 h-[46px] px-8">
            <Sparkles size={18} />
            Analyze & Run
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-6 min-h-[500px]">
        {/* Editor Side */}
        <div className="flex-[1.5] flex flex-col gap-6">
           <div className="flex-1 bg-stone-50 border border-border rounded-2xl p-6 font-mono text-sm relative overflow-hidden group shadow-inner">
              <div className="absolute top-4 left-4 text-stone-400 font-bold uppercase tracking-widest text-[10px]">Editor</div>
              <textarea 
                className="w-full h-full bg-transparent border-none outline-none text-stone-800 resize-none pt-10 scroll-hide leading-relaxed"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                spellCheck="false"
              />
              <div className="absolute inset-0 pointer-events-none border border-accent/0 group-focus-within:border-accent/30 transition-all rounded-2xl" />
           </div>
           
           <div className="h-48 bg-panel border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-stone-400 gap-4 shadow-sm">
              <Database size={32} className="opacity-10" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Result Set Empty</span>
           </div>
        </div>

        {/* Impact Analysis Side */}
        <div className="flex-1 bg-panel border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm">
           <div className="flex border-b border-border">
              {['impact', 'quality', 'execution'].map((tab) => (
                <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'text-accent border-b-2 border-accent bg-accent/5' : 'text-stone-400 hover:text-stone-900'}`}
                >
                  {tab === 'impact' ? 'Impact Analysis' : tab === 'quality' ? 'Data Quality' : 'Execution'}
                </button>
              ))}
           </div>

           <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-8">Graph Relationship Depth</h3>
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                 <GitFork size={48} className="text-stone-300" />
                 <div>
                    <p className="text-sm font-bold text-stone-900 mb-1 uppercase tracking-widest">Execute query to see</p>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Graph Relationship Depth</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default QueryRunner;
