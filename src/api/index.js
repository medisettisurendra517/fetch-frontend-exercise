import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://frontend-take-home-service.fetch.com',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
    referrerPolicy: "no-referrer"
});





