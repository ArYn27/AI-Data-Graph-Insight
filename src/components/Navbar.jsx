import React from 'react';
import { Link } from 'react-router-dom';
import { Database } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="container" style={{ position: 'relative', zIndex: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem', textDecoration: 'none', color: 'inherit' }}>
          <Database className="text-accent" size={24} />
          <span>InsightGraph AI</span>
        </Link>
        
        <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
          <a href="#how-it-works" style={{ color: 'inherit', textDecoration: 'none' }}>How It Works</a>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/auth" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
            Log In
          </Link>
          <Link to="/auth" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', textDecoration: 'none' }}>
            Start Free
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
