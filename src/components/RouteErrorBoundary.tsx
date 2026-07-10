// src/components/RouteErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from "react";

interface Props { name: string; children: ReactNode }
interface State { hasError: boolean; error: Error | null; componentStack: string | null }

export default class RouteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, componentStack: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ componentStack: errorInfo.componentStack || null });
  }

  render() {
    if (this.state.hasError) {
      const err = this.state.error;
      let errorText = "No error object";
      if (err) {
        errorText = `name: ${err.name}\nmessage: ${err.message}\nstack: ${err.stack}`;
        try {
          errorText += `\nJSON: ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`;
        } catch {
          errorText += `\nString: ${String(err)}`;
        }
      }
      return (
        <div style={{ color: "white", padding: 20, wordBreak: "break-word", fontFamily: "monospace", fontSize: 14 }}>
          <strong>Error in {this.props.name}:</strong>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>
            {errorText}
          </pre>
          {this.state.componentStack && (
            <>
              <strong>Component Stack:</strong>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>
                {this.state.componentStack}
              </pre>
            </>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
