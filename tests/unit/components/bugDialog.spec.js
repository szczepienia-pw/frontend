import { render, screen, fireEvent} from '@testing-library/vue';
import FooterContainer from '@/containers/FooterContainer';
import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import axios from 'axios';

describe("reporting bugs test", () => {
  describe("when a bug is submitted", () => {
    it("should correctly post entered data", async () => {
      const response = {
        msg: 'mock response'
      }
      axios.post.mockResolvedValue(response);

      render(FooterContainer, {
        global: {
          plugins: [PrimeVue, ToastService]
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
})