import {
    render,
    screen,
    fireEvent
} from '@testing-library/vue';
import DoctorVaccinationsList from '@/components/DoctorVaccinationsList';
import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import axios from 'axios';
import {
    formatDate, formatTime
} from '@/services/helpers';

const currentYear = new Date().getFullYear();
const nextYear = new Date(currentYear + 1, 1);
const today = new Date();
const mockResponse = {
    data: {
        pagination: {
            currentPage: 1,
            totalPages: 1,
            currentRecords: 2,
            totalRecords: 2
        },
        data: [{
                id: 1,
                date: nextYear.toISOString(),
                vaccination: {
                    id: 1,
                    vaccine: {
                        id: 1,
                        name: "Phizer",
                        disease: "COVID-19",
                        requiredDoses: 2
                    },
                    status: "Planned",
                    patient: {
                        id: 1,
                        firstName: "John",
                        lastName: "Patient",
                        pesel: "003005039981",
                        email: "john@patient.com",
                        address: {
                            id: 1,
                            city: "Biłgoraj",
                            zipCode: "23-400",
                            street: "Jana Pawła II",
                            houseNumber: "20",
                            localNumber: "1A"
                        }
                    }
                }
            },
            {
                id: 2,
                date: new Date(currentYear + 2, 1).toISOString(),
            },
            {
                id: 3,
                date: nextYear.toISOString(),
                vaccination: {
                    id: 1,
                    vaccine: {
                        id: 1,
                        name: "Phizer",
                        disease: "COVID-19",
                        requiredDoses: 2
                    },
                    status: "Planned",
                    patient: {
                        id: 1,
                        firstName: "John",
                        lastName: "Patient",
                        pesel: "003005039981",
                        email: "john@patient.com",
                        address: {
                            id: 1,
                            city: "Biłgoraj",
                            zipCode: "23-400",
                            street: "Jana Pawła II",
                            houseNumber: "20",
                            localNumber: "1A"
                        }
                    }
                }
            },
        ]
    }
}

describe("DoctorVaccinationsList test", () => {
    describe("when component is rendered", () => {
        it("should correctly show fetched data", async () => {
            axios.get.mockResolvedValue(mockResponse);

            render(DoctorVaccinationsList, {
                global: {
                    plugins: [PrimeVue, ToastService],
                    directives: {
                        tooltip() {}
                    },
                }
            })

            await screen.findByText('John Patient');
            await screen.findByText('Planned');
            await screen.findByText('Free');
        });
    });

    describe("when slot is deleted", () => {
        it("should correctly send api request", async () => {
            axios.get.mockResolvedValue(mockResponse);
            axios.delete.mockResolvedValue({
                msg: 'mock'
            });

            render(DoctorVaccinationsList, {
                global: {
                    plugins: [PrimeVue, ToastService],
                    directives: {
                        tooltip() {}
                    },
                }
            })

            await screen.findByText('John Patient');
            const deleteButtons = screen.getAllByRole('button').filter(el => el.classList.contains('p-button-danger'));
            // the first button is for deleting selected, the second is for canceling the first planned vaccination
            await fireEvent.click(deleteButtons[2]);
            await fireEvent.click(screen.getByRole('button', {
                name: 'Yes'
            }));
            expect(axios.delete).toHaveBeenCalledWith("/doctor/vaccination-slots/2");
        });
    });

    describe("when appointment is selected", () => {
        it("should correctly display vaccination details and allow rescheduling", async () => {
            axios.get.mockResolvedValue(mockResponse);
            axios.post.mockResolvedValue({
                msg: "mock"
            });

            render(DoctorVaccinationsList, {
                global: {
                    plugins: [PrimeVue, ToastService],
                    directives: {
                        tooltip() {},
                    },
                },
            });

            await screen.findByText("John Patient");
            const detailsButton = screen.getByTestId("details");
            await fireEvent.click(detailsButton);
            await screen.findByText("john@patient.com");
            expect(await screen.findAllByText("John Patient")).toHaveLength(2);
            expect(await screen.findAllByText("COVID-19")).toHaveLength(1);
            await screen.findAllByText("Phizer");
            expect(await screen.findAllByText(formatDate(nextYear.toISOString()))).toHaveLength(1);

            axios.get.mockResolvedValueOnce({
                data: [{
                    id: 1,
                    date: today.toISOString()
                }]
            });
            await fireEvent.click(screen.getByText('Reschedule visit'));
            await screen.findByText('Choose new date');
            await fireEvent.click(screen.getAllByText(today.getDate()).filter(el => el.classList.contains('highlighted-day'))[0]);
            // click the slot's time
            await fireEvent.click(screen.getByRole('button', {
                name: formatTime(today.toISOString())
            }));
            await fireEvent.click(screen.getByText('Reschedule'));
            expect(axios.post).toHaveBeenLastCalledWith("/doctor/vaccinations/1/change-slot/", {
                vaccinationSlotId: 1
            });
        });
    });

    describe("when vaccination is completed", () => {
        it("should correctly send request", async () => {
            axios.get.mockResolvedValue(mockResponse);
            axios.put.mockResolvedValue({
                msg: "mock"
            });
            const wrapper = render(DoctorVaccinationsList, {
                global: {
                    plugins: [PrimeVue, ToastService],
                    directives: {
                        tooltip() {
                            /* stub */ }
                    },
                },
            });

            await screen.findByText('John Patient');
            await fireEvent.click(screen.getByTestId("confirm"));
            await fireEvent.click(screen.getByText('Yes'))
            expect(axios.put).toHaveBeenCalledWith("/doctor/vaccination-slots/1", {status: "COMPLETED"});
        });
    });

    describe("misc functionality test", () => {
        it("should correctly sort, filter and mass delete", async () => {
            axios.get.mockResolvedValue(mockResponse);
            axios.put.mockResolvedValue({
                msg: "mock"
            });

            const wrapper = render(DoctorVaccinationsList, {
                global: {
                    plugins: [PrimeVue, ToastService],
                    directives: {
                        tooltip() {
                            /* stub */ }
                    },
                },
            });

            await screen.findByText('John Patient');
            await fireEvent.click(screen.getByText('Date'))
            await fireEvent.update(screen.getByPlaceholderText('Search...'), 'John')
            await fireEvent.click(screen.getAllByRole('checkbox')[1])
            await fireEvent.click(screen.getByText('Delete'))
            await fireEvent.click(screen.getByText('Yes'))
            expect(axios.delete).toHaveBeenCalledWith("/doctor/vaccination-slots/2");
        });
    });
})