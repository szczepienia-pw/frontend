import { render, screen, fireEvent } from "@testing-library/vue";
import PatientDataTable from "@/components/PatientDataTable";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import axios from "axios";

jest.mock('vue-router', () => ({
    useRouter: () => ({
        replace: () => {},
    }),
}));

const mockResponse = {
	data: {
		pagination: {
			currentPage: 1,
			totalPages: 1,
			currentRecords: 2,
			totalRecords: 2,
		},
		data: [
			{
				id: 1,
				firstName: "Ben",
				lastName: "Patient",
				pesel: "003005039981",
				email: "ben@patient.com",
				address: {
					id: 1,
					city: "Biłgoraj",
					zipCode: "23-400",
					street: "Jana Pawła II",
					houseNumber: "20",
					localNumber: "1A",
				},
			},
			{
				id: 2,
				firstName: "John",
				lastName: "Green",
				pesel: "002005039981",
				email: "john.grn@patient.com",
				address: {
					id: 1,
					city: "Biłgoraj",
					zipCode: "23-400",
					street: "Jana Pawła II",
					houseNumber: "20",
					localNumber: "1A",
				},
			},
		],
	},
};

describe("PatientDataTable test", () => {
	describe("when component is rendered", () => {
		it("should correctly show fetched data", async () => {
			axios.get.mockResolvedValue(mockResponse);

			render(PatientDataTable, {
				global: {
					plugins: [PrimeVue, ToastService],
					directives: {
                        tooltip() { /* stub */ }
                    },
				},
			});

			await screen.findByText("Ben");
			await screen.findByText("Patient");
			await screen.findByText("ben@patient.com");
			await screen.findByText("John");
			await screen.findByText("Green");
			await screen.findByText("john.grn@patient.com");
		});
	});

	describe("when patient is deleted", () => {
		it("should correctly send api request", async () => {
			axios.get.mockResolvedValue(mockResponse);
			axios.delete.mockResolvedValue({ msg: "mock" });

			render(PatientDataTable, {
				global: {
					plugins: [PrimeVue, ToastService],
					directives: {
                        tooltip() { /* stub */ }
                    },
				},
			});

			await screen.findByText("Ben");
			const deleteButtons = screen
				.getAllByRole("button")
				.filter((el) => el.children[0]?.classList.contains("pi-trash"));
			await fireEvent.click(deleteButtons[1]);
			await fireEvent.click(screen.getByRole("button", { name: "Yes" }));
			expect(axios.delete).toHaveBeenCalledWith("/admin/patients/1");
		});
	});

	describe("when patient is edited", () => {
		it("should correctly put data", async () => {
			axios.get.mockResolvedValue(mockResponse);
			axios.put.mockResolvedValue({ msg: "mock" });

			render(PatientDataTable, {
				global: {
					plugins: [PrimeVue, ToastService],
					directives: {
                        tooltip() { /* stub */ }
                    },
				},
			});

			await screen.findByText("Ben");
			const editButtons = screen
				.getAllByRole("button")
				.filter((el) => el.children[0]?.classList.contains("pi-pencil"));
			await fireEvent.click(editButtons[0]);
			await fireEvent.update(screen.getByLabelText("First name"), "test");
			await fireEvent.update(screen.getByLabelText("Last name"), "test");
			await fireEvent.update(screen.getByLabelText("Email"), "test");
            await fireEvent.update(screen.getByLabelText("Street"), "test");
            await fireEvent.update(screen.getByLabelText("City"), "test");
            await fireEvent.update(screen.getByLabelText("Local number"), "1");
            await fireEvent.update(screen.getByLabelText("House number"), "1");
            await fireEvent.update(screen.getByLabelText("Zip code"), "12345");
			await fireEvent.click(screen.getByRole("button", { name: "Save" }));
			expect(axios.put).toHaveBeenCalledWith("/admin/patients/1", {
				email: "test",
				firstName: "test",
				lastName: "test",
                address: {
                    street: "test",
                    city: "test",
                    houseNumber: "1",
                    localNumber: "1",
                    zipCode: "12-345"
                }
			});
		});
	});
});
