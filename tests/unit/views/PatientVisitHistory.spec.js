import { render, screen, fireEvent } from '@testing-library/vue';
import VisitHistory from '@/views/patient/VisitHistory';
import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import axios from 'axios';
import { formatDate } from '@/services/helpers';

const mockResponse = {
    data: {
        pagination: {
            currentPage: 1,
            totalPages: 1,
            currentRecords: 2,
            totalRecords: 2
        },
        data: [
            {
                id: 1,
                vaccine: {
                    id: 1,
                    name: "Phizer",
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
            },
            {
                id: 2,
                vaccine: {
                    id: 2,
                    name: "Phizer2",
                    disease: "COVID-192",
                    requiredDoses: 2,
                    serialNumber: "000-1311232"
                },
                vaccinationSlot: {
                    id: 2,
                    date: "2019-09-24T14:15:22Z"
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
                    id: 2,
                    firstName: "Dr John2",
                    lastName: "Doe2",
                    email: "john.doe2@doctor.com"
                }
            }
        ]
    }
}

describe("VisitHistory test", () => {
    describe("when component is rendered", () => {
        it("should correctly show fetched data", async () => {
            axios.get.mockResolvedValue(mockResponse);

            render(VisitHistory, {
                global: {
                    plugins: [PrimeVue, ToastService]
                }
            })

            await screen.findByText(formatDate(mockResponse.data.data[0].vaccinationSlot.date));
            await screen.findByText(mockResponse.data.data[0].vaccine.name);
            await screen.findByText(mockResponse.data.data[0].vaccine.disease);
            await screen.findByText(formatDate(mockResponse.data.data[1].vaccinationSlot.date));
            await screen.findByText(mockResponse.data.data[1].vaccine.name);
            await screen.findByText(mockResponse.data.data[1].vaccine.disease);
        });
    });

    describe("when visit is clicked", () => {
        it("should correctly show details", async () => {
            axios.get.mockResolvedValue(mockResponse);

            render(VisitHistory, {
                global: {
                    plugins: [PrimeVue, ToastService]
                }
            })

            await screen.findByText(mockResponse.data.data[0].vaccine.name);
            await fireEvent.click(screen.getByText(mockResponse.data.data[0].vaccine.name));
            const name = await screen.findAllByText(mockResponse.data.data[0].vaccine.name);
            expect(name.length).toEqual(2);
            const disease = await screen.findAllByText(mockResponse.data.data[0].vaccine.disease);
            expect(disease.length).toEqual(2);
            await screen.findByText(mockResponse.data.data[0].vaccine.requiredDoses);
            const date = await screen.findAllByText(formatDate(mockResponse.data.data[0].vaccinationSlot.date));
            expect(date.length).toEqual(2);
            await screen.findByText(mockResponse.data.data[0].status);
            await screen.findByText(mockResponse.data.data[0].doctor.firstName + ' ' + mockResponse.data.data[0].doctor.lastName);
            await screen.findByText(mockResponse.data.data[0].doctor.email);
        });
    });

    describe("when visit is canceled", () => {
        it("should correctly send request", async () => {
            axios.get.mockResolvedValue(mockResponse);
            axios.delete.mockResolvedValue('mock');

            render(VisitHistory, {
                global: {
                    plugins: [PrimeVue, ToastService]
                }
            })

            await screen.findByText(mockResponse.data.data[1].vaccine.name);
            await fireEvent.click(screen.getByText(mockResponse.data.data[1].vaccine.name));
            await fireEvent.click(screen.getByRole('button', { name: 'Cancel visit' }));
            await fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
            expect(axios.delete).toBeCalledWith('/patient/vaccination-slots/2');
        });
    });
})