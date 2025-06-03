import axios from 'axios';
import { API_BASE_URL } from './env';
import * as SecureStore from 'expo-secure-store';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false,
});

//add request interceptor to dynamically set the auth token
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }   
        return config;
    }, 
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

export default axiosInstance;