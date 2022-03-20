import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
    baseURL: 'https://localhost:7229',
    timeout: 2000,
    headers: {
        'Authorization': Cookies.get('auth-token')
    }
})

const setTokenAndCookies = (userType, token) => {
    const cookieOptions = { expires: 1, sameSite: 'strict'};
    api.defaults.headers['Authorization'] = token;
    Cookies.set('logged-in', 'true', cookieOptions);
    Cookies.set('user-type', userType, cookieOptions);
    Cookies.set('auth-token', token, cookieOptions);
}

export const login = (userType, email, password) => {
    return api.post(`/${userType}/login`, {
        email: email,
        password: password
    }).then(response => {
        setTokenAndCookies(userType, response.data.token);
    })
}

export const createVaccinationSlot = (date) => {
    return api.post('/doctor/vaccination-slots', {
        date: date
    });
}