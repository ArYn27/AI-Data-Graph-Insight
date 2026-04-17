import React, { useState } from 'react';
import { Database, ChevronRight, Sparkles, GitFork, Loader2, MessageSquare, Code } from 'lucide-react';
import { apiService } from '../../services/api';

const QueryRunner = () => {
  const [question, setQuestion] = useState('How many total orders are in the database?');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('impact');

  const handleRunQuery = async () => {
    if (!question.trim()) return;
    setIsLoading(true);
    setResult(null);
    try {
      const data = await apiService.submitQuery(question);
      setResult(data);
    } catch (error) {
      console.error('Error running query:', error);
      alert('Failed to execute query. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="flex justify-between items-center text-stone-900">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900">AI Data Explorer</h2>
            <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded font-bold uppercase tracking-widest border border-accent/20">NL-to-Insight</span>
          </div>
          <p className="text-stone-500 text-sm">Ask questions in natural language to query your graph database.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-panel border border-border px-4 py-2 rounded-xl flex items-center gap-6 text-sm shadow-sm">
             <div className="flex items-center gap-2 text-orange-600 font-bold">
               <Database size={16} />
               <span>Active Neo4j Graph</span>
               <ChevronRight size={14} className="rotate-90 text-stone-400" />
             </div>
          </div>
          <button 
            className="btn-primary flex items-center gap-2 h-[46px] px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleRunQuery}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {isLoading ? 'Processing...' : 'Analyze & Run'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-6 min-h-[500px]">
        {/* Editor Side */}
        <div className="flex-[1.5] flex flex-col gap-6">
           <div className="flex-1 bg-stone-50 border border-border rounded-2xl p-6 font-mono text-sm relative overflow-hidden group shadow-inner">
              <div className="absolute top-4 left-4 text-stone-400 font-bold uppercase tracking-widest text-[10px]">Natural Language Question</div>
              <textarea 
                className="w-full h-full bg-transparent border-none outline-none text-stone-800 resize-none pt-10 scroll-hide leading-relaxed text-lg"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. List all customers who live in Sao Paulo and have at least 2 orders."
                spellCheck="false"
              />
              <div className="absolute inset-0 pointer-events-none border border-accent/0 group-focus-within:border-accent/30 transition-all rounded-2xl" />
           </div>
           
           <div className="flex-1 bg-panel border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm overflow-y-auto max-h-[300px]">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <Database size={14} /> Result Set
              </div>
              {result ? (
                <div className="space-y-4">
                  <div className="bg-bg p-4 rounded-xl border border-border/50 text-stone-800 text-sm leading-relaxed shadow-inner">
                    <span className="font-bold text-accent mb-2 block uppercase text-[10px]">AI Answer:</span>
                    {result.answer}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-stone-50 border-b border-border">
                          {result.raw_data && result.raw_data[0] && Object.keys(result.raw_data[0]).map(key => (
                            <th key={key} className="p-3 font-bold text-stone-500 uppercase tracking-widest">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.raw_data && result.raw_data.map((row, i) => (
                          <tr key={i} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                            {Object.values(row).map((val, j) => (
                              <td key={j} className="p-3 text-stone-700">{typeof val === 'object' ? JSON.stringify(val) : String(val)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-stone-400 gap-4 opacity-30 italic">
                  <Database size={32} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Ready for Analysis</span>
                </div>
              )}
           </div>
        </div>

        {/* Impact Analysis Side */}
        <div className="flex-1 bg-panel border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm">
           <div className="flex border-b border-border">
              {['impact', 'query', 'execution'].map((tab) => (
                <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'text-accent border-b-2 border-accent bg-accent/5' : 'text-stone-400 hover:text-stone-900'}`}
                >
                  {tab === 'impact' ? 'AI Logic' : tab === 'query' ? 'Generated Cypher' : 'Telemetry'}
                </button>
              ))}
           </div>

           <div className="p-8 flex-1 flex flex-col">
              {result && activeTab === 'query' ? (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-4">Neural Translation</h3>
                  <div className="bg-stone-900 text-accent/80 p-6 rounded-2xl font-mono text-xs leading-relaxed shadow-lg border border-white/5 overflow-x-auto">
                    {result.generated_query}
                  </div>
                </div>
              ) : result && activeTab === 'impact' ? (
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-4">Graph Reasoning</h3>
                  <div className="flex items-start gap-4 p-4 bg-accent/5 rounded-2xl border border-accent/10">
                    <Sparkles className="text-accent shrink-0" size={20} />
                    <p className="text-stone-600 text-sm leading-relaxed">
                      The AI identified the relevant entities and relationships in your graph schema to construct a precise traversal path.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                   <Code size={48} className="text-stone-300" />
                   <div>
                      <p className="text-sm font-bold text-stone-900 mb-1 uppercase tracking-widest italic">Waiting for Insights</p>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Execute query to see backend logic</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default QueryRunner;
