import { render, screen, fireEvent } from '@testing-library/vue';
import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import App from "@/App.vue"
import router from "@/router/index"
import axios from 'axios';
import { formatTime } from '@/services/helpers';

describe("patient workflow test", () => {
    describe("vaccination registration & history", () => {
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
                    status: "Planned",
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

            let mockData = []
            const today = new Date();
            const mockDates = {
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
                            requiredDoses: 2
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

            axios.post.mockResolvedValue({ data: { token: 'token', patient: {} } });
            axios.get.mockImplementation(() => Promise.resolve({ data: { pagination: { currentPage: 1, totalPages: 1, currentRecords: mockData.length, totalRecords: mockData.length }, data: mockData } }))
            await fireEvent.click(screen.getByText('Log in'));
            await screen.findByText('History of vaccinations');

            axios.get.mockResolvedValue(mockDates);
            await fireEvent.click(screen.getByText('New appointment'));
            await screen.findByText('Time slot');
            // click today's date
            await fireEvent.click(screen.getAllByText(today.getDate()).filter(el => el.classList.contains('p-highlight'))[0]);
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
            axios.put.mockResolvedValue({})
            await screen.findByText('Confirm');

           
            await fireEvent.click(screen.getByText('Confirm'));
            expect(axios.put).toHaveBeenCalledWith('/patient/vaccination-slots/1', {vaccineId: 1});
        })
    })
})