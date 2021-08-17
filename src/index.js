import React from 'react';
import ReactDOM from 'react-dom';

// Тема оформления (цветовая схема)
import { GlobalStyle } from './GlobalStyle';

import App from './Components/App/App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
