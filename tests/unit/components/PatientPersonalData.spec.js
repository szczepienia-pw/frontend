import { render, screen, fireEvent } from '@testing-library/vue';
import PersonalData from '@/views/patient/PersonalData';
import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import Cookies from 'js-cookie'
import axios from 'axios'
import { useUserSession } from '@/services/useUserSession'

var mockUserInfo = {
    firstName: "John",
    lastName: "Doe",
    password: "Super-Strong-Password#123",
    address: {
        city: "Warszawa",
        zipCode: "01-202",
        street: "Jaktorowska",
        houseNumber: "14",
        localNumber: "5a"
    }
}

jest.mock('@/services/useUserSession', () => ({
    useUserSession: () => ({ token: 'mock token', userType: 'patient', isLoggedIn: true, userInfo: mockUserInfo }),
    saveUserSession: jest.fn()
}))

jest.mock('vue-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe("editing user data test", () => {
    describe("when confirm button is clicked", () => {
        it("should send request with inputted data", async () => {
            const response = {
                msg: 'mock response'
            }
            axios.post.mockResolvedValue(response);
            axios.put.mockResolvedValue(response);

            render(PersonalData, {
                global: {
                    plugins: [PrimeVue, ToastService]
                }
            })

            await fireEvent.click(screen.getByText('John'));
            await fireEvent.update(screen.getByRole('textbox'), 'test');
            await fireEvent.click(screen.getByText('Doe'), 'test');
            await fireEvent.update(screen.getAllByRole('textbox')[1], 'test');
            await fireEvent.click(screen.getByText('Enter new password'));
            await fireEvent.update(screen.getByDisplayValue(''), 'test');
            await fireEvent.click(screen.getByText('Jaktorowska'));
            await fireEvent.update(screen.getAllByRole('textbox')[2], 'test');
            await fireEvent.click(screen.getByText('14'));
            await fireEvent.update(screen.getAllByRole('textbox')[3], '15');
            await fireEvent.click(screen.getByText('5a'));
            await fireEvent.update(screen.getAllByRole('textbox')[4], '6b');
            await fireEvent.click(screen.getByText('Warszawa'));
            await fireEvent.update(screen.getAllByRole('textbox')[5], 'test');
            await fireEvent.click(screen.getByText('01-202'));
            await fireEvent.update(screen.getAllByRole('textbox')[6], '22-222');

            await fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

            expect(axios.put).toHaveBeenCalledWith("/patient/account", { "address": { "city": "test", "houseNumber": "15", "localNumber": "6b", "street": "test", "zipCode": "22-222" }, "firstName": "test", "lastName": "test", "password": "test" } );
        });
    });
})