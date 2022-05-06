import { render, screen, fireEvent } from '@testing-library/vue';
import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import App from "@/App.vue"
import router from "@/router/index"
import axios from 'axios';

describe("admin workflow test", () => {
    describe("doctors data table", () => {
        it("test all required functionalities", async () => {
            let mockData = [
                {
                    id: 1,
                    firstName: 'john',
                    lastName: 'doctor',
                    email: 'john@doctor.com'
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
            await fireEvent.click(screen.getByText('Log in as admin'));
            await fireEvent.update(screen.getByLabelText('Email'), 'john@admin.com');
            await fireEvent.update(screen.getByLabelText('Password'), 'password');
            axios.post.mockResolvedValue({ data: { token: 'token', admin: {} } })
            axios.get.mockImplementation(() => Promise.resolve({ data: { pagination: { currentPage: 1, totalPages: 1, currentRecords: mockData.length, totalRecords: mockData.length }, data: mockData } }))
            await fireEvent.click(screen.getByText('Log in'));
            await screen.findByText('john@doctor.com');

            // add new doctor

            await fireEvent.click(screen.getByText('New'))
            await fireEvent.update(screen.getByLabelText('First name'), 'test');
            await fireEvent.update(screen.getByLabelText('Last name'), 'test');
            await fireEvent.update(screen.getByLabelText('Email'), 'test@test.com');
            await fireEvent.update(screen.getByLabelText('Password'), 'test');
            axios.post.mockImplementation((url, data) => {
                mockData = [...mockData, { id: 2, ...data }]
                return Promise.resolve()
            })
            await fireEvent.click(screen.getByText('Save'));
            await screen.findByText('test@test.com');

            // edit doctor

            const editButtons = screen.getAllByRole('button').filter(el => el.children[0]?.classList.contains('pi-pencil'));
            await fireEvent.click(editButtons[0]);
            await fireEvent.update(screen.getByLabelText('First name'), 'test2');
            await fireEvent.update(screen.getByLabelText('Last name'), 'test2');
            await fireEvent.update(screen.getByLabelText('Email'), 'test2@test2.com');
            axios.put.mockImplementation((url, data) => {
                mockData = mockData.map(el => {
                    if (el.id == url.slice(-1)) return { id: el.id, ...data };
                    else return el;
                })
                return Promise.resolve()
            })
            await fireEvent.click(screen.getByRole('button', { name: 'Save' }));
            await screen.findByText('test2@test2.com');

            // delete doctor

            const deleteButtons = screen.getAllByRole('button').filter(el => el.children[0]?.classList.contains('pi-trash'));
            axios.delete.mockImplementation((url) => {
                mockData = mockData.filter(v => v.id != url.slice(-1))
                return Promise.resolve()
            })
            await fireEvent.click(deleteButtons[1]);
            await fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
            expect(mockData).toHaveLength(1);
        })
    })

    describe("patients data table", () => {
        it("test all required functionalities", async () => {
            let mockData = [
                {
                    id: 1,
                    firstName: 'john',
                    lastName: 'patient',
                    email: 'john@patient.com',
                    address: {}
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

            axios.get.mockImplementation(() => Promise.resolve({ data: { pagination: { currentPage: 1, totalPages: 1, currentRecords: mockData.length, totalRecords: mockData.length }, data: mockData } }))
            await fireEvent.click(screen.getByText('Patients'));
            await screen.findByText('john@patient.com');

            // edit patient

            const editButtons = screen.getAllByRole('button').filter(el => el.children[0]?.classList.contains('pi-pencil'));
            await fireEvent.click(editButtons[0]);
            await fireEvent.update(screen.getByLabelText('Email'), 'john2@patient2.com');
            axios.put.mockImplementation((url, data) => {
                mockData = mockData.map(el => {
                    if (el.id == url.slice(-1)) return {...el, ...data}
                    else return el;
                })
                return Promise.resolve()
            })
            await fireEvent.click(screen.getByRole('button', { name: 'Save' }));
            await screen.findByText('john2@patient2.com');

            // delete patient

            const deleteButtons = screen.getAllByRole('button').filter(el => el.children[0]?.classList.contains('pi-trash'));
            axios.delete.mockImplementation((url) => {
                mockData = mockData.filter(v => v.id != url.slice(-1))
                return Promise.resolve()
            })
            await fireEvent.click(deleteButtons[1]);
            await fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
            expect(mockData).toHaveLength(0);
        })
    })

    describe("settings", () => {
        it("test all required functionalities", async () => {
            let mockData = {
                bugEmail: 'test@bug.com'
            }
            const wrapper = render(App, {
                global: {
                    plugins: [router, PrimeVue, ToastService],
                    directives: {
                        tooltip() { /* stub */ }
                    },
                }
            })
            await router.isReady();

            axios.get.mockImplementation(() => Promise.resolve({ data: mockData }))
            await fireEvent.click(screen.getByText('Settings'));
            await screen.findByText('test@bug.com');
            await fireEvent.click(screen.getByText('test@bug.com'));
            await fireEvent.update(screen.getByRole('textbox'), 'test2@test2.com');
            axios.put.mockImplementation((url, data) => {
                mockData = data;
                return Promise.resolve()
            })
            await fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
            expect(mockData.bugEmail).toEqual('test2@test2.com')
        })
    })
})