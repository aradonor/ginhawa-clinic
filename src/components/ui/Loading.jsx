import React from "react";

export default function Loading({ text = "Loading…" }) {
  return (
    <div className="ui-loading" role="status">
      <span className="ui-loading__ring" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}
