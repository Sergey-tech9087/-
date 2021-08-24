import React from 'react';
import ReactDOM from 'react-dom';

import ReactNotification from 'react-notifications-component';

import { DeviceThemeProvider } from '@sberdevices/plasma-ui';

import App from './Components/App/App';
import './index.css';

ReactDOM.render(
  <DeviceThemeProvider>
    <ReactNotification />
    <App />
  </DeviceThemeProvider>,
  document.getElementById('root')
);
