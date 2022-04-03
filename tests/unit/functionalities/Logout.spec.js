import { render, screen, fireEvent } from '@testing-library/vue';
import HeadContainer from '@/containers/HeadContainer';
import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import { clearUserSession } from '@/services/useUserSession'

jest.mock('@/services/useUserSession', () => ({
    useUserSession: () => ({ token: 'mock', isLoggedIn: true }),
    clearUserSession: jest.fn(),
    userTypes: { doctor: 'doctor' }
}));

jest.mock('vue-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe("logging out test", () => {
    describe("when logout button is clicked", () => {
        it("should clear cookies", async () => {
            render(HeadContainer, {
                global: {
                    plugins: [PrimeVue, ToastService]
                }
            })

            await fireEvent.click(screen.getByRole('button', { name: 'Log out' }));

            expect(clearUserSession).toHaveBeenCalled();
        });
    });
})