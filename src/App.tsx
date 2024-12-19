import React from 'react';
import './App.css';
import AppTheme from "./template/AppTheme/AppTheme"
import LoginTheme from "./template/LoginTheme/LoginTheme"

function App() {
  return (
    <main className="App">
        <LoginTheme />
        <AppTheme />
    </main>
  );
}

export default App;