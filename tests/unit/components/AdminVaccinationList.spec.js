import { render, screen, fireEvent } from "@testing-library/vue";
import AdminVaccinationList from "@/components/AdminVaccinationList";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import axios from "axios";
import { formatDate} from "@/services/helpers";

jest.mock("vue-router", () => ({
	useRouter: () => ({
		push: () => mockFn(),
		replace: () => mockFn(),
	}),
    useRoute: jest.fn(() => {
         return {
            query: {
                doctor: 1
            }
        }
    })
}));

const today = new Date();
const mockResponse = {
	data: {
		pagination: {
			currentPage: 1,
			totalPages: 2,
			currentRecords: 10,
			totalRecords: 19,
		},
		data: [
			{
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
			},
		],
	},
};

describe("AdminVaccinationList test", () => {
	describe("when component is rendered", () => {
		it("should correctly show fetched data", async () => {
			axios.get.mockResolvedValue(mockResponse);

			render(AdminVaccinationList, {
				global: {
					plugins: [PrimeVue, ToastService],
					directives: {
						tooltip() {},
					},
				},
			});

			await screen.findByText("John Patient");
			await screen.findByText("Planned");
			await screen.findByText("Ben Doctor");
			await screen.findByText("COVID-19");
            await screen.findByText(formatDate(today.toISOString()));
		});
	});

	describe("when appointment is selected", () => {
		it("should correctly display vaccination details", async () => {
			axios.get.mockResolvedValue(mockResponse);
			axios.delete.mockResolvedValue({ msg: "mock" });

			render(AdminVaccinationList, {
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
			await screen.findByText("ben@doctor.com");
			expect(await screen.findAllByText("Ben Doctor")).toHaveLength(2);
			expect(await screen.findAllByText("John Patient")).toHaveLength(2);
			expect(await screen.findAllByText("COVID-19")).toHaveLength(2);
			await screen.findAllByText("Phizer");
            expect(await screen.findAllByText(formatDate(today.toISOString()))).toHaveLength(2);
		});
	});

    describe("when edit date button is clicked", () => {
		it("should correctly send request", async () => {
			axios.get.mockResolvedValue(mockResponse);
			axios.delete.mockResolvedValue({ msg: "mock" });

			render(AdminVaccinationList, {
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
			const mockSlots = {
				data: [
					{
						id: 1,
						date: today.toISOString(),
					},
				],
			};
			axios.get.mockResolvedValue(mockSlots);
			const rescheduleButton = screen.getByTestId("reschedule");
			expect(rescheduleButton).not.toBeNull();
			await fireEvent.click(rescheduleButton);
			expect(axios.get).toHaveBeenCalledWith("/vaccination-slots");
		});
	});

	describe("misc functionality test", () => {
		it("should correctly sort, filter and mass delete", async () => {
			window.HTMLElement.prototype.scrollIntoView = function() {};
			axios.get.mockResolvedValue(mockResponse);
			axios.put.mockResolvedValue({ msg: "mock" });

			const wrapper = render(AdminVaccinationList, {
				global: {
					plugins: [PrimeVue, ToastService],
					directives: {
                        tooltip() { /* stub */ }
                    },
				},
			});

			await screen.findByText('John Patient');
			await fireEvent.click(screen.getByText('Date'))
			await fireEvent.update(screen.getByPlaceholderText('Search...'), 'John')
			await fireEvent.click(screen.getAllByRole('button')[2])
			await fireEvent.click(screen.getByText('Select disease'))
			await fireEvent.click(screen.getByText('OTHER'))
			await fireEvent.click(screen.getByText('Apply'))
			expect(axios.get).toHaveBeenLastCalledWith("/admin/vaccinations?page=1&disease=OTHER&doctorId=1")
		});
	});
});
