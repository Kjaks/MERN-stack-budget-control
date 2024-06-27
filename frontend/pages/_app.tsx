import '../styles/globals.css';
import type { AppProps } from 'next/app';
import type { NextComponentType } from 'next';

interface MyAppProps extends AppProps {
  Component: NextComponentType;
}

function MyApp({ Component, pageProps }: MyAppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
