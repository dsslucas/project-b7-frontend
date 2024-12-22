import React from 'react';
import './App.css';
import AppTheme from "./template/AppTheme/AppTheme"
import LoginTheme from "./template/LoginTheme/LoginTheme"
import Router from './router';
import Teste from "./screens/testes/Teste"
import Teste2 from "./screens/testes/test2"

function App() {
  return (
    <main className="App">
      <h1>TESTE 1</h1>
      <Teste />

      <br/>
      <h1>TESTE 2</h1>
      <Teste2 />
      {/* <Router /> */}
        {/* <LoginTheme /> */}
        {/* <AppTheme /> */}
    </main>
  );
}

export default App;