import { render, screen, fireEvent } from "@testing-library/vue";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import RegistrationPage from "@/views/patient/registration/RegistrationPage";
import router from "@/router/index";
import axios from "axios";

var mockUserInfo = {
    firstName: "John",
    lastName: "Doe",
    password: "Super-Strong-Password#123",
    address: {
        city: "Warszawa",
        zipCode: "01-202",
        street: "Jaktorowska",
        houseNumber: "14",
        localNumber: "5a"
    }
}

jest.mock('@/services/useUserSession', () => ({
    useUserSession: () => ({ token: 'mock token', userType: 'patient', isLoggedIn: true, userInfo: mockUserInfo }),
    saveUserSession: jest.fn()
}))
describe("vaccine registration workflow test", () => {
	it("allows all required functionalities", async () => {
		const slots = {
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

		const diseases = ["COVID-19", "COVID-21", "Flu", "OTHER"];

		const vaccines = {
			data: {
				vaccines: [
					{
						id: 1,
						name: "Phizer",
						disease: "COVID-19",
						requiredDoses: 2,
					},
				],
			},
		};

		const wrapper = render(RegistrationPage, {
			global: {
				plugins: [router, PrimeVue, ToastService],
				directives: {
					tooltip() {
						/* stub */
					},
				},
			},
		});
		await router.isReady();
        screen.debug();
		// log in

	// 	await fireEvent.click(screen.getByText("Not a patient?"));
	// 	await fireEvent.click(screen.getByText("Log in as doctor"));
	// 	await fireEvent.update(screen.getByLabelText("Email"), "john@doctor.com");
	// 	await fireEvent.update(screen.getByLabelText("Password"), "password");
	// 	axios.post.mockResolvedValue({ data: { token: "token", doctor: { firstName: "John", lastName: "Doctor" } } });
	// 	axios.get.mockImplementation(() =>
	// 		Promise.resolve({
	// 			data: {
	// 				pagination: {
	// 					currentPage: 1,
	// 					totalPages: 1,
	// 					currentRecords: vaccinations.length,
	// 					totalRecords: vaccinations.length,
	// 				},
	// 				data: vaccinations,
	// 			},
	// 		})
	// 	);
	// 	await fireEvent.click(screen.getByRole("button", { name: "Log in" }));
	// 	await screen.findByText("Add new vaccination slot");

	// 	// add new slot

	// 	const calendarButtons = screen
	// 		.getAllByRole("button")
	// 		.filter((el) => el.children[0]?.classList.contains("pi-calendar"));
	// 	await fireEvent.click(calendarButtons[1]);
	// 	// click the current day
	// 	const today = new Date();
	// 	const date = today.toISOString();
	// 	await fireEvent.click(screen.getAllByText(today.getDate())[0]);
	// 	axios.post.mockImplementation((url, data) => {
	// 		vaccinations = [...vaccinations, { date: data.date, id: 5 }];
	// 		return Promise.resolve();
	// 	});
	// 	await fireEvent.click(screen.getByRole("button", { name: "Submit" }));
	// 	await screen.findByText("Free");
	// 	expect(vaccinations).toHaveLength(2);

	// 	// delete slot

	// 	const deleteButtons = screen
	// 		.getAllByRole("button")
	// 		.filter((el) => el.children[0]?.classList.contains("delete"));
	// 	await fireEvent.click(deleteButtons[0]);
	// 	axios.delete.mockImplementation((url) => {
	// 		vaccinations = vaccinations.filter((v) => v.id != url.slice(-1));
	// 		return Promise.resolve();
	// 	});
	// 	await fireEvent.click(screen.getByRole("button", { name: "Yes" }));
	// 	expect(vaccinations).toHaveLength(1);
	// 	await screen.findByText("Planned");

	// 	// confirm slot

	// 	const confirmButtons = screen
	// 		.getAllByRole("button")
	// 		.filter((el) => el.children[0]?.classList.contains("pi-check"));
	// 	await fireEvent.click(confirmButtons[0]);
	// 	axios.put.mockImplementation((url, data) => {
	// 		vaccinations = vaccinations.map((el) => {
	// 			if (el.id == url.slice(-1)) return { ...el, vaccination: { status: "Completed" } };
	// 			else return el;
	// 		});
	// 		return Promise.resolve();
	// 	});
	// 	await fireEvent.click(screen.getByRole("button", { name: "Yes" }));
	// 	expect(vaccinations.filter((el) => el.vaccination.status == "Completed")).toHaveLength(1);
	 });
});
