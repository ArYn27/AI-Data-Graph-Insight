import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ShieldAlert, CheckCircle2, Copy, Download, Trash2, Database, Code } from 'lucide-react';
import { apiService } from '../../services/api';

const QueryRunner = () => {
  const [query, setQuery] = useState('SELECT * FROM olist_customers_dataset LIMIT 10;');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [securityWarning, setSecurityWarning] = useState(null);

  const validateQuery = (q) => {
    const forbidden = [
      'update', 'delete', 'drop', 'insert', 'create', 'alter', 'truncate', 
      'set', 'remove', 'merge', 'grant', 'revoke'
    ];
    
    const words = q.toLowerCase().split(/\s+/);
    const found = words.find(w => forbidden.includes(w));
    
    if (found) {
      return `Operation "${found.toUpperCase()}" is restricted. Only read-only queries are allowed in this environment.`;
    }
    return null;
  };

  const handleRunQuery = async () => {
    setError(null);
    setSecurityWarning(null);
    
    const warning = validateQuery(query);
    if (warning) {
      setSecurityWarning(warning);
      return;
    }

    setLoading(true);
    try {
      // Use the submitQuery logic which translates natural language or handles direct queries if backend supports
      // Since it's a "Query Runner", we might want to pass it as a special "question"
      const response = await apiService.submitQuery(query);
      if (response.success) {
        setResults(response.raw_data);
      } else {
        setError("Failed to execute query.");
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setError(null);
    setSecurityWarning(null);
  };

  return (
    <div className="query-container">
      <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Database size={16} />
            <select className="bg-transparent border-none text-zinc-300 text-sm font-semibold focus:outline-none">
              <option>Demo Ecommerce (Neon)</option>
              <option>Neo4j Graph (Internal)</option>
            </select>
          </div>
          <div className="w-[1px] h-4 bg-zinc-800"></div>
          <div className="flex items-center gap-2 text-zinc-400">
            <Code size={16} />
            <span className="text-zinc-300 text-sm font-semibold lowercase">SQL / Cypher</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-lg font-bold text-sm hover:bg-accent-hover transition-all disabled:opacity-50"
            onClick={handleRunQuery}
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
            ) : (
              <Play size={16} fill="black" />
            )}
            Run Query
          </button>
          <button className="p-2 text-zinc-500 hover:text-white" onClick={clearResults}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="relative">
        <textarea 
          className="query-editor w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          spellCheck="false"
        />
        {securityWarning && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-start gap-3 text-red-400 text-sm"
          >
            <ShieldAlert size={18} className="shrink-0" />
            <p>{securityWarning}</p>
          </motion.div>
        )}
      </div>

      <div className="results-section flex-1 min-h-[300px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Query Results</h3>
          {results && (
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold hover:bg-zinc-800">
                <Copy size={14} /> Copy JSON
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold hover:bg-zinc-800">
                <Download size={14} /> CSV
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-4">
            <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full" />
            <p className="text-sm font-medium">Executing on cluster...</p>
          </div>
        ) : error ? (
          <div className="h-full border border-red-500/20 bg-red-500/5 rounded-xl p-8 flex flex-col items-center justify-center text-red-400 text-center gap-2">
             <ShieldAlert size={32} />
             <h4 className="font-bold">Execution Error</h4>
             <p className="text-sm max-w-md">{error}</p>
          </div>
        ) : results ? (
          <div className="results-table-container">
            <table className="results-table">
              <thead>
                <tr>
                  {Object.keys(results[0] || {}).map(key => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j}>{typeof val === 'object' ? JSON.stringify(val) : String(val)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-full border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-500 gap-3">
             <div className="p-4 bg-zinc-900 rounded-full">
                <CheckCircle2 size={32} className="text-zinc-700" />
             </div>
             <p className="text-sm">Ready to execute query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryRunner;
