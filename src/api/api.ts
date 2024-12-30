import axios from 'axios'

const api = axios.create({
    baseURL: `${process.env.REACT_APP_URL_CONNECTION_API}:${process.env.REACT_APP_PORT}/api`
  });
  
  export default api;