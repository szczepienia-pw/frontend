import axios from 'axios'
import { useCookies } from '@vueuse/integrations/useCookies';

const cookies = useCookies(['logged-in', 'user-type', 'auth-token']);

const api = axios.create({
    baseURL: 'https://localhost:7229',
    timeout: 2000,
    headers: {
        'Authorization': useCookies().get('auth-token')
    }
})

const setTokenAndCookies = (userType, token) => {
    const cookieOptions = { maxAge: 864000, sameSite: true};
    api.defaults.headers.common['Authorization'] = token;
    cookies.set('logged-in', 'true', cookieOptions);
    cookies.set('user-type', userType, cookieOptions);
    cookies.set('auth-token', token, cookieOptions);
}

export const loginDoctor = (email, password) => {
    return api.post('/doctor/login', {
        email: email,
        password: password
    }).then(response => {
        setTokenAndCookies('doctor', response.data.token);
    })
}

export const createVaccinationSlot = (date) => {
    return api.post('/doctor/vaccination-slots', {
        date: date
    });
}