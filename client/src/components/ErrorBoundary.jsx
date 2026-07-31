import { Component } from 'react';
import Button from '@/components/ui/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-muted-foreground mb-4">
            An unexpected error occurred. Please try again.
          </p>
          <Button onClick={this.handleReset}>Go to Home</Button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;