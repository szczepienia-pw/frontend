import { computed, reactive, ref } from 'vue'
import Cookies from 'js-cookie'

const token = ref(Cookies.get('auth-token'))
const userType = ref(Cookies.get('user-type'))
const userInfo = ref(JSON.parse(Cookies.get('user-info') || '{}'));

const userSession = reactive({
    token,
    userType,
    userInfo,
    isLoggedIn: computed(() => !!token.value),
})

export const saveUserSession = () => {
    const cookieOptions = { expires: 1, sameSite: 'strict' };
    Cookies.set('user-type', userSession.userType, cookieOptions);
    Cookies.set('auth-token', userSession.token, cookieOptions);
    Cookies.set('user-info', JSON.stringify(userSession.userInfo));
}

export const clearUserSession = () => {
    Cookies.remove('user-type');
    Cookies.remove('auth-token');
	userSession.token = null;
	userSession.userType = null;
}

export function useUserSession() {
    return userSession
}