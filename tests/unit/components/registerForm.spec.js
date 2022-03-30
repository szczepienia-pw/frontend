import { render, screen, fireEvent } from '@testing-library/vue';
import RegisterForm from '@/components/RegisterForm';
import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import axios from 'axios';
import { useUserSession } from '@/services/useUserSession'

jest.mock('@/services/useUserSession', () => ({
    useUserSession: () => ({ token: 'mock token', userType: 'patient', isLoggedIn: true, userInfo: {} }),
    saveUserSession: () => { }
}))

describe("registration test", () => {
    describe("when register button is clicked", () => {
        it("should correctly post entered data", async () => {
            const response = {
                msg: 'mock response'
            }
            axios.post.mockResolvedValue(response);

            render(RegisterForm, {
                global: {
                    plugins: [PrimeVue, ToastService]
                }
            })

            await fireEvent.update(screen.getByLabelText('Firstname*'), 'test');
            await fireEvent.update(screen.getByLabelText('Lastname*'), 'test');
            await fireEvent.update(screen.getByLabelText('Pesel*'), '22222222222');
            await fireEvent.update(screen.getByLabelText('Email*'), 'test@test.com');
            await fireEvent.update(screen.getByLabelText('Password*'), 'test');
            await fireEvent.update(screen.getByLabelText('Street*'), 'test');
            await fireEvent.update(screen.getByLabelText('House number*'), '22');
            await fireEvent.update(screen.getByLabelText('City*'), 'test');
            await fireEvent.update(screen.getByLabelText('Zip code*'), '22-222');

            await fireEvent.click(screen.getByRole('button', { name: 'Register' }));
            expect(axios.post).toHaveBeenCalledWith("/patient/registration", {
                "address": {
                    "city": "test",
                    "houseNumber": "22",
                    "localNumber": "",
                    "street": "test",
                    "zipCode": "22-222",
                },
                "email": "test@test.com",
                "firstName": "test",
                "lastName": "test",
                "password": "test",
                "pesel": "22222222222"
            });
        });
    });
})