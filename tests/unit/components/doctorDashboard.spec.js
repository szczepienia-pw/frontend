import { render, screen, fireEvent } from '@testing-library/vue'
import DoctorDashboard from '@/views/DoctorDashboard'
import PrimeVue from 'primevue/config';
import axios from 'axios'
import ToastService from "primevue/toastservice";

describe("DoctorDashboard test", () => {
  describe("when submit button is pressed", () => {
      it("should send request with inputted date", async () => {
        const response = {
            data: {
                token: 'mocked-token'
            }
        }
        axios.post.mockResolvedValue(response);

        render(DoctorDashboard, {
            global: {
              plugins: [PrimeVue, ToastService],
              directives: {
                  tooltip() {}
              }
            }
        })

        // the date input is a button
        await fireEvent.click(screen.getAllByRole('button')[0])
        // click the current day
        const today = new Date();
        const date = today.toISOString();
        await fireEvent.click(screen.getByText(today.getDate()))
        await fireEvent.click( screen.getByRole('button', { name: 'Submit' }));
        
        expect(axios.post).toHaveBeenCalledWith("/doctor/vaccination-slots", { date: expect.stringContaining(date.substring(0, date.indexOf('T')))})
      })
  })
})