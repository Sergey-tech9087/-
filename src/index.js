import React from 'react';
import ReactDOM from 'react-dom';

import ReactNotification from 'react-notifications-component';

// Тема оформления (цветовая схема)
import { GlobalStyle } from './GlobalStyle';

import App from './Components/App/App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <ReactNotification />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
