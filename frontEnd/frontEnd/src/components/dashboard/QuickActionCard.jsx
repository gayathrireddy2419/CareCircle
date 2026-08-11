import React from "react";
import "./QuickActionCard.css";

const QuickActionCard = ({
  icon,
  title,
  subtitle,
  theme = "blue",
  onClick
}) => {
  return (
    <button
      className={`quick-card theme-${theme}`}
      onClick={onClick}
    >
      <div className="quick-card-top">
        <div className="quick-icon-wrapper">
          {icon}
        </div>
      </div>

      <div className="quick-card-body">
        <h4 className="quick-title">{title}</h4>
        <p className="quick-subtitle">{subtitle || 'Quick Shortcut'}</p>
      </div>
    </button>
  );
};

export default QuickActionCard;