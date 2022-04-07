import { render, screen, fireEvent } from '@testing-library/vue'
import Slots from '@/views/doctor/Slots'
import PrimeVue from 'primevue/config';
import axios from 'axios'
import ToastService from "primevue/toastservice";

describe("Doctor slots test", () => {
    describe("when submit button is pressed", () => {
        it("should send request with inputted date", async () => {
            const response = {
                msg: 'mock response'
            }
            axios.post.mockResolvedValue(response);

            render(Slots, {
                global: {
                    plugins: [PrimeVue, ToastService],
                    directives: {
                        tooltip() { }
                    },
                    stubs: {
                        DoctorVaccinationsList: true
                    }
                }
            })

            // the date input is a button
            await fireEvent.click(screen.getAllByRole('button')[0])
            // click the current day
            const today = new Date();
            const date = today.toISOString();
            await fireEvent.click(screen.getAllByText(today.getDate())[0])
            await fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

            expect(axios.post).toHaveBeenCalledWith("/doctor/vaccination-slots", { date: expect.stringContaining(date.substring(0, date.indexOf('T'))) })
        })
    })
})