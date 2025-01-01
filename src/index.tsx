import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import LoginDataReducer from "./redux/reducers/LoginDataReducer";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default storage (localStorage)
import { PersistGate } from 'redux-persist/integration/react';

// Configuração do Redux Persist
const persistConfig = {
  key: 'root', // Chave para identificar o storage
  storage,     // Tipo de armazenamento (localStorage por padrão)
};

const persistedReducer = persistReducer(persistConfig, LoginDataReducer);

const store = configureStore({
  reducer: {
    LoginData: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
