import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Error display helper
function showError(title: string, detail: string) {
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `<div style="color:white;padding:20px;font-size:14px;word-break:break-word;">
      <strong>${title}</strong><br>${detail}
    </div>`;
  }
}

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (err: any) {
  showError("Render Error", err?.message || String(err));
}

// Global catches
window.onerror = function (msg, _source, line, _col, error) {
  showError("Window Error", (error?.message || msg) + "\nLine: " + line);
};

window.addEventListener("unhandledrejection", (event) => {
  showError("Unhandled Promise", event.reason?.message || String(event.reason));
});
