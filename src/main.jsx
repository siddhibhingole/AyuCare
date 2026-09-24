import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';

// Hardcoded key to bypass .env loading issues
const PUBLISHABLE_KEY = "pk_test_cGxlYXNhbnQtc2FpbGZpc2gtMTI5MC5jbGVyay5hY2NvdW50cy5kZXYk";

if(!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk publishable key to the .env file');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);