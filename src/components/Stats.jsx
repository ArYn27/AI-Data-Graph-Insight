import React from 'react';
import { motion } from 'framer-motion';

const Stats = () => {
  const stats = [
    { label: "Data Points Mapped", value: "2M+" },
    { label: "Average Latency", value: "42ms" },
    { label: "Hallucination Rate", value: "0%" },
    { label: "Sync Uptime", value: "99.9%" }
  ];

  return (
    <section className="py-24 bg-stone-50 border-y border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { label: 'Latency', value: '< 42ms' },
            { label: 'Accuracy', value: '100%' },
            { label: 'Schemas', value: '500+' },
            { label: 'Uptime', value: '99.9%' }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="text-4xl md:text-6xl font-black text-stone-900 mb-2 tracking-tighter uppercase italic">{stat.value}</div>
              <div className="text-stone-400 font-bold uppercase tracking-[0.4em] text-[10px]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
