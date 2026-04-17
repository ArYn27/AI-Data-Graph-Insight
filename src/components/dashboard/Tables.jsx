import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ExternalLink, ChevronRight, Table as TableIcon, PlusCircle, ShieldCheck } from 'lucide-react';
import { apiService } from '../../services/api';

const TablesExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Mock data representing what we might get from apiService.getSchema()
  // In a real app, we would parse the schema string or use a structured endpoint
  const [tables, setTables] = useState([
    { name: 'olist_customers_dataset', type: 'POSTGRESQL', status: 'Healthy', columns: 5 },
    { name: 'olist_orders_dataset', type: 'POSTGRESQL', status: 'Healthy', columns: 8 },
    { name: 'olist_products_dataset', type: 'POSTGRESQL', status: 'Healthy', columns: 9 },
    { name: 'olist_order_items_dataset', type: 'POSTGRESQL', status: 'Healthy', columns: 7 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Data Sources</h2>
        <button className="btn btn-primary text-sm py-2 flex items-center gap-2">
          <PlusCircle size={16} /> Add Connection
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input 
          type="text" 
          placeholder="Search by name or provider..." 
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 focus:border-accent outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tables.map((table, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={table.name}
            className="group bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 hover:bg-zinc-800/40 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-800 rounded-xl text-yellow-500">
                  <TableIcon size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{table.name}</h3>
                    <span className="text-[10px] bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Demo</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      {table.type} (NEON)
                    </span>
                    <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                    <span className="text-accent flex items-center gap-1">
                      <ShieldCheck size={12} /> Encrypted
                    </span>
                  </div>
                </div>
              </div>
              
              <button className="btn btn-secondary py-2 px-4 text-xs font-bold flex items-center gap-2 group-hover:bg-zinc-700">
                Explore Schema <ExternalLink size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TablesExplorer;
