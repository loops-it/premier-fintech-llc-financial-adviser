// import 'jquery';
// import '@popperjs/core';
// import 'popper.js';
// import 'bootstrap/dist/css/bootstrap.min.css';

import '../styles/globals.css'
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import 'regenerator-runtime/runtime'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <>
      <main className={inter.variable}>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
