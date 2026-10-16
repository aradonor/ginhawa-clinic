import React from "react";

// Pill-shaped input from the Ginhawa design. The design shows placeholders
// only, so the label is kept for screen readers.
export default function FormField({ label, name, error, as = "input", className = "", ...props }) {
  const Control = as;
  const errorId = `${name}-error`;
  return (
    <div className={`field ${error ? "field--invalid" : ""} ${className}`.trim()}>
      <label className="visually-hidden" htmlFor={name}>{label}</label>
      <Control
        id={name}
        name={name}
        placeholder={label}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && <p className="field__error" id={errorId} role="alert">{error}</p>}
    </div>
  );
}
