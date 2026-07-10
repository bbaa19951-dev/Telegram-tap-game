import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Error display helper
function showError(title: string, detail: string) {
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `<div style="color:white;padding:20px;font-size:14px;word-break:break-word;">
      <strong>${title}</strong><br><pre style="white-space:pre-wrap;">${detail}</pre>
    </div>`;
  }
}

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} catch (err: any) {
  showError("Render Error", err?.stack || err?.message || String(err));
}

// Global catches
window.onerror = function (msg, _source, line, _col, error) {
  showError("Window Error", (error?.stack || error?.message || msg) + "\nLine: " + line);
};

window.addEventListener("unhandledrejection", (event) => {
  showError("Unhandled Promise", event.reason?.stack || event.reason?.message || String(event.reason));
});
