// src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from "react";

interface Props { children: ReactNode }
interface State { hasError: boolean; error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      const err = this.state.error;
      let errorText = "No error object";
      if (err) {
        errorText = `name: ${err.name}\nmessage: ${err.message}\nstack: ${err.stack}`;
        try {
          // If the error is not a standard Error, JSON it
          errorText += `\nJSON: ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`;
        } catch {
          errorText += `\nString: ${String(err)}`;
        }
      }
      return (
        <div style={{ color: "white", padding: 20, wordBreak: "break-word", fontFamily: "monospace", fontSize: 14 }}>
          <strong>Render Error:</strong>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>
            {errorText}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
