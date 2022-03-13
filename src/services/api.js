import axios from 'axios'

const api = axios.create({
    baseURL: 'https://localhost:7229',
    timeout: 2000,
})

export const login = (email, password) => {
    return api.post('/doctor/login', {
        email: email,
        password: password
    });
}