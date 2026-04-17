import React from 'react';
import { motion } from 'framer-motion';
import { Server, Layout, Database, Sparkles, Cpu, Shield } from 'lucide-react';

const TechStack = () => {
  return (
    <section id="architecture" className="py-32 bg-bg relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
             <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-stone-950 uppercase italic">
              System <br />
              <span className="text-accent">Architecture.</span>
            </h2>
            <p className="text-stone-500 text-lg font-medium">Built with a deterministic, scalable stack to ensure data integrity and grounded AI insights.</p>
          </div>
          <div className="flex gap-4">
             <div className="px-6 py-3 bg-white border border-border rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                Production Ready
             </div>
             <div className="px-6 py-3 bg-white border border-border rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-stone-950">
                V2.8-Flash
             </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              title: "Edge Storage", 
              desc: "Neon Postgres for high-performance serverless relational storage.",
              icon: Database,
              color: "text-orange-500"
            },
            { 
              title: "Graph Engine", 
              desc: "FastAPI & Neo4j driving the high-density relationship mapping.",
              icon: Cpu,
              color: "text-blue-500"
            },
            { 
              title: "AI Core", 
              desc: "Neural agents providing hallucination-free contextual insights.",
              icon: Sparkles,
              color: "text-accent"
            },
            { 
              title: "Interaction", 
              desc: "React & React Flow for real-time visual schema navigation.",
              icon: Layout,
              color: "text-purple-500"
            }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-border p-8 rounded-3xl hover:bg-stone-50 transition-colors group"
            >
              <div className={`mb-6 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                <item.icon size={32} />
              </div>
              <h3 className="text-lg font-bold mb-3 text-stone-950 uppercase tracking-tight">{item.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TechStack;
