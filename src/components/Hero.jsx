import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero container">
      <h1>
        Understand your data <span className="text-accent">instantly.</span>
      </h1>
      <p>
        Explainable intelligence layer for relational databases. Automatically convert schema relationships into interactive knowledge graphs grounded in your data structure.
      </p>
      
      <div className="hero-buttons">
        <button className="btn btn-primary">
          Start Free <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
        </button>
        <button className="btn btn-secondary">
          <Play size={18} style={{ marginRight: '0.5rem' }} /> View Demo
        </button>
      </div>
    </section>
  );
};

export default Hero;
