import { render, screen, fireEvent } from '@testing-library/vue';
import DoctorDataTable from '@/components/DoctorDataTable';
import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import axios from 'axios';

jest.mock('vue-router', () => ({
    useRouter: () => ({
        push: () => mockfn,
    }),
}));

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
              email: "john@doctor.com",
              firstName: "John",
              lastName: "Doctor"
            },
            {
              id: 2,
              email: "peter@test.com",
              firstName: "Peter",
              lastName: "Test"
            }
        ]
    }
}

describe("DoctorDataTable test", () => {
    describe("when component is rendered", () => {
        it("should correctly show fetched data", async () => {
            axios.get.mockResolvedValue(mockResponse);

            render(DoctorDataTable, {
                global: {
                    plugins: [PrimeVue, ToastService],
                    directives: {
                        tooltip() { /* stub */ }
                    },
                }
            })

            await screen.findByText('John');
            await screen.findByText('Doctor');
            await screen.findByText('john@doctor.com');
            await screen.findByText('Peter');
            await screen.findByText('Test');
            await screen.findByText('peter@test.com');
        });
    });

    describe("when doctor is deleted", () => {
        it("should correctly send api request", async () => {
            axios.get.mockResolvedValue(mockResponse);
            axios.delete.mockResolvedValue({ msg: 'mock' });

            render(DoctorDataTable, {
                global: {
                    plugins: [PrimeVue, ToastService],
                    directives: {
                        tooltip() { /* stub */ }
                    },
                }
            })

            await screen.findByText('John');
            const deleteButtons = screen.getAllByRole('button').filter(el => el.children[0]?.classList.contains('pi-trash'));
            await fireEvent.click(deleteButtons[1]);
            await fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
            expect(axios.delete).toHaveBeenCalledWith("/admin/doctors/1");
        });
    });

    describe("when doctor is added", () => {
        it("should correctly post data", async () => {
            axios.get.mockResolvedValue(mockResponse);
            axios.post.mockResolvedValue({ msg: 'mock' });

            render(DoctorDataTable, {
                global: {
                    plugins: [PrimeVue, ToastService],
                    directives: {
                        tooltip() { /* stub */ }
                    },
                }
            })

            await screen.findByText('John');
            await fireEvent.click(screen.getByRole('button', { name: 'New' }));
            await fireEvent.update(screen.getByLabelText('First name'), 'test');
            await fireEvent.update(screen.getByLabelText('Last name'), 'test');
            await fireEvent.update(screen.getByLabelText('Email'), 'test');
            await fireEvent.update(screen.getByLabelText('Password'), 'test');
            await fireEvent.click(screen.getByRole('button', { name: 'Save' }));
            expect(axios.post).toHaveBeenCalledWith("/admin/doctors", {
                email: "test",
                firstName: "test",
                lastName: "test",
                password: "test",
            });
        });
    });

    describe("when doctor is edited", () => {
        it("should correctly put data", async () => {
            axios.get.mockResolvedValue(mockResponse);
            axios.put.mockResolvedValue({ msg: 'mock' });

            render(DoctorDataTable, {
                global: {
                    plugins: [PrimeVue, ToastService],
                    directives: {
                        tooltip() { /* stub */ }
                    },
                }
            })

            await screen.findByText('John');
            const editButtons = screen.getAllByRole('button').filter(el => el.children[0]?.classList.contains('pi-pencil'));
            await fireEvent.click(editButtons[0]);
            await fireEvent.update(screen.getByLabelText('First name'), 'test');
            await fireEvent.update(screen.getByLabelText('Last name'), 'test');
            await fireEvent.update(screen.getByLabelText('Email'), 'test');
            await fireEvent.click(screen.getByRole('button', { name: 'Save' }));
            expect(axios.put).toHaveBeenCalledWith("/admin/doctors/1", {
                email: "test",
                firstName: "test",
                lastName: "test",
            });
        });
    });
})