import { login, createVaccinationSlot } from '@/services/api'
import Cookies from 'js-cookie'
import axios from 'axios'

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
});