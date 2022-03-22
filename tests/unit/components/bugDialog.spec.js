import { render, screen, fireEvent} from '@testing-library/vue'
import FooterContainer from '@/containers/FooterContainer'
import PrimeVue from 'primevue/config';

const mockfn = jest.fn();

jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: () => mockfn,
  }),
}));

describe("reporting bugs test", () => {
  describe("when report bug button is pressed", () => {
      it("should open model dialog", async () => {
        render(FooterContainer, {
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