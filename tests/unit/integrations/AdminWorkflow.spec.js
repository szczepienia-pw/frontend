import {
    render,
    screen,
    fireEvent
} from '@testing-library/vue';
import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import App from "@/App.vue"
import router from "@/router/index"
import axios from 'axios';
import {
    formatDate
} from '@/services/helpers';

describe("admin workflow test", () => {
    describe("doctors data table", () => {
        it("test all required functionalities", async () => {
            let mockData = [{
                id: 1,
                firstName: 'john',
                lastName: 'doctor',
                email: 'john@doctor.com'
            }];

            const wrapper = render(App, {
                global: {
                    plugins: [router, PrimeVue, ToastService],
                    directives: {
                        tooltip() {
                            /* stub */
                        }
                    },
                }
            })
            await router.isReady();

            // log in

            await fireEvent.click(screen.getByText('Not a patient?'));
            await fireEvent.click(screen.getByText('Log in as admin'));
            await fireEvent.update(screen.getByLabelText('Email'), 'john@admin.com');
            await fireEvent.update(screen.getByLabelText('Password'), 'password');
            axios.post.mockResolvedValue({
                data: {
                    token: 'token',
                    admin: {}
                }
            })
            axios.get.mockImplementation(() => Promise.resolve({
                data: {
                    pagination: {
                        currentPage: 1,
                        totalPages: 1,
                        currentRecords: mockData.length,
                        totalRecords: mockData.length
                    },
                    data: mockData
                }
            }))
            await fireEvent.click(screen.getByText('Log in'));
            await screen.findByText('john@doctor.com');

            // add new doctor

            await fireEvent.click(screen.getByText('New'))
            await fireEvent.update(screen.getByLabelText('First name'), 'test');
            await fireEvent.update(screen.getByLabelText('Last name'), 'test');
            await fireEvent.update(screen.getByLabelText('Email'), 'test@test.com');
            await fireEvent.update(screen.getByLabelText('Password'), 'test');
            axios.post.mockImplementation((url, data) => {
                mockData = [...mockData, {
                    id: 2,
                    ...data
                }]
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
                    if (el.id == url.slice(-1)) return {
                        id: el.id,
                        ...data
                    };
                    else return el;
                })
                return Promise.resolve()
            })
            await fireEvent.click(screen.getByRole('button', {
                name: 'Save'
            }));
            await screen.findByText('test2@test2.com');

            // delete doctor

            const deleteButtons = screen.getAllByRole('button').filter(el => el.children[0]?.classList.contains('pi-trash'));
            axios.delete.mockImplementation((url) => {
                mockData = mockData.filter(v => v.id != url.slice(-1))
                return Promise.resolve()
            })
            await fireEvent.click(deleteButtons[1]);
            await fireEvent.click(screen.getByRole('button', {
                name: 'Yes'
            }));
            expect(mockData).toHaveLength(1);
        })
    })

    describe("patients data table", () => {
        it("test all required functionalities", async () => {
            let mockData = [{
                id: 1,
                firstName: 'john',
                lastName: 'patient',
                email: 'john@patient.com',
                address: {}
            }];

            const wrapper = render(App, {
                global: {
                    plugins: [router, PrimeVue, ToastService],
                    directives: {
                        tooltip() {
                            /* stub */
                        }
                    },
                }
            })
            await router.isReady();

            axios.get.mockImplementation(() => Promise.resolve({
                data: {
                    pagination: {
                        currentPage: 1,
                        totalPages: 1,
                        currentRecords: mockData.length,
                        totalRecords: mockData.length
                    },
                    data: mockData
                }
            }))
            await fireEvent.click(screen.getByText('Patients'));
            await screen.findByText('john@patient.com');

            // edit patient

            const editButtons = screen.getAllByRole('button').filter(el => el.children[0]?.classList.contains('pi-pencil'));
            await fireEvent.click(editButtons[0]);
            await fireEvent.update(screen.getByLabelText('Email'), 'john2@patient2.com');
            axios.put.mockImplementation((url, data) => {
                mockData = mockData.map(el => {
                    if (el.id == url.slice(-1)) return {
                        ...el,
                        ...data
                    }
                    else return el;
                })
                return Promise.resolve()
            })
            await fireEvent.click(screen.getByRole('button', {
                name: 'Save'
            }));
            await screen.findByText('john2@patient2.com');

            // delete patient

            const deleteButtons = screen.getAllByRole('button').filter(el => el.children[0]?.classList.contains('pi-trash'));
            axios.delete.mockImplementation((url) => {
                mockData = mockData.filter(v => v.id != url.slice(-1))
                return Promise.resolve()
            })
            await fireEvent.click(deleteButtons[1]);
            await fireEvent.click(screen.getByRole('button', {
                name: 'Yes'
            }));
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
                        tooltip() {
                            /* stub */
                        }
                    },
                }
            })
            await router.isReady();

            axios.get.mockImplementation(() => Promise.resolve({
                data: mockData
            }))
            await fireEvent.click(screen.getByText('Settings'));
            await screen.findByText('test@bug.com');
            await fireEvent.click(screen.getByText('test@bug.com'));
            await fireEvent.update(screen.getByRole('textbox'), 'test2@test2.com');
            axios.put.mockImplementation((url, data) => {
                mockData = data;
                return Promise.resolve()
            })
            await fireEvent.click(screen.getByRole('button', {
                name: 'Confirm'
            }));
            expect(mockData.bugEmail).toEqual('test2@test2.com')
        })
    })

    describe("statistics", () => {
        it("test all required functionalities", async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            const mockResponse = {
                diseases: [{
                        name: "COVID19",
                        count: 2,
                        vaccines: [{
                                name: "Johnson&Johnson",
                                count: 1
                            },
                            {
                                name: "Pfizer",
                                count: 1
                            }
                        ]
                    },
                    {
                        name: "COVID21",
                        count: 1,
                        vaccines: [{
                            name: "Razor light",
                            count: 1
                        }]
                    },
                    {
                        name: "Flu",
                        count: 1,
                        vaccines: [{
                            name: "FluMax",
                            count: 1
                        }]
                    }
                ]
            }

            const wrapper = render(App, {
                global: {
                    plugins: [router, PrimeVue, ToastService],
                    directives: {
                        tooltip() {
                            /* stub */
                        }
                    },
                }
            })
            await router.isReady();

            axios.get.mockImplementation(() => Promise.resolve({
                data: mockResponse
            }))
            
            await fireEvent.click(screen.getByText('Statistics'));
            await screen.findByText('Aggregated vaccination data');
            expect(axios.get).toHaveBeenLastCalledWith(expect.stringMatching(/\/admin\/vaccinations\/report\?.+/))
            await fireEvent.click(screen.getByText('Download'));
            expect(axios.get).toHaveBeenLastCalledWith(expect.stringMatching(/\/admin\/vaccinations\/report\/download\?.+/), { responseType: 'blob'})
        })
    })

    describe("vaccinations", () => {
        it("test all required functionalities", async () => {
            const today = new Date();
            const mockResponse = {
                data: {
                    pagination: {
                        currentPage: 1,
                        totalPages: 2,
                        currentRecords: 10,
                        totalRecords: 19,
                    },
                    data: [{
                        id: 1,
                        vaccine: {
                            id: 1,
                            name: "Phizer",
                            disease: "COVID-19",
                            requiredDoses: 2,
                            serialNumber: "000-1311231",
                        },
                        vaccinationSlot: {
                            id: 1,
                            date: today.toISOString(),
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
                                localNumber: "1A",
                            },
                        },
                        doctor: {
                            id: 1,
                            firstName: "Ben",
                            lastName: "Doctor",
                            email: "ben@doctor.com",
                        },
                    }, ],
                },
            };

            const wrapper = render(App, {
                global: {
                    plugins: [router, PrimeVue, ToastService],
                    directives: {
                        tooltip() {
                            /* stub */
                        }
                    },
                }
            })
            await router.isReady();

            axios.get.mockImplementation(() => Promise.resolve(
                mockResponse
            ))
            axios.delete.mockResolvedValue({
                msg: "mock"
            });
            await fireEvent.click(screen.getByText('Vaccinations'));

            await screen.findByText("John Patient");
            await screen.findByText("Planned");
            await screen.findByText("Ben Doctor");
            await screen.findByText("COVID-19");
            await screen.findByText(formatDate(today.toISOString()));

            // details

            const detailsButton = screen.getByTestId("details");
            await fireEvent.click(detailsButton);
            await screen.findByText("john@patient.com");
            await screen.findByText("ben@doctor.com");
            expect(await screen.findAllByText("Ben Doctor")).toHaveLength(2);
            expect(await screen.findAllByText("John Patient")).toHaveLength(2);
            expect(await screen.findAllByText("COVID-19")).toHaveLength(2);
            await screen.findAllByText("Phizer");
            expect(await screen.findAllByText(formatDate(today.toISOString()))).toHaveLength(2);

            // edit date

            const mockSlots = {
                data: [{
                    id: 1,
                    date: today.toISOString(),
                }, ],
            };
            axios.get.mockResolvedValue(mockSlots);
            const rescheduleButton = screen.getByTestId("reschedule");
            expect(rescheduleButton).not.toBeNull();
            await fireEvent.click(rescheduleButton);
            expect(axios.get).toHaveBeenCalledWith("/vaccination-slots");
        })
    })
})