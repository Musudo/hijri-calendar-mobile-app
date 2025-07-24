import '~/global.css';
import '~/i18n';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useSelector } from 'react-redux';
import { persistor, RootState, store } from '~/redux/Store';
import { PersistGate } from 'redux-persist/integration/react';
import RootLayoutInner from '~/app/RootLayoutInner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Try } from 'expo-router/build/views/Try';
import { ErrorBoundary } from '~/components/ErrorBoundary';
import { FontProvider } from '~/providers/FontProvider';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

function RootLayoutInnerWrapper() {
  const language = useSelector((state: RootState) => state.language.value);

  return (
    <FontProvider language={language}>
      <RootLayoutInner />
    </FontProvider>
  );
}

/**
 * This is the app's root layout.
 * Order of wrappers matters:
 * - GestureHandlerRootView: for gesture support
 * - Redux Provider & PersistGate: for global state and persistence
 * - QueryClientProvider: for react-query cache & async data
 * - RootLayoutInner: main navigation/content
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <Try catch={ErrorBoundary}>
              <RootLayoutInnerWrapper />
            </Try>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
