import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5001/api/v1',
});


instance.interceptors.request.use((config) => {
    const token = JSON.parse(localStorage.getItem('token'));

    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default instance;
