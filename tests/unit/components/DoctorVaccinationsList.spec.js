import { render, screen, waitFor } from '@testing-library/vue';
import DoctorVaccinationsList from '@/components/DoctorVaccinationsList';
import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import axios from 'axios';
import { fireEvent } from '@testing-library/dom';

const currentYear = new Date().getFullYear();

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
            date: new Date(currentYear+1, 1).toISOString(),
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
                    email: "john.doe@patient.com",
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
            date: new Date(currentYear+2, 1).toISOString(),
        }]
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
                        tooltip() { }
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
            axios.delete.mockResolvedValue({ msg: 'mock' });

            render(DoctorVaccinationsList, {
                global: {
                    plugins: [PrimeVue, ToastService],
                    directives: {
                        tooltip() { }
                    },
                }
            })

            await screen.findByText('John Patient');
            const deleteButtons = screen.getAllByRole('button').filter(el => el.classList.contains('p-button-danger'));
            // the first button is for deleting selected, the second is for canceling the first planned vaccination
            await fireEvent.click(deleteButtons[2]);
            await fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
            expect(axios.delete).toHaveBeenCalledWith("/doctor/vaccination-slots/2");
        });
    });
})