import React, { useCallback, useState } from 'react';
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

const initialNodes = [
  {
    id: '1',
    type: 'default',
    data: { label: (
      <div className="font-bold text-xs p-1">
        <div className="text-accent mb-2 flex items-center gap-1">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
           OLIST_ORDER_ITEMS_DATASET
        </div>
        <div className="text-[10px] text-zinc-400 space-y-1">
          <div>order_id <span className="text-zinc-600">PK</span></div>
          <div className="text-accent/60">order_item_id</div>
          <div className="text-accent/60">product_id <span className="text-blue-400">FK</span></div>
          <div className="text-accent/60">seller_id <span className="text-blue-400">FK</span></div>
          <div>shipping_limit_date</div>
          <div>price</div>
          <div>freight_value</div>
        </div>
      </div>
    ) },
    position: { x: 100, y: 100 },
    style: { width: 220, background: '#111111', border: '1px solid #27272A', borderRadius: '12px' }
  },
  {
    id: '2',
    type: 'default',
    data: { label: (
      <div className="font-bold text-xs p-1">
        <div className="text-accent mb-2 flex items-center gap-1">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
           OLIST_SELLERS_DATASET
        </div>
        <div className="text-[10px] text-zinc-400 space-y-1">
          <div>seller_id <span className="text-zinc-600">PK</span></div>
          <div>seller_zip_code_prefix</div>
          <div>seller_city</div>
          <div>seller_state</div>
        </div>
      </div>
    ) },
    position: { x: 500, y: 50 },
    style: { width: 200, background: '#111111', border: '1px solid #27272A', borderRadius: '12px' }
  },
  {
    id: '3',
    type: 'default',
    data: { label: (
      <div className="font-bold text-xs p-1">
        <div className="text-accent mb-2 flex items-center gap-1">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
           OLIST_CUSTOMERS_DATASET
        </div>
        <div className="text-[10px] text-zinc-400 space-y-1">
          <div>customer_id <span className="text-zinc-600">PK</span></div>
          <div>customer_unique_id</div>
          <div>customer_zip_code_prefix</div>
          <div>customer_city</div>
          <div>customer_state</div>
        </div>
      </div>
    ) },
    position: { x: 500, y: 300 },
    style: { width: 200, background: '#111111', border: '1px solid #27272A', borderRadius: '12px' }
  },
  {
    id: '4',
    type: 'default',
    data: { label: (
      <div className="font-bold text-xs p-1">
        <div className="text-accent mb-2 flex items-center gap-1">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
           GEOLOCATION_BRIDGE
        </div>
        <div className="text-[10px] text-zinc-400 space-y-1">
          <div>zip_code_prefix <span className="text-zinc-600">PK</span></div>
          <div>geolocation_lat</div>
          <div>geolocation_lng</div>
          <div>geolocation_city</div>
          <div>geolocation_state</div>
        </div>
      </div>
    ) },
    position: { x: 850, y: 150 },
    style: { width: 220, background: '#111111', border: '1px solid #27272A', borderRadius: '12px' }
  }
];

const initialEdges = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    animated: true, 
    label: 'seller_id',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#0BDD75' },
    style: { stroke: '#0BDD75' }
  },
  { 
    id: 'e2-4', 
    source: '2', 
    target: '4', 
    label: 'zip_prefix',
    style: { stroke: '#52525b', strokeDasharray: '5,5' }
  },
  { 
    id: 'e3-4', 
    source: '3', 
    target: '4', 
    label: 'zip_prefix',
    style: { stroke: '#52525b', strokeDasharray: '5,5' }
  }
];

const Lineage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Data Lineage</h2>
          <p className="text-zinc-500 text-sm">Viewing demo database lineage.</p>
        </div>
        <div className="flex gap-2">
           <button className="btn btn-secondary py-1.5 px-3 text-xs">Export PDF</button>
           <button className="btn btn-primary py-1.5 px-3 text-xs">Refresh Graph</button>
        </div>
      </div>

      <div className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden relative min-h-[600px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background color="#1px" gap={20} />
          <Controls />
          <MiniMap 
            style={{ background: '#0a0a0a' }} 
            nodeColor="#111"
            maskColor="rgba(0,0,0,0.5)"
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Lineage;
