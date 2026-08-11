// src/components/Card.jsx
import React from 'react';
import './components.css';

export const Card = ({ title, children, extra, status }) => {
  return (
    <div className={`ui-card ${status ? `border-${status}` : ''}`}>
      <div className="ui-card-header">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{title}</h3>
        {extra && <div className="ui-card-extra">{extra}</div>}
      </div>
      <div className="ui-card-body" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {children}
      </div>
    </div>
  );
};