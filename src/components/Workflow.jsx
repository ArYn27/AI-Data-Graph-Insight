import React from 'react';
import { Database, Search, Workflow as WorkflowIcon } from 'lucide-react';

const Workflow = () => {
  return (
    <section id="how-it-works" className="workflow-section container">
      <div className="section-header" style={{ marginBottom: '2rem' }}>
        <h2>Three steps. That's it.</h2>
      </div>
      
      <div className="workflow-steps">
        <div className="workflow-step">
          <div className="step-icon-container">
            <Database size={32} />
          </div>
          <div className="step-number">01</div>
          <h3 className="step-title">Connect</h3>
          <p className="step-desc">Link your Neon Postgres via URI. We instantly extract structural metadata.</p>
        </div>
        
        <div className="workflow-step">
          <div className="step-icon-container">
            <WorkflowIcon size={32} />
          </div>
          <div className="step-number">02</div>
          <h3 className="step-title">Model</h3>
          <p className="step-desc">Schema details are loaded into Neo4j, converting tabular data to relational graphs.</p>
        </div>
        
        <div className="workflow-step">
          <div className="step-icon-container">
            <Search size={32} />
          </div>
          <div className="step-number">03</div>
          <h3 className="step-title">Explore</h3>
          <p className="step-desc">Visualize with React Flow and receive AI explanations grounded in structure.</p>
        </div>
      </div>
    </section>
  );
};

export default Workflow;
