import { render, screen, fireEvent } from '@testing-library/vue';
import { nextTick } from 'vue'
import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import App from "@/App.vue"
import router from "@/router/index"
import axios from 'axios';
import { formatTime } from '@/services/helpers';

describe("patient workflow test", () => {
    describe("register & login", () => {
        it("test all required functionalities", async () => {
            let mockData = [

            ];

            let account = {}

            const wrapper = render(App, {
                global: {
                    plugins: [router, PrimeVue, ToastService],
                    directives: {
                        tooltip() { /* stub */ }
                    },
                }
            })
            await router.isReady();

            // register

            await fireEvent.click(screen.getByText('Create an account'));
            await fireEvent.update(screen.getByLabelText('Firstname*'), 'john');
            await fireEvent.update(screen.getByLabelText('Lastname*'), 'patient');
            await fireEvent.update(screen.getByLabelText('Pesel*'), '22222222222');
            await fireEvent.update(screen.getByLabelText('Email*'), 'test@test.com');
            await fireEvent.update(screen.getByLabelText('Password*'), 'test');
            await fireEvent.update(screen.getByLabelText('Street*'), 'test st.');
            await fireEvent.update(screen.getByLabelText('House number*'), '22');
            await fireEvent.update(screen.getByLabelText('City*'), 'test');
            await fireEvent.update(screen.getByLabelText('Zip code*'), '22-222');

            axios.post.mockImplementation((url, data) => {
                account = data
                return Promise.resolve()
            })
            await fireEvent.click(screen.getByRole('button', { name: 'Register' }));

            // log in

            await fireEvent.update(screen.getByLabelText('Email'), 'test@test.com');
            await fireEvent.update(screen.getByLabelText('Password'), 'test');
            axios.post.mockImplementation((url, data) => {
                if (data.email == account.email && data.password == account.password) return Promise.resolve({ data: { token: 'token', patient: account } })
                else return Promise.resolve('unauthorized');
            });

            axios.get.mockImplementation(() => Promise.resolve({ data: { pagination: { currentPage: 1, totalPages: 1, currentRecords: mockData.length, totalRecords: mockData.length }, data: mockData } }))
            await fireEvent.click(screen.getByText('Log in'));
            await screen.findByText('john patient');
        })
    })

    describe("vaccination registration & history & visit details", () => {
        it("test all required functionalities", async () => {
            window.HTMLElement.prototype.scrollIntoView = function () { };
            let mockVaccinations = [
                {
                    id: 1,
                    vaccine: {
                        id: 1,
                        name: "Pfizer",
                        disease: "COVID-19",
                        requiredDoses: 2,
                        serialNumber: "000-1311231"
                    },
                    vaccinationSlot: {
                        id: 1,
                        date: "2019-08-24T14:15:22Z"
                    },
                    status: "Completed",
                    patient: {
                        id: 1,
                        firstName: "Patient",
                        lastName: "Patient",
                        pesel: "003005039981",
                        email: "john.doe@patient.com",
                        address: {
                            id: 1,
                            city: "Biłgoraj",
                            zipCode: "23-400",
                            street: "Jana Pawła II",
                            houseNumber: "20",
                            localNumber: "1A"
                        }
                    },
                    doctor: {
                        id: 1,
                        firstName: "Dr John",
                        lastName: "Doe",
                        email: "john.doe@doctor.com"
                    }
                }
            ];

            let today = new Date();
            let mockDates = {
                data: [
                    {
                        id: 1,
                        date: today.toISOString()
                    }
                ]
            };
            const mockVaccines = {
                data: {
                    vaccines: [
                        {
                            id: 1,
                            name: "Pfizer",
                            disease: "COVID-19",
                            requiredDoses: 2,
                            serialNumber: 'asd-09202'
                        }
                    ]
                }
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


            axios.get.mockResolvedValue(mockDates);

            // register for appointment

            await fireEvent.click(screen.getByText('New appointment'));
            await screen.findByText('Time slot');
            // click today's date
            await nextTick();
            await fireEvent.click(screen.getAllByText(today.getDate()).filter(el => el.classList.contains('highlighted-day'))[0]);
            // click the slot's time
            await fireEvent.click(screen.getByRole('button', { name: formatTime(today.toISOString()) }));
            axios.get.mockResolvedValue(mockVaccines);
            await fireEvent.click(screen.getByText('Next'));
            await screen.findByText('COVID-19');

            await fireEvent.click(screen.getByText('COVID-19'));
            await fireEvent.click(screen.getByText('Next'));
            await screen.findByText('Select vaccine');

            await fireEvent.click(screen.getByText('Select vaccine'));
            await fireEvent.click(screen.getByText('Pfizer'));
            await fireEvent.click(screen.getByText('Next'));
            await screen.findByText('Confirm');

            axios.put.mockImplementation((url, data) => {
                mockVaccinations = [...mockVaccinations, {
                    id: 2,
                    vaccine: mockVaccines.data.vaccines.filter(v => v.id == data.vaccineId)[0],
                    vaccinationSlot: mockDates.data.filter(d => d.id == url.slice(-1))[0],
                    status: 'Planned',
                    doctor: {
                        id: 1,
                        firstName: "Dr John",
                        lastName: "Doe",
                        email: "john.doe@doctor.com"
                    }
                }]
                return Promise.resolve();
            });
            await fireEvent.click(screen.getByText('Confirm'));

            // check visit history

            axios.get.mockImplementation(() => Promise.resolve({ data: { pagination: { currentPage: 1, totalPages: 1, currentRecords: mockVaccinations.length, totalRecords: mockVaccinations.length }, data: mockVaccinations } }))
            await fireEvent.click(screen.getByText('Visit history'));
            const vaccinations = await screen.findAllByText('Pfizer');
            expect(vaccinations).toHaveLength(2);

            // cancel visit

            await fireEvent.click(screen.getAllByText('Pfizer')[1]);
            await fireEvent.click(screen.getByText('Cancel visit'));
            axios.delete.mockResolvedValue({})
            await fireEvent.click(screen.getByText('Yes'));
            expect(axios.delete).toHaveBeenCalledWith("/patient/vaccination-slots/1");
            await screen.findAllByText('Pfizer');

            // reschedule visit

            await fireEvent.click(screen.getAllByText('Pfizer')[1]);

            today = new Date();
            mockDates = {
                data: [
                    {
                        id: 3,
                        date: today.toISOString()
                    }
                ]
            };

            axios.get.mockResolvedValueOnce(mockDates);
            await fireEvent.click(screen.getByText('Reschedule visit'));
            await screen.findByText('Choose new date');
            console.log(screen.getAllByText(today.getDate())[0].classList.toString())
            await fireEvent.click(screen.getAllByText(today.getDate()).filter(el => el.classList.contains('highlighted-day'))[0]);
            // click the slot's time
            await fireEvent.click(screen.getByRole('button', { name: formatTime(today.toISOString()) }));
            await fireEvent.click(screen.getByText('Reschedule'));
            expect(axios.put).toHaveBeenLastCalledWith("/patient/vaccination-slots/3", {vaccineId: 1});
            await screen.findAllByText('Pfizer');
        })
    })

    describe("personal data", () => {
        it("test all required functionalities", async () => {
            const wrapper = render(App, {
                global: {
                    plugins: [router, PrimeVue, ToastService],
                    directives: {
                        tooltip() { /* stub */ }
                    },
                }
            })
            await router.isReady();
            await fireEvent.click(screen.getByText('Personal data'));
            await screen.findByText('test st.');
            await fireEvent.click(screen.getByText('test st.'));
            await fireEvent.update(screen.getByRole('textbox'), 'test 2 st.');
            axios.put.mockResolvedValue({data: {}})
            await fireEvent.click(screen.getByText('Confirm'));
            expect(axios.put).toHaveBeenCalledWith('/patient/account', { address: { street: 'test 2 st.' } })
        })
    })
})