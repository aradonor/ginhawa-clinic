import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function EmptyState({ icon = "heart", title, text, actionTo, actionLabel }) {
  return (
    <div className="ui-card ui-empty">
      <span className="ui-empty__icon"><Icon name={icon} size={28} /></span>
      <h2 className="ui-empty__title">{title}</h2>
      {text && <p className="ui-empty__text">{text}</p>}
      {actionTo && (
        <Link to={actionTo} className="ui-btn ui-btn--primary">{actionLabel}</Link>
      )}
    </div>
  );
}
