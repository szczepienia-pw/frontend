import { render, screen, fireEvent } from '@testing-library/vue';
import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import App from "@/App.vue"
import router from "@/router/index"
import axios from 'axios';

describe("doctor workflow test", () => {
    it("allows all required functionalities", async () => {
        let vaccinations = [
            {
                id: 1,
                date: new Date().toISOString(),
                vaccination: { 
                    status: 'Planned'
                }
            }
        ];

        const wrapper = render(App, {
            global: {
                plugins: [router, PrimeVue, ToastService],
                directives: {
                    tooltip() { /* stub */ }
                },
            }
        })
        await router.isReady();

        // log in

        await fireEvent.click(screen.getByText('Not a patient?'));
        await fireEvent.click(screen.getByText('Log in as doctor'));
        await fireEvent.update(screen.getByLabelText('Email'), 'john@doctor.com');
        await fireEvent.update(screen.getByLabelText('Password'), 'password');
        axios.post.mockResolvedValue({ data: { token: 'token', doctor: { firstName: 'John', lastName: 'Doctor' } } })
        axios.get.mockImplementation(() => Promise.resolve({ data: { pagination: { currentPage: 1, totalPages: 1, currentRecords: vaccinations.length, totalRecords: vaccinations.length }, data: vaccinations } }))
        await fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
        await screen.findByText('Add new vaccination slot');

        // add new slot

        const calendarButtons = screen.getAllByRole('button').filter(el => el.children[0]?.classList.contains('pi-calendar'))
        await fireEvent.click(calendarButtons[1])
        // click the current day
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate()+1);
        const date = tomorrow.toISOString();
        await fireEvent.click(screen.getAllByText(tomorrow.getDate())[0])
        axios.post.mockImplementation((url, data) => {
            vaccinations = [...vaccinations, { date: data.date, id: 5 }]
            return Promise.resolve()
        })
        await fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
        await screen.findByText('Free');
        expect(vaccinations).toHaveLength(2);

        // delete slot

        const deleteButtons = screen.getAllByRole('button').filter(el => el.classList.contains('p-button-danger'));
        await fireEvent.click(deleteButtons[2]);
        axios.delete.mockImplementation((url) => {
            vaccinations = vaccinations.filter(v => v.id != url.slice(-1))
            return Promise.resolve()
        })
        await fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
        expect(vaccinations).toHaveLength(1);
        await screen.findByText('Planned');
        
        // confirm slot

        const confirmButtons = screen.getAllByRole('button').filter(el => el.children[0]?.classList.contains('pi-check'));
        await fireEvent.click(confirmButtons[0]);
        axios.put.mockImplementation((url, data) => {
            vaccinations = vaccinations.map(el => {
                if(el.id == url.slice(-1)) return {...el, vaccination: { status: 'Completed' }};
                else return el;
            })
            return Promise.resolve();
        });
        await fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
        expect(vaccinations.filter(el => el.vaccination.status == 'Completed')).toHaveLength(1);
    })
})