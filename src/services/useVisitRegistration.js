import { reactive } from 'vue'

const visitRegistration = reactive({
    slot: JSON.parse(sessionStorage.getItem('slot')),
    disease: sessionStorage.getItem('disease'),
    vaccine: JSON.parse(sessionStorage.getItem('vaccine'))
})

export const setVisitRegistration = (key, value) => {
    visitRegistration[key] = value;
    sessionStorage.setItem(key, ['slot', 'vaccine'].includes(key) ? JSON.stringify(value) : value);
}

export function useVisitRegistration() {
    return visitRegistration
}