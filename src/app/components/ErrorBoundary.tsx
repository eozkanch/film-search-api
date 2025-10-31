"use client";

import React, { Component, ReactNode } from "react";
import { FiAlertCircle } from "react-icons/fi";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallbackMessage?: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // Only log detailed errors in development
        if (process.env.NODE_ENV === 'development') {
            console.error("ErrorBoundary caught an error:", error, errorInfo);
        } else {
            // Production: Log generic error only
            console.error("An error occurred in the application");
        }
        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
        window.location.reload();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 sm:p-6 md:p-8 text-center">
                    <FiAlertCircle className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-red-600 mb-4 sm:mb-6" />
                    <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold px-4">
                        Oops! Something went wrong
                    </h3>
                    <h6 className="mb-4 sm:mb-6 text-base sm:text-lg md:text-xl text-gray-400 px-4 max-w-2xl">
                        {this.props.fallbackMessage ||
                            "An unexpected error occurred. Please try refreshing the page."}
                    </h6>

                    {process.env.NODE_ENV === "development" && this.state.error && (
                        <div className="bg-red-500/10 border border-red-600 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl w-full mx-4 text-left overflow-x-auto">
                            <p className="font-mono whitespace-pre-wrap text-xs sm:text-sm md:text-base">
                                <strong>Error:</strong> {this.state.error.toString()}
                                {this.state.errorInfo && (
                                    <>
                                        <br /><br />
                                        <strong>Stack Trace:</strong>
                                        {this.state.errorInfo.componentStack}
                                    </>
                                )}
                            </p>
                        </div>
                    )}

                    <button
                        onClick={this.handleReset}
                        className="bg-red-600 hover:bg-red-800 px-6 py-2.5 sm:px-8 sm:py-3 md:px-10 md:py-4 rounded-lg text-base sm:text-lg md:text-xl font-semibold transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
