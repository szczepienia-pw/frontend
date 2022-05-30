import { render, screen, fireEvent } from '@testing-library/vue';
import HeadContainer from '@/containers/HeadContainer';
import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import { clearUserSession } from '@/services/useUserSession'
import axios from 'axios';

jest.mock('@/services/useUserSession', () => ({
    useUserSession: () => ({ token: 'mock', userType: 'patient', isLoggedIn: true, userInfo: { firstName: 'test', lastName: 'test' } }),
    clearUserSession: jest.fn(),
    userTypes: { patient: 'patient' },
}));

jest.mock('vue-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe("deleting account test", () => {
    describe("when button is clicked", () => {
        it("should correctly send request", async () => {
            axios.delete.mockResolvedValue({})
            render(HeadContainer, {
                global: {
                    plugins: [PrimeVue, ToastService]
                }
            })

            await fireEvent.click(screen.getByText('Delete account'));
            await fireEvent.click(screen.getByText('Yes'));
            expect(axios.delete).toHaveBeenCalledWith('/patient/account');
        });
    });
})