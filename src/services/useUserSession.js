import { computed, reactive, ref } from 'vue'
import Cookies from 'js-cookie'

const token = ref(Cookies.get('auth-token'))
const userType = ref(Cookies.get('user-type'))

const userSession = reactive({
  token,
  userType,
  isLoggedIn: computed(() => !!token.value),
})

export const saveUserSession = () => {
  const cookieOptions = { expires: 1, sameSite: 'strict'};
  Cookies.set('user-type', userSession.userType, cookieOptions);
  Cookies.set('auth-token', userSession.token, cookieOptions);
}

export const clearUserSession = () => {
  Cookies.remove('user-type');
  Cookies.remove('auth-token');
}

export function useUserSession() {
  return userSession
}