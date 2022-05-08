import { render, screen, fireEvent, waitFor } from "@testing-library/vue";
import VaccinationSlots from "@/views/patient/registration/VaccinationSlots";
import DiseaseType from "@/views/patient/registration/DiseaseType";
import VaccineTypes from "@/views/patient/registration/VaccineTypes";
import ConfirmPage from "@/views/patient/registration/ConfirmPage";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import axios from "axios";
import { formatDate, formatTime } from "@/services/helpers";

const mockFn = jest.fn();

jest.mock("vue-router", () => ({
	useRouter: () => ({
		push: () => mockFn(),
		replace: () => mockFn(),
	}),
}));

jest.mock('@/services/useVisitRegistration', () => ({
    useVisitRegistration: () => ({
		slot: {
			id: 1,
			date: "2019-08-24T14:15:22Z"
		},
		disease: "COVID-19",
		vaccine: {
			id: 1,
			name: "Pfizer",
			disease: "COVID-19",
			requiredDoses: 2,
			serialNumber: "000-1311231"
		}
	}),
    setVisitRegistration: jest.fn()
}))

describe("VaccinationSlots test", () => {
	const mockResponse = {
		data: [
			{
				id: 1,
				date: "2022-05-23T15:15:22Z",
			},
			{
				id: 2,
				date: "2022-05-23T16:15:22Z",
			},
			{
				id: 3,
				date: "2022-05-24T14:15:22Z",
			},
			{
				id: 4,
				date: "2022-05-25T17:15:22Z",
			},
		],
	};
	describe("when component is rendered", () => {
		it("should correctly display available days", async () => {
			axios.get.mockResolvedValue(mockResponse);

			render(VaccinationSlots, {
				global: {
					plugins: [PrimeVue, ToastService],
				},
			});

			const date = await waitFor(() => screen.getAllByTestId("date"));
			expect(date).toHaveLength(3);
		});
	});

	describe("when slot is selected", () => {
		it("should correctly display available hours", async () => {
			axios.get.mockResolvedValue(mockResponse);

			render(VaccinationSlots, {
				global: {
					plugins: [PrimeVue, ToastService],
				},
			});

			const date = await waitFor(() => screen.getAllByTestId("date"));
			await fireEvent.click(date[0]);
			await screen.findByText(formatTime(mockResponse.data[0].date))
            await screen.findByText(formatTime(mockResponse.data[1].date))
			expect(screen.queryByText(formatTime(mockResponse.data[2].date))).toBeNull();
			expect(screen.queryByText(formatTime(mockResponse.data[3].date))).toBeNull();
		});
	});
	describe("when slot is selected", () => {
		it("should enable clicking on 'Next' and push new route", async () => {
			axios.get.mockResolvedValue(mockResponse);

			render(VaccinationSlots, {
				global: {
					plugins: [PrimeVue, ToastService],
				},
			});

			const date = await waitFor(() => screen.getAllByTestId("date"));
			await fireEvent.click(date[0]);
			const next = screen.getByTestId("next-1");
			const slot = await waitFor(() => screen.getByText(formatTime(mockResponse.data[0].date)));
			await fireEvent.click(slot);
			await fireEvent.click(next);
			expect(mockFn).toHaveBeenCalled();
		});
	});

	describe("when slot is not selected", () => {
		it("should not be possible to click on 'Next'", async () => {
			axios.get.mockResolvedValue(mockResponse);

			render(VaccinationSlots, {
				global: {
					plugins: [PrimeVue, ToastService],
				},
			});

			const next = screen.getByTestId("next-1");
			expect(next.getAttribute("disabled")).not.toBeNull();
		});

		it("should not be possible to click on 'Next'", async () => {
			axios.get.mockResolvedValue(mockResponse);

			render(VaccinationSlots, {
				global: {
					plugins: [PrimeVue, ToastService],
				},
			});

			const date = await waitFor(() => screen.getAllByTestId("date"));
			await fireEvent.click(date[0]);
			const next = screen.getByTestId("next-1");
			expect(next.getAttribute("disabled")).not.toBeNull();
		});
	});
});

