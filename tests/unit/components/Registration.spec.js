import { render, screen, fireEvent, waitFor } from "@testing-library/vue";
import VaccinationSlots from "@/views/patient/registration/VaccinationSlots";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import axios from "axios"; 

const mockFn = jest.fn();

jest.mock('vue-router', () => ({
    useRouter: () => ({
        push: () => mockFn(),
    }),
}));

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

describe("VaccinationSlots test", () => {
	describe("when component is rendered", () => {
		it("should correctly display available days", async () => {
			axios.get.mockResolvedValue(mockResponse);

			render(VaccinationSlots, {
				global: {
					plugins: [PrimeVue, ToastService],
				},
			});

            const date = await waitFor(() => screen.getAllByTestId('date'))
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

            const date = await waitFor(() => screen.getAllByTestId('date'))
            await fireEvent.click(date[0]); 
            await screen.findByText("17:15");
			await screen.findByText("18:15");
            expect(screen.queryByText("16:15")).toBeNull();
			expect(screen.queryByText("19:15")).toBeNull();
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

            const date = await waitFor(() => screen.getAllByTestId('date'))
            await fireEvent.click(date[0]); 
			const next = screen.getByTestId('next-1')
			const slot = await waitFor(() => screen.getByText('17:15'));
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

			const next = screen.getByTestId('next-1')
			expect(next.getAttribute('disabled')).not.toBeNull(); 
		}); 

		it("should not be possible to click on 'Next'", async () => {
			axios.get.mockResolvedValue(mockResponse);

			render(VaccinationSlots, {
				global: {
					plugins: [PrimeVue, ToastService],
				},
			});

			const date = await waitFor(() => screen.getAllByTestId('date'))
            await fireEvent.click(date[0]); 
			const next = screen.getByTestId('next-1')
			expect(next.getAttribute('disabled')).not.toBeNull(); 
		}); 
        
	});
})