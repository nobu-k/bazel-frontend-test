import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

const App = React.lazy(() => import('./app'));

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root'),
);
