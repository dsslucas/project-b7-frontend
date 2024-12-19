import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import LoginDataReducer from "./redux/reducers/LoginDataReducer"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const store = configureStore({
  reducer: {
    LoginData: LoginDataReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  })
})

root.render(
  <Provider store={store}>    
    <BrowserRouter>
      <App />
      {/* <Teste /> */}
    </BrowserRouter>
  </Provider>
);
