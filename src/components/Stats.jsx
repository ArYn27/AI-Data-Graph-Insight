import React from 'react';

const Stats = () => {
  return (
    <div className="container">
      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-label">Databases Connected</span>
          <span className="stat-value text-accent">100+</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Nodes Generated</span>
          <span className="stat-value">12.4k</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Documentation Score</span>
          <span className="stat-value">98%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Query Time</span>
          <span className="stat-value">45ms</span>
        </div>
      </div>
    </div>
  );
};

export default Stats;
