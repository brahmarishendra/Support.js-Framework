import React from 'react';
import Head from 'next/head';
import { ReactCalculator } from '../components/ReactCalculator';

export default function Home() {
  return (
    <>
      <Head>
        <title>Support.js Framework Calculator Demo</title>
        <meta name="description" content="Calculator demo built with Support.js Framework" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <ReactCalculator />
      </main>
    </>
  );
}