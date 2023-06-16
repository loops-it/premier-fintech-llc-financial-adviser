import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import Script from 'next/script';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  
  
  
  return (
    <div className="mx-auto flex flex-col space-y-4">
      <header className="container sticky top-0 z-40 bg-white">
        {/* <div className="h-16 border-b border-b-slate-200 py-4">
          <nav className="ml-4 pl-6">
            <a href="#" className="hover:text-slate-600 cursor-pointer">
              Home
            </a>
          </nav>
        </div> */}
        
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous"></link>

        <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></Script>
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossOrigin="anonymous"></Script>
      </header>
      <div>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <div
            id="Bot"
            className={`${styles.mainContainer} m-md-2`}
          >
            {/* <div classNamse="row"> */}
              {/* chat box */}
              {/* <div className={`col-lg-12`}> */}
                <div className={`${styles.botChatContainer} p-0 text-dark`}>
                  
                  {/* message content childerns - pages */}
                  {children}
                </div>
              </div>
            {/* </div> */}
          {/* </div> */}
        </main>
      </div>
    </div>
  );
}
