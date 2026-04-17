import React, { useState } from 'react';
import { Database, Link2, ArrowRight, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { apiService } from '../../services/api';

const ConnectDB = ({ onClose }) => {
  const [uri, setUri] = useState('');
  const [step, setStep] = useState(1); // 1: input, 2: extracting, 3: building, 4: success
  const [error, setError] = useState(null);
  const [extractedSchema, setExtractedSchema] = useState(null);

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!uri) return;
    setStep(2);
    setError(null);
    try {
      const schema = await apiService.extractSQLSchema(uri);
      setExtractedSchema(schema);
      setStep(3);
      
      // Automatically build graph after extraction
      await apiService.buildGraph(schema.tables, schema.relationships);
      setStep(4);
    } catch (err) {
      console.error('Connection error:', err);
      setError(err.response?.data?.detail || err.message);
      setStep(1);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-panel border border-border w-full max-w-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-stone-400 hover:text-stone-900 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-12">
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 border border-accent/20">
                  <Database className="text-accent" size={32} />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-stone-950 mb-2">Connect New Database</h2>
                <p className="text-stone-500 font-medium">Initialize a neural bridge to your SQL data source.</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <div className="text-sm font-bold">{error}</div>
                </div>
              )}

              <form onSubmit={handleExtract} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-stone-400">Database URI</label>
                  <div className="relative group">
                    <Link2 size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-accent transition-colors" />
                    <input 
                      type="text" 
                      placeholder="postgresql://user:pass@host:port/db" 
                      className="w-full bg-stone-50 border border-border rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all font-mono text-sm"
                      value={uri}
                      onChange={(e) => setUri(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest px-2">Supports Postgres, MySQL, SQLite, and Snowflake</p>
                </div>

                <button 
                  type="submit" 
                  className="w-full btn-primary flex items-center justify-center gap-3 py-5 text-lg"
                >
                  Neural Indexing <ArrowRight size={20} />
                </button>
              </form>
            </div>
          )}

          {(step === 2 || step === 3) && (
            <div className="py-20 flex flex-col items-center text-center space-y-8">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                <Database className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-stone-950 mb-2">
                  {step === 2 ? 'Deconstructing SQL Schema' : 'Synthesizing Knowledge Graph'}
                </h3>
                <p className="text-stone-500 font-medium animate-pulse">
                  {step === 2 ? 'Analyzing tables, constraints, and relational indices...' : 'Populating Neo4j with neural entity mappings...'}
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="py-12 flex flex-col items-center text-center space-y-8">
              <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20">
                <CheckCircle2 className="text-accent" size={48} />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-stone-950 mb-2">Bridge Established</h3>
                <p className="text-stone-500 font-medium">Your database is now indexed and available for natural language discovery.</p>
              </div>
              <button 
                onClick={onClose}
                className="btn-primary px-12 py-4"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Decorative background accent */}
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
      </div>
    </div>
  );
};

export default ConnectDB;
