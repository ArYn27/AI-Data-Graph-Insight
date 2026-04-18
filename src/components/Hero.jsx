import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import RotatingEarth from './RotatingEarth';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-40 pb-20 overflow-hidden min-h-[900px] flex items-center">
      {/* Background Rotating Earth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square flex items-center justify-center -z-10 pointer-events-none">
        <RotatingEarth width={800} height={800} />
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,_rgba(188,158,130,0.1)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter leading-[0.9] text-stone-950">
              Understand your data <br />
              <span className="text-accent italic">at the speed of thought.</span>
            </h1>
            <p className="text-stone- stone-500 text-xl md:text-2xl leading-relaxed mb-12 max-w-2xl mx-auto font-medium">
              The explainable intelligence layer for enterprise databases. 
              Visualize relationships, audit quality, and query schemas with AI accuracy.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button 
              className="group relative px-10 py-5 bg-accent text-black font-black rounded-2xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(188,158,130,0.4)]"
              onClick={() => navigate('/auth')}
            >
              <span className="flex items-center gap-3">
                Initialize Connection <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button 
              className="px-10 py-5 bg-stone-100/50 backdrop-blur-md border border-border text-stone-900 font-bold rounded-2xl hover:bg-stone-200 transition-all flex items-center gap-3"
              onClick={() => navigate('/dashboard/overview')}
            >
              <Play size={20} fill="currentColor" /> View Demo
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
