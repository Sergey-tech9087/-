import React from 'react';
import ReactDOM from 'react-dom';

import { GlobalStyle } from './GlobalStyle';

import App from './Components/App/App';

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
