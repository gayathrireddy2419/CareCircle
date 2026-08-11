import React from "react";
import "./StatCard.css";

const StatCard = ({
  title,
  value,
  icon,
  subtitle,
  theme = "blue",
  onClick
}) => {
  return (
    <div
      className={`stat-card theme-${theme}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="stat-icon-wrapper">
        {icon}
      </div>

      <div className="stat-content">
        <h4 className="stat-title">{title}</h4>
        <div className="stat-value">{value}</div>
        <p className="stat-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default StatCard;