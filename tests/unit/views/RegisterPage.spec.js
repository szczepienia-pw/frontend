import { render, screen, fireEvent } from '@testing-library/vue'
import RegisterPage from '@/views/RegisterPage'
import PrimeVue from 'primevue/config';
import axios from 'axios'
import ToastService from "primevue/toastservice";

jest.mock('vue-router', () => ({
    useRoute: () => ({
        query: {
            token: 'mock'
        }
    }),
}));

describe("RegisterPage test", () => {
    describe("when page is loaded", () => {
        it("should send registration confirm request", async () => {
            const response = {
                data: {
                    token: 'mocked-token'
                }
            }
            axios.post.mockResolvedValue(response);

            render(RegisterPage, {
                global: {
                    plugins: [PrimeVue, ToastService],
                },
            })

            expect(axios.post).toHaveBeenCalledWith("/patient/registration/confirm", { token: "mock" })
        })
    })

    describe("when backend returns error", () => {
        it("should show error message", async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            axios.post.mockImplementation(() => Promise.reject());

            render(RegisterPage, {
                global: {
                    plugins: [PrimeVue, ToastService],
                },
            })

            await screen.findByText('There was an error.')
        })
    })
})