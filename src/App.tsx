import React from 'react';
import './App.css';
import AppTheme from "./template/AppTheme/AppTheme"
import LoginTheme from "./template/LoginTheme/LoginTheme"
import Router from './router';

function App() {
  return (
    <main className="App">
      <Router />
        {/* <LoginTheme /> */}
        {/* <AppTheme /> */}
    </main>
  );
}

export default App;