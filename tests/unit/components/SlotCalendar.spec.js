import { render, screen, fireEvent } from '@testing-library/vue';
import SlotCalendar from '@/components/SlotCalendar';
import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import axios from 'axios';
import { formatTime } from '@/services/helpers';

describe("SlotCalendar test", () => {
    describe("when component is rendered", () => {
        it("should allow to choose a slot", async () => {
            const today = new Date();
            const mockResponse = {
                data: [
                    {
                        id: 1,
                        date: today.toISOString()
                    }
                ]
            };
            axios.get.mockResolvedValue(mockResponse);

            const wrapper = render(SlotCalendar, {
                global: {
                    plugins: [PrimeVue, ToastService]
                }
            })

            expect(axios.get).toHaveBeenCalledWith('/vaccination-slots');

            // click today's date
            await fireEvent.click(screen.getAllByText(today.getDate()).filter(el => el.classList.contains('p-highlight'))[0]);
            // click the slot's time
            await fireEvent.click(screen.getByRole('button', { name: formatTime(today.toISOString()) }));
            // expect v-model to be updated
            expect(wrapper.emitted()['update:modelValue'][0]).toEqual(mockResponse.data)
        });
    });


})