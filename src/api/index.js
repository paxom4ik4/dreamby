import axios from 'axios';

const API = axios.create({ baseURL: 'https://dreamstore.by/api' });

export default API;
