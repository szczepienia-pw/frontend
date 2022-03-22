import { login, createVaccinationSlot } from '@/services/api'
import { render, screen, fireEvent} from '@testing-library/vue'
import Cookies from 'js-cookie'
import axios from 'axios'
import PrimeVue from 'primevue/config';
import FooterContainer from '@/containers/FooterContainer'

jest.mock('js-cookie')

describe("api tests", () => {
    describe("when login() call is successful", () => {
        it("should put auth token in cookies", async () => {
            const response = {
                data: {
                    token: 'mocked-token'
                }
            }

            axios.post.mockResolvedValue(response);

            await login('patient', 'email', 'password');

            expect(axios.post).toHaveBeenCalledWith(`/patient/login`, {
                email: "email",
                password: "password"
            });
            expect(Cookies.set).toHaveBeenCalledWith('auth-token', 'mocked-token', {expires: 1, sameSite: 'strict'})
        });
    });

    describe("when login() call fails", () => {
        it("should throw", async () => {
            const message = "error";
            axios.post.mockRejectedValueOnce(new Error(message));

            try {  
                await login('patient', 'email', 'password');
            } catch(err) {
                expect(err.message).toBe("error")
            }
        });
    });

    describe("when createVaccinationSlot() is called", () => {
        it("should correctly post date", async () => {
            const date = new Date().toISOString();
            await createVaccinationSlot(date);
            expect(axios.post).toHaveBeenCalledWith(`/doctor/vaccination-slots`, {
                date: date
            });
        });
    });

    describe("when reportBug() is called", () => {
        it("should correctly post entered data", async () => {
            render(FooterContainer, {
                global: {
                  plugins: [PrimeVue]
                }
            })
    
            const button = screen.getByRole('button', { name: 'Report a bug' });
            await fireEvent.click(button);
            const sendButton = await screen.findByRole('button', { name: 'Send' });
            const nameInput = screen.getByLabelText('Bug name');
            const descInput = screen.getByLabelText('Bug description');
            await fireEvent.update(nameInput, 'name');
            await fireEvent.update(descInput, 'desc');
            await fireEvent.click(sendButton);
            expect(axios.post).toHaveBeenCalledWith("/bugs", { name: 'name', description: 'desc'});
        });
    });
});