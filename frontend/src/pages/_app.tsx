import ErrorBoundary from "../components/shared/ErrorBoundary";
import { AppProps } from 'next/app'; // Import AppProps

function MyApp({ Component, pageProps }: AppProps) { // Use AppProps for typing
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default MyApp;