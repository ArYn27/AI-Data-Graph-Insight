import React from 'react';
import { Server, Layout, Database, Sparkles } from 'lucide-react';

const TechStack = () => {
  return (
    <section className="tech-section">
      <div className="container">
        <div className="section-header">
          <h2>System Architecture</h2>
        </div>
        
        <div className="tech-grid">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Database className="text-accent" size={32} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Database</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Neon Postgres</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Server className="text-accent" size={32} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Backend</h3>
            <p style={{ color: 'var(--text-secondary)' }}>FastAPI, SQLAlchemy, Neo4j</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Sparkles className="text-accent" size={32} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>AI Layer</h3>
            <p style={{ color: 'var(--text-secondary)' }}>LLM API (Grounded)</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Layout className="text-accent" size={32} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Frontend</h3>
            <p style={{ color: 'var(--text-secondary)' }}>React, React Flow</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
