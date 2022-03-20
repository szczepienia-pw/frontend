import { render, screen, fireEvent } from '@testing-library/vue'
import LoginPage from '@/views/LoginPage'
import PrimeVue from 'primevue/config';
import axios from 'axios'
import ToastService from "primevue/toastservice";

const mockfn = jest.fn();

jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: () => mockfn,
  }),
}));

describe("loginPage test", () => {
  describe("when login button is pressed", () => {
      it("should send login request with input data", async () => {
        const response = {
            data: {
                token: 'mocked-token'
            }
        }
        axios.post.mockResolvedValue(response);

        render(LoginPage, {
          global: {
              plugins: [PrimeVue, ToastService],
            },
        })

        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        await fireEvent.update(emailInput, 'john@patient.com');
        await fireEvent.update(passwordInput, 'password');
        const button = screen.getByRole('button', { name: 'Log in' })
        
        await fireEvent.click(button);
        expect(axios.post).toHaveBeenCalledWith("/patient/login", {"email": "john@patient.com", "password": "password"})
      })
  })
})