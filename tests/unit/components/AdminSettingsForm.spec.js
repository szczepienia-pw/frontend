import { render, screen, fireEvent } from '@testing-library/vue';
import AdminDashboard from '@/views/AdminDashboard';
import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import axios from 'axios';

describe("changing bug email test", () => {
    describe("when confirm button is pressed", () => {
        it("should send request with inputted data", async () => {
            const response = {
                msg: 'mock response'
            }
            axios.put.mockResolvedValue(response);
            axios.get.mockResolvedValue({ data: { bugEmail: 'placeholder@email.com' } })

            render(AdminDashboard, {
                global: {
                    plugins: [PrimeVue, ToastService],
                    stubs: {
                        DoctorDataTable: true
                    }
                },
            })

            await fireEvent.click(screen.getByRole('button', { name: 'Edit settings' }));
            await fireEvent.click(screen.getByText('placeholder@email.com'));
            await fireEvent.update(screen.getByRole('textbox'), 'test2@test.com');
            await fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
            expect(axios.put).toHaveBeenCalledWith("/admin/settings", { bugEmail: 'test2@test.com' });
        });
    });
})