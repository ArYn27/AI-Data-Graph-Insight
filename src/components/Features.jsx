import React from 'react';
import { motion } from 'framer-motion';
import { Network, Database, LayoutTemplate, Brain, Search, ShieldCheck } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Network size={24} />,
      title: "Neural Schema Translation",
      desc: "Connect directly via URI to extract tables, columns, and relationships automatically with zero manual tagging."
    },
    {
      icon: <Database size={24} />,
      title: "Neon Postgres Native",
      desc: "Deep integration with Neon Postgres for real-time metadata syncing and high-performance relational mapping."
    },
    {
      icon: <LayoutTemplate size={24} />,
      title: "Knowledge Graph Engine",
      desc: "Advanced transformation logic converts tabular structures into intuitive Neo4j graph nodes and properties."
    },
    {
      icon: <Brain size={24} />,
      title: "Deterministic AI Layer",
      desc: "Contextual, logic-grounded explanations of your data architecture. No hallucinations, just pure structured facts."
    },
    {
      icon: <Search size={24} />,
      title: "Dynamic Flow Analysis",
      desc: "Explore every branch of your database architecture with an interactive React Flow canvas built for speed."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Enterprise Data Trust",
      desc: "Every automated insight is derived from verified structural constraints, ensuring absolute data integrity."
    }
  ];

  return (
    <section id="features" className="py-32 bg-bg overflow-hidden relative">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-24">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-stone-950 uppercase italic">
            Complete Structural <br />
            <span className="text-accent">Intelligence.</span>
          </h2>
          <p className="text-stone-500 text-lg md:text-xl font-medium max-w-xl">
            From extraction to deterministic intelligence — every layer of your database, visualized and explained.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className="group bg-white border border-border p-10 rounded-3xl hover:border-accent hover:shadow-xl hover:shadow-accent/5 transition-all duration-500"
            >
              <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform border border-border/50">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black mb-4 tracking-tight text-stone-950 group-hover:text-accent transition-colors uppercase">{feature.title}</h3>
              <p className="text-stone-500 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
