import React, { useState } from 'react';
import { Database, Link2, ArrowRight, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { apiService } from '../../services/api';

const DB_PRESETS = [
  {
    id: 'postgres',
    name: 'PostgreSQL',
    placeholder: 'postgresql://user:pass@host:5432/dbname',
    color: '#336791',
    bg: '#EBF3FB',
    icon: (
      <svg viewBox="0 0 256 280" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M255.808 158.957c-1.697-10.93-7.755-19.488-17.96-25.418l-.507-.296-.065-.028c1.17-6.246 1.73-12.73 1.672-19.287-.235-24.867-9.255-47.222-25.37-62.936-15.97-15.563-38.075-23.885-63.987-24.074h-.338c-14.956-.1-29.21 3.015-41.95 9.13a103.5 103.5 0 0 0-7.255 3.856c-8.225-3.68-17.247-5.6-26.59-5.6-51.13 0-71.85 53.14-70.15 87.35-.005.04 0 .077.002.115v.017c.077.876.202 1.745.354 2.614 0 .008.003.017.004.025-.527.393-1.05.793-1.56 1.21-9.86 8.01-14.823 19.27-13.5 30.9 1.78 15.72 13.46 28.23 30.09 33.01 6.94 1.99 14.1 2.86 21.24 2.86 3.5 0 7-.25 10.45-.7 10.49 14.1 24.81 24.66 41.25 30.26 1.8.63 3.62 1.18 5.46 1.67-.258 1.965-.39 3.987-.39 6.04 0 17.615 9.96 32.78 24.68 40.38a46.2 46.2 0 0 0 21.32 5.21c8.16 0 15.86-2.12 22.56-5.88a39.62 39.62 0 0 0 12.61-11.08 81.14 81.14 0 0 0 9.4.56c8.37 0 16.4-1.33 23.92-3.78 19.7-6.4 34.88-21.14 41.28-39.89 3.87-11.432 4.253-22.74 1.073-32.012l.001.001Z" fill="#336791"/>
        <path d="M213.02 114.927c-.23-24.12-8.9-45.69-24.38-60.79-15.34-14.96-36.82-22.9-62.09-23.08h-.32c-24.77 0-46.97 8.37-62.6 23.58-.527.513-1.043 1.038-1.55 1.57l-.54.08c-6.08-2.577-12.62-3.96-19.35-3.96-46.18 0-65.6 50.07-63.96 82.48.07.77.18 1.536.32 2.29a30.72 30.72 0 0 0-5.58 3.51c-8.36 6.81-12.4 16.76-11.32 27.02 1.5 13.19 11.29 23.7 25.26 27.73 12.35 3.54 25.24 2.81 35.74-1.16l.08.09c1.15 1.46 2.35 2.89 3.6 4.28 10.98 12.32 25.78 21.35 42.68 25.97 1.82.511 3.65.96 5.5 1.35-.28 2.13-.43 4.3-.43 6.5 0 23.18 14.77 43.01 35.29 50.09a55.5 55.5 0 0 0 18.45 3.16c20.14 0 37.78-10.57 47.78-26.44 6.07.71 12.3 1.07 18.66 1.07 27.06 0 50.18-8.52 64.1-24.93 8.66-10.17 13.38-23.13 13.38-37.38 0-3.55-.36-7.06-1.06-10.51-.17-5.27-3.52-16.04-17.66-40.88Z" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'mysql',
    name: 'MySQL',
    placeholder: 'mysql+pymysql://user:pass@host:3306/dbname',
    color: '#4479A1',
    bg: '#EBF3FB',
    icon: (
      <svg viewBox="0 0 128 96" className="w-8 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 72h10V40l20 32h10V24H40v32L20 24H10v48zM68 72h10V48l16 24h10V24H94v24L78 24H68v48zM4 88h120v4H4z" fill="#4479A1"/>
      </svg>
    ),
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    placeholder: 'snowflake://user:pass@account/dbname/schema',
    color: '#29B5E8',
    bg: '#E8F8FD',
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
        <line x1="50" y1="5" x2="50" y2="95" stroke="#29B5E8" strokeWidth="10" strokeLinecap="round"/>
        <line x1="5" y1="50" x2="95" y2="50" stroke="#29B5E8" strokeWidth="10" strokeLinecap="round"/>
        <line x1="15" y1="15" x2="85" y2="85" stroke="#29B5E8" strokeWidth="10" strokeLinecap="round"/>
        <line x1="85" y1="15" x2="15" y2="85" stroke="#29B5E8" strokeWidth="10" strokeLinecap="round"/>
        <line x1="35" y1="5" x2="50" y2="20" stroke="#29B5E8" strokeWidth="7" strokeLinecap="round"/>
        <line x1="65" y1="5" x2="50" y2="20" stroke="#29B5E8" strokeWidth="7" strokeLinecap="round"/>
        <line x1="35" y1="95" x2="50" y2="80" stroke="#29B5E8" strokeWidth="7" strokeLinecap="round"/>
        <line x1="65" y1="95" x2="50" y2="80" stroke="#29B5E8" strokeWidth="7" strokeLinecap="round"/>
        <line x1="5" y1="35" x2="20" y2="50" stroke="#29B5E8" strokeWidth="7" strokeLinecap="round"/>
        <line x1="5" y1="65" x2="20" y2="50" stroke="#29B5E8" strokeWidth="7" strokeLinecap="round"/>
        <line x1="95" y1="35" x2="80" y2="50" stroke="#29B5E8" strokeWidth="7" strokeLinecap="round"/>
        <line x1="95" y1="65" x2="80" y2="50" stroke="#29B5E8" strokeWidth="7" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'cassandra',
    name: 'Cassandra',
    placeholder: 'cassandra://user:pass@host:9042/keyspace',
    color: '#1287B1',
    bg: '#E8F4FB',
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="30" rx="40" ry="12" fill="none" stroke="#1287B1" strokeWidth="7"/>
        <ellipse cx="50" cy="50" rx="40" ry="12" fill="none" stroke="#1287B1" strokeWidth="7"/>
        <ellipse cx="50" cy="70" rx="40" ry="12" fill="none" stroke="#1287B1" strokeWidth="7"/>
        <line x1="10" y1="30" x2="10" y2="70" stroke="#1287B1" strokeWidth="7"/>
        <line x1="90" y1="30" x2="90" y2="70" stroke="#1287B1" strokeWidth="7"/>
      </svg>
    ),
  },
];

const ConnectDB = ({ onClose }) => {
  const [uri, setUri] = useState('');
  const [selectedDb, setSelectedDb] = useState(null);
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [extractedSchema, setExtractedSchema] = useState(null);

  const handleSelectDb = (db) => {
    setSelectedDb(db);
    setUri(db.placeholder);
  };

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!uri) return;
    setStep(2);
    setError(null);
    try {
      const schema = await apiService.extractSQLSchema(uri);
      setExtractedSchema(schema);
      setStep(3);
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
          className="absolute top-8 right-8 text-stone-400 hover:text-stone-900 transition-colors z-10"
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
                <p className="text-stone-500 font-medium">Select your database type and provide a connection URI.</p>
              </div>

              {/* DB Type Selector */}
              <div className="grid grid-cols-4 gap-3">
                {DB_PRESETS.map((db) => (
                  <button
                    key={db.id}
                    type="button"
                    onClick={() => handleSelectDb(db)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:shadow-md ${
                      selectedDb?.id === db.id
                        ? 'border-accent bg-accent/5 shadow-md'
                        : 'border-border bg-stone-50 hover:border-stone-200'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: db.bg }}
                    >
                      {db.icon}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${
                      selectedDb?.id === db.id ? 'text-accent' : 'text-stone-500'
                    }`}>
                      {db.name}
                    </span>
                  </button>
                ))}
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <div className="text-sm font-bold">{error}</div>
                </div>
              )}

              <form onSubmit={handleExtract} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-stone-400">Connection URI</label>
                  <div className="relative group">
                    <Link2 size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-accent transition-colors" />
                    <input
                      type="text"
                      placeholder={selectedDb?.placeholder || 'postgresql://user:pass@host:port/db'}
                      className="w-full bg-stone-50 border border-border rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all font-mono text-sm"
                      value={uri}
                      onChange={(e) => setUri(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest px-2">
                    Supports PostgreSQL, MySQL, Snowflake, Cassandra, and SQLite
                  </p>
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
              <button onClick={onClose} className="btn-primary px-12 py-4">
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
