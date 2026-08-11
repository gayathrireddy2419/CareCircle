import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
      <Link to="/dashboard" style={{ color: '#2563eb', textDecoration: 'none' }}>Home</Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return (
          <span key={name}>
            <span style={{ margin: '0 8px' }}>/</span>
            {isLast ? (
              <span style={{ color: '#1e293b', fontWeight: 500, textTransform: 'capitalize' }}>{name}</span>
            ) : (
              <Link to={routeTo} style={{ color: '#2563eb', textDecoration: 'none', textTransform: 'capitalize' }}>{name}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};