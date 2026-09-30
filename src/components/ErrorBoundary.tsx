import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleClearStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F7F5] px-4 py-12 text-center text-[#111111]">
          <div className="w-full max-w-md border border-[#E2E0DB] bg-white p-8 shadow-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="font-serif text-2xl font-normal text-[#171A18]">
              Đã xảy ra sự cố
            </h1>
            <p className="mt-2 text-xs text-[#666666]">
              Trang web gặp lỗi trong quá trình hiển thị. Bạn có thể thử tải lại trang hoặc khôi phục về trạng thái ban đầu.
            </p>

            {this.state.error && (
              <div className="mt-4 max-h-32 overflow-auto rounded bg-[#F0F1EC] p-3 text-left font-mono text-[11px] text-[#A43131]">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full bg-[#263C36] py-3 text-xs font-medium tracking-wider text-white transition-colors hover:bg-[#192A25]"
              >
                TẢI LẠI TRANG
              </button>
              <button
                type="button"
                onClick={this.handleClearStorage}
                className="w-full border border-[#D5D5CF] bg-white py-3 text-xs font-medium tracking-wider text-[#555555] transition-colors hover:bg-[#F5F5F0]"
              >
                XÓA BỘ NHỚ TẠM &amp; VỀ TRANG CHỦ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
