import { render, screen, fireEvent, waitFor, getByText } from '@testing-library/vue'
import FooterContainer from '@/containers/FooterContainer'
import PrimeVue from 'primevue/config';
import axios from 'axios'
import ToastService from "primevue/toastservice";

const mockfn = jest.fn();

jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: () => mockfn,
  }),
}));

describe("reporting bugs test", () => {
  describe("when report bug button is pressed", () => {
      it("should open model dialog", async () => {
        const container = render(FooterContainer, {
            global: {
              plugins: [PrimeVue]
            }
        })

        const button = screen.getByRole('button', { name: 'Report a bug' })
        await fireEvent.click(button);
        expect(screen.getByRole('button', { name: 'Send' }).toBeInTheDocument);
      })
  })
})