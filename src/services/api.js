import axios from 'axios'
import {
    saveUserSession,
    useUserSession
} from '@/services/useUserSession'

const userSession = useUserSession();

const api = axios.create({
    baseURL: 'https://localhost:7229',
    timeout: 5000,
    headers: {
        'Authorization': userSession.token
    }
})

const setTokenAndCookies = (userType, token, userInfo = {}) => {
    api.defaults.headers['Authorization'] = token;
    userSession.token = token;
    userSession.userType = userType;
    userSession.userInfo = userInfo;
    saveUserSession();
}

export const login = (userType, email, password) => {
    return api.post(`/${userType}/login`, {
        email,
        password
    }).then(response => {
        setTokenAndCookies(userType, response.data.token, response.data?.patient || {});
    })
}

export const getVaccinationSlots = (page = 1, startDate = null, endDate = null, onlyReserved = null) => {
    return api.get(`/doctor/vaccination-slots?page=${page}
        ${startDate ? '&startDate=' + startDate : ''}
        ${endDate ? '&endDate=' + endDate : ''}
        ${onlyReserved ? '&onlyReserved=' + onlyReserved : ''}`);
}

export const createVaccinationSlot = (date) => {
    return api.post('/doctor/vaccination-slots', {
        date
    });
}

export const deleteVaccinationSlot = (id) => {
    return api.delete(`/doctor/vaccination-slots/${id}`);
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
        address
      })
}

export const changeData = (data) => {
    return api.put(`/patient/account`, 
        data
      )
}

export const getAdminSettings = () => {
    return api.get(`/admin/settings`)
}

export const changeAdminSettings = (bugEmail) => {
    return api.put(`/admin/settings`, {
        bugEmail
      })
}