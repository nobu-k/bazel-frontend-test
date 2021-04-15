import React from 'react';
import ReactDOM from 'react-dom';
import App from './app'; // TODO: test lazy loading

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
