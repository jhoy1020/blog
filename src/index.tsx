import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Routes } from './routes';
import './styles/styles.css';

ReactDOM.render(
  <HelmetProvider>
    <Routes />
  </HelmetProvider>,
  document.getElementById('root')
);
