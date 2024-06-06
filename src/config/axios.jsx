import axios from 'axios'

const api = axios.create({
    baseURL: 'http://152.42.182.49:8080/'
  });

  export default api; 