// resources/js/Components/Accordion.jsx
import React, { useId, useState } from "react";

export default function Accordion({ title, defaultOpen = false, children, className = "" }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const panelId = `acc-panel-${id}`;
  const buttonId = `acc-button-${id}`;

  return (
    <div className={`border rounded-md ${className}`}>
      <button
        id={buttonId}
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-medium">{title}</span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/>
        </svg>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`px-4 pt-0 pb-4 grid transition-all overflow-hidden ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        } duration-200`}
      >
        <div className="min-h-0">{open ? children : null}</div>
      </div>
    </div>
  );
}
