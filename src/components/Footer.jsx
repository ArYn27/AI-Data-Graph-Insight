import React from 'react';
import { Database, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer container">
      <div className="footer-content">
        <div className="footer-logo">
          <Database className="text-accent" size={24} />
          <span>InsightGraph AI</span>
        </div>
        
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
          <a href="https://github.com/Aryn27/AI-Data-Graph-Insight" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={18} /> GitHub
          </a>
        </div>
      </div>
      <div style={{ marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        &copy; {new Date().getFullYear()} InsightGraph AI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
