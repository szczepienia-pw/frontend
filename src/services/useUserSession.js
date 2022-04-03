import { computed, reactive, ref } from 'vue'
import Cookies from 'js-cookie'

export const tokenCookie = 'auth-token';
export const userTypeCookie = 'user-type';
export const userInfoCookie = 'user-info';

export const userTypes = {
    patient: 'patient',
    doctor: 'doctor',
    admin: 'admin'
}

const token = ref(Cookies.get(tokenCookie))
const userType = ref(Cookies.get(userTypeCookie))
const userInfo = ref(JSON.parse(Cookies.get(userInfoCookie) || '{}'));
const cookieApi = Cookies.withAttributes({ expires: 1, sameSite: 'lax' })

const userSession = reactive({
    token,
    userType,
    userInfo,
    isLoggedIn: computed(() => !!token.value),
})

export const saveUserSession = () => {
    cookieApi.set(userTypeCookie, userSession.userType);
    cookieApi.set(tokenCookie, userSession.token);
    cookieApi.set(userInfoCookie, JSON.stringify(userSession.userInfo));
}

export const clearUserSession = () => {
    cookieApi.remove(userTypeCookie);
    cookieApi.remove(tokenCookie);
    cookieApi.remove(userInfoCookie);
	userSession.token = null;
	userSession.userType = null;
}

export function useUserSession() {
    return userSession
}