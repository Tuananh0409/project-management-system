import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/shared/components/ui/Button";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("UI crash:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-red-900">Đã xảy ra lỗi giao diện</h2>
          <p className="mt-2 text-sm text-red-800">{this.state.error.message}</p>
          <Button
            type="button"
            className="mt-4"
            onClick={() => {
              this.setState({ error: null });
              window.location.reload();
            }}
          >
            Tải lại trang
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