describe("Disease type test", () => {
	const mockResponse = ["COVID-19", "COVID-21", "Flu", "OTHER"];
	describe("when component is rendered", () => {
		it("should correctly display available diseases", async () => {
			axios.get.mockResolvedValue(mockResponse);

			render(DiseaseType, {
				global: {
					plugins: [PrimeVue, ToastService],
				},
			});

			await screen.findByText("OTHER");
			await screen.findByText("Flu");
			await screen.findByText("COVID-19");
			await screen.findByText("COVID-21");
		});
	});

	describe("when disease is selected", () => {
		it("should enable clicking on 'Next' and push new route", async () => {
			axios.get.mockResolvedValue(mockResponse);

			render(DiseaseType, {
				global: {
					plugins: [PrimeVue, ToastService],
				},
			});

			const next = await screen.findByTestId("next-2");
			const disease = await waitFor(() => screen.getByText("COVID-19"));
			await fireEvent.click(disease);
			await fireEvent.click(next);
			expect(mockFn).toHaveBeenCalled();
		});
	});

	describe("when disease is not selected", () => {
		it("should not be possible to click on 'Next'", async () => {
			axios.get.mockResolvedValue(mockResponse);

			render(DiseaseType, {
				global: {
					plugins: [PrimeVue, ToastService],
				},
			});

			const next = await screen.findByTestId("next-2");
			expect(next.getAttribute("disabled")).not.toBeNull();
		});

		it("should not be possible to click on 'Next'", async () => {
			axios.get.mockResolvedValue(mockResponse);

			render(DiseaseType, {
				global: {
					plugins: [PrimeVue, ToastService],
				},
			});

			const next = screen.getByTestId("next-2");
			expect(next.getAttribute("disabled")).not.toBeNull();
		});
	});
});

describe("Vaccine type test", () => {
	const mockResponse = {
		data: {
			vaccines: [
				{
					id: 1,
					name: "Pfizer",
					disease: "COVID-19",
					requiredDoses: 2,
				},
				{
					id: 2,
					name: "Moderna",
					disease: "COVID-19",
					requiredDoses: 2,
				},
			],
		},
	};
	describe("when component is rendered", () => {
		it("should correctly display available vaccines", async () => {
			axios.get.mockResolvedValue(mockResponse);
			
			render(VaccineTypes, {
				global: {
					plugins: [PrimeVue, ToastService],
				},
			});
			
			await fireEvent.click(screen.getByText("Select vaccine"));
			await screen.findByText("Pfizer");
			await screen.findByText("Moderna");
		});
	});

	describe("when vaccine is selected", () => {
		window.HTMLElement.prototype.scrollIntoView = function () { };
		it("should enable clicking on 'Next' and push new route", async () => {
			axios.get.mockResolvedValue(mockResponse);

			render(VaccineTypes, {
				global: {
					plugins: [PrimeVue, ToastService],
				},
			});

			await fireEvent.click(screen.getByText("Select vaccine"));
			await fireEvent.click(screen.getByText("Pfizer"));
			await fireEvent.click(screen.getByText("Next"));
			expect(mockFn).toHaveBeenCalled();
		});
	});

	describe("when vaccine is not selected", () => {
		it("should not be possible to click on 'Next'", async () => {
			axios.get.mockResolvedValue(mockResponse);

			render(VaccineTypes, {
				global: {
					plugins: [PrimeVue, ToastService],
				},
			});

			const next = await screen.findByTestId("next-3");
			expect(next.getAttribute("disabled")).not.toBeNull();
		});
	});
});


describe("Confirmation test", () => {
	describe("when component is rendered", () => {
		it("should correctly display collected data", async () => {
			
			render(ConfirmPage, {
				global: {
					plugins: [PrimeVue, ToastService],
				},
			});
			await screen.findByText(`Date: ${formatDate('2019-08-24T14:15:22Z')}`);
			await screen.findByText("Vaccine: Pfizer");
			await screen.findByText("Disease: COVID-19");
		});
	});

	describe("when data is correct and confirm pressed", () => {
		window.HTMLElement.prototype.scrollIntoView = function () { };
		it("should send proper request", async () => {

			render(ConfirmPage, {
				global: {
					plugins: [PrimeVue, ToastService],
				},
			});
			axios.put.mockResolvedValue({});
			await fireEvent.click(screen.getByText("Confirm"));
			expect(axios.put).toHaveBeenCalledWith(`/patient/vaccination-slots/1`, {
				vaccineId: 1,
			});
		});
	});
});
