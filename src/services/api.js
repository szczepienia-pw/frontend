import axios from 'axios'
import { saveUserSession, useUserSession } from '@/services/useUserSession'

const userSession = useUserSession();

const api = axios.create({
    baseURL: 'https://localhost:7229',
    timeout: 2000,
    headers: {
        'Authorization': userSession.token
    }
})

const setTokenAndCookies = (userType, token) => {
    api.defaults.headers['Authorization'] = token;
    userSession.token = token;
    userSession.userType = userType;
    saveUserSession();
}

export const login = (userType, email, password) => {
    return api.post(`/${userType}/login`, {
        email,
        password
    }).then(response => {
        setTokenAndCookies(userType, response.data.token);
    })
}

export const createVaccinationSlot = (date) => {
    return api.post('/doctor/vaccination-slots', {
        date
    });
}

export const reportBug = (name, description) => {
    return api.post(`/bugs`, {
        name,
        description
    })
}

export const register = (firstName, lastName, pesel, email, password, address) => {
    return api.post(`/patient/registration`, {
        firstName, 
        lastName, 
        pesel, 
        email, 
        password,
        "address": {
          "city": address.city,
          "zipCode": address.zipCode,
          "street": address.street,
          "houseNumber": address.houseNumber,
          "localNumber": address.localNumber,
        }
      })
}