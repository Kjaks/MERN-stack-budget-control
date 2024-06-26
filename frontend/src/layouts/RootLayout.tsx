import { ReactNode } from 'react';
import Head from 'next/head';
import React from 'react';

type Props = {
  children: ReactNode;
};

const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Head>
        <title>MERN STACK APP</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        {children}
      </main>
    </>
  );
};

export default RootLayout;
