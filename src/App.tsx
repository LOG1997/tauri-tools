import React from 'react';
import { Provider } from 'react-redux';
// import store from './reduce'
import { BrowserRouter } from 'react-router-dom';
import { AliveScope } from 'react-activation';
import { Router } from '@/router';

function App() {
  return (
    <BrowserRouter>
      <AliveScope>
        <Router></Router>
      </AliveScope>
    </BrowserRouter>
  );
}

export default App;
