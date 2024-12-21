import React from 'react';
import './App.css';
import AppTheme from "./template/AppTheme/AppTheme"
import LoginTheme from "./template/LoginTheme/LoginTheme"
import Router from './router';
import Teste from "./screens/Teste"

function App() {
  return (
    <main className="App">
      <Teste />
      {/* <Router /> */}
        {/* <LoginTheme /> */}
        {/* <AppTheme /> */}
    </main>
  );
}

export default App;