import React from 'react';
import { Network, Database, Brain, Search, LayoutTemplate, ShieldCheck } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Network size={24} />,
      title: "Automatic Schema Extraction",
      desc: "Connect directly via URI to extract tables, columns, and relationships automatically without manual effort."
    },
    {
      icon: <Database size={24} />,
      title: "Direct Neon Postgres Connection",
      desc: "Native integration with Neon Postgres for seamless, fast reliable connectivity and real-time insights."
    },
    {
      icon: <LayoutTemplate size={24} />,
      title: "Graph-Based Modeling",
      desc: "Convert relational structures into an intuitive graph model using Neo4j to visualize complex dependencies."
    },
    {
      icon: <Brain size={24} />,
      title: "Explainable AI Insights",
      desc: "Contextual, plain-language explanations of your schema structure, rooted firmly in real metadata with no hallucinations."
    },
    {
      icon: <Search size={24} />,
      title: "Interactive Visualization",
      desc: "Explore your database architectures mapped using React Flow, making database navigation visual and intuitive."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Reliable Accuracy",
      desc: "Insights generated are derived strictly from deterministic graph queries, ensuring high confidence in AI outputs."
    }
  ];

  return (
    <section id="features" className="container" style={{ paddingTop: '4rem' }}>
      <div className="section-header">
        <h2>Everything you need.</h2>
        <p>From extraction to intelligence — one intelligent layer.</p>
      </div>
      
      <div className="features-grid">
        {features.map((feature, idx) => (
          <div key={idx} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-desc">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
