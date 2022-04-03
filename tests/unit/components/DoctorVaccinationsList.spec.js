import { render, screen, waitFor } from '@testing-library/vue';
import DoctorVaccinationsList from '@/components/DoctorVaccinationsList';
import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import axios from 'axios';
import { fireEvent } from '@testing-library/dom';

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
            date: "2019-08-24T14:15:22Z",
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
            date: "2020-08-24T15:15:22Z",
        }]
    }
}

describe("DoctorVaccinationsList test", () => {
    describe("when component is rendered", () => {
        it("should correctly show fetched data", async () => {
            axios.get.mockResolvedValue(mockResponse);

            render(DoctorVaccinationsList, {
                global: {
                    plugins: [PrimeVue, ToastService]
                }
            })

            await screen.findByText('John Patient');
            await screen.findByText('Planned');
            await screen.findByText('16:15');
            await screen.findByText('17:15');
            await screen.findByText('Free');
        });
    });

    describe("when slot is deleted", () => {
        it("should correctly send api request", async () => {
            axios.get.mockResolvedValue(mockResponse);
            axios.delete.mockResolvedValue({ msg: 'mock' });

            render(DoctorVaccinationsList, {
                global: {
                    plugins: [PrimeVue, ToastService]
                }
            })

            await screen.findByText('17:15');
            const deleteButtons = screen.getAllByRole('button').filter(el => el.children[0]?.classList.contains('pi-trash'));
            await fireEvent.click(deleteButtons[1]);
            await fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
            expect(axios.delete).toHaveBeenCalledWith("/doctor/vaccination-slots/2");
        });
    });
})