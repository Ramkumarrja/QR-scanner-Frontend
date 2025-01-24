import axios from 'axios';


const baseURL = import.meta.env.VITE_BASEURL;

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 200000,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
    // mode : "cors"
});

export default axiosInstance;
export { baseURL };