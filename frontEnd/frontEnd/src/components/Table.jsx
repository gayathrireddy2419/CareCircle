import React from 'react';
import './components.css';

export const Table = ({ headers, data, renderRow }) => {
  return (
    <div className="table-responsive">
      <table className="ui-table">
        <thead>
          <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {data.length > 0 ? data.map((item, index) => renderRow(item, index)) : (
            <tr><td colSpan={headers.length} className="empty-state">No data matches this layout.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};