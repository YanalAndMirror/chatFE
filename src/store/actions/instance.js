import axios from 'axios';
const instance = axios.create({
  baseURL: 'http://34.141.93.52:8000',
});
export default instance;
