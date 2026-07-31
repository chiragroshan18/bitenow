import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/store/store';
import { queryClient } from '@/lib/queryClient';
import AppRoutes from '@/routes/AppRoutes';
import Header from '@/components/layout/Header';
import ErrorBoundary from '@/components/ErrorBoundary';
import Aurora from '@/components/Backgrounds/Aurora';
import ClickSpark from '@/components/Animations/ClickSpark';
import PageTransition from '@/components/Animations/PageTransition';
import Toast from '@/components/ui/Toast';
import CursorEffects from '@/components/Animations/CursorEffects';
import BlobCursor from '@/components/Animations/BlobCursor';
import ProgressBar from '@/components/Animations/ProgressBar';
import { setCredentials } from '@/store/slices/authSlice';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('auth');
      if (!stored) {
        return;
      }

      const authData = JSON.parse(stored);
      if (authData?.isAuthenticated) {
        dispatch(setCredentials(authData));
      }
    } catch (err) {
      // Ignore invalid stored auth data
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Aurora>
          <ProgressBar />
          <CursorEffects />
          <BlobCursor />
          <ClickSpark>
            <Header />
            <PageTransition>
              <AppRoutes />
            </PageTransition>
          </ClickSpark>
          <Toast />
        </Aurora>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;