import React from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Workflow as WorkflowIcon } from 'lucide-react';

const Workflow = () => {
  const steps = [
    { step: '01', title: 'Neural Connect', desc: 'Securely link your Neon Postgres via URI. We instantly map structural metadata.', icon: Database },
    { step: '02', title: 'Graph Synthesis', desc: 'Schemas are automatically transcoded into Neo4j graph relationships.', icon: WorkflowIcon },
    { step: '03', title: 'Insight Logic', desc: 'Explore visual lineage and receive AI generated data health audits.', icon: Search }
  ];

  return (
    <section id="how-it-works" className="py-32 bg-stone-50 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-stone-900 uppercase italic">
            Engineered for <span className="text-accent underline decoration-stone-200">Scale.</span>
          </h2>
          <p className="text-stone-500 text-lg font-medium">A three-step deterministic bridge from raw data to structural intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Lines (Desktop) */}
          <div className="hidden md:block absolute top-[60px] left-0 right-0 h-[2px] bg-stone-200 z-0" />
          
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative z-10 text-center"
            >
              <div className="w-24 h-24 bg-white border-4 border-stone-100 rounded-3xl flex items-center justify-center text-accent mx-auto mb-10 shadow-lg group hover:scale-110 transition-transform">
                <step.icon size={32} />
              </div>
              
              <div className="space-y-4">
                <div className="text-[10px] font-bold text-accent uppercase tracking-[0.4em]">{step.step}</div>
                <h3 className="text-2xl font-black text-stone-900 tracking-tight uppercase italic">{step.title}</h3>
                <p className="text-stone-500 text-sm font-medium leading-relaxed max-w-[240px] mx-auto">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Workflow;
