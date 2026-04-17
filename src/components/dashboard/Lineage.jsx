import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { apiService } from '../../services/api';
import { Loader2, RefreshCw, AlertTriangle, Database } from 'lucide-react';

const Lineage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchema = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getStructuredSchema();
      
      if (data && data.error) {
        setError(data.error);
        return;
      }

      if (data && data.nodes) {
        // Generate Nodes in a linear grid layout
        const nodesPerRow = 4;
        const newNodes = (data.nodes || []).map((node, index) => {
          const col = index % nodesPerRow;
          const row = Math.floor(index / nodesPerRow);
          return {
            id: node.name,
            type: 'default',
            data: { label: (
              <div className="font-bold text-xs p-1">
                <div className="text-accent mb-2 flex items-center gap-1 uppercase tracking-tight">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                   {node.name}
                </div>
                <div className="text-[9px] text-stone-500 space-y-1">
                  {node.properties.slice(0, 5).map(prop => (
                    <div key={prop}>{prop}</div>
                  ))}
                  {node.properties.length > 5 && <div className="text-accent/50">+{node.properties.length - 5} more...</div>}
                </div>
              </div>
            ) },
            position: { 
              x: col * 250, 
              y: row * 250 
            },
            style: { width: 180, background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', color: '#000000', shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }
          };
        });

        // Generate Edges
        const newEdges = (data.relationships || []).map((rel, index) => ({
          id: `e-${index}`,
          source: rel.source,
          target: rel.target,
          label: rel.type,
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, color: '#0BDD75' },
          style: { stroke: '#0BDD75' },
          labelStyle: { fill: '#0BDD75', fontWeight: 700, fontSize: 8 },
          labelBgStyle: { fill: '#111111', fillOpacity: 0.8 },
          labelBgPadding: [2, 4],
          labelBgBorderRadius: 2
        }));

        setNodes(newNodes);
        setEdges(newEdges);
      } else {
        setNodes([]);
        setEdges([]);
      }
    } catch (error) {
      console.error('Error fetching schema for lineage:', error);
      setError("Failed to reach backend API. Check if the server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchema();
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="space-y-10 flex flex-col h-full min-h-[700px]">
      <header className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-bold mb-2 tracking-tight text-stone-900">Graph Lineage</h2>
          <p className="text-stone-500 text-lg">Visualizing active Neo4j relationships and schema mapping.</p>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={fetchSchema}
             className="p-2 transition-transform hover:rotate-180 duration-500 text-stone-400 hover:text-accent"
             title="Reload Graph"
           >
             <RefreshCw size={20} />
           </button>
           <div className="bg-panel border border-border px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-stone-500 shadow-sm">
             {nodes.length} Nodes
           </div>
           <div className="bg-panel border border-border px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-accent shadow-sm">
             {edges.length} Relationships
           </div>
        </div>
      </header>

      <div className="flex-1 bg-panel/30 border border-border rounded-[2.5rem] overflow-hidden relative min-h-[600px] shadow-inner">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-50/50 backdrop-blur-sm z-50 gap-4">
             <Loader2 size={40} className="animate-spin text-accent" />
             <span className="font-bold uppercase tracking-widest text-xs text-stone-400">Mapping Knowledge Graph...</span>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 gap-6 p-10 text-center">
             <div className="p-6 bg-red-50 rounded-full border border-red-100">
                <AlertTriangle size={48} className="text-red-500" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">Neo4j Connection Error</h3>
                <p className="text-stone-500 max-w-md mx-auto text-sm leading-relaxed px-4">
                   {error}
                </p>
                <p className="mt-4 text-[10px] text-stone-400 font-black uppercase tracking-widest">
                   Verify your Neo4j Aura URI and credentials
                </p>
             </div>
             <button 
               onClick={fetchSchema}
               className="btn-primary px-10 py-3"
             >
               Retry Connection
             </button>
          </div>
        ) : nodes.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 gap-6 p-10 text-center opacity-40">
             <Database size={64} className="text-stone-300" />
             <div>
                <h3 className="text-xl font-bold text-stone-900 mb-1 italic">Empty Graph Universe</h3>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Connect a database to populate the lineage</p>
             </div>
          </div>
        ) : null}
        
        <div style={{ width: '100%', height: '700px' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Background color="#f1f1f1" gap={20} size={1} />
            <Controls className="bg-white border border-border" />
            <MiniMap 
              style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px' }} 
              nodeColor="#eee"
              maskColor="rgba(255,255,255,0.7)"
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default Lineage;
