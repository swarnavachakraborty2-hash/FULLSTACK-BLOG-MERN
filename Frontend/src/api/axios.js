import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',//proxy("known/trusted origin ")
  withCredentials: true //automatically set with every api request with "/api" which allows cokkies to be sent to other backend servers 
});

export default api;


