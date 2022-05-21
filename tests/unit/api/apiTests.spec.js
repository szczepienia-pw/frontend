import * as Api from "@/services/api";
import axios from "axios";
import { saveUserSession } from "@/services/useUserSession";

jest.mock("@/services/useUserSession", () => ({
	useUserSession: () => ({ token: "mock" }),
	saveUserSession: jest.fn(),
}));

describe("api tests", () => {
	describe("when login() call is successful", () => {
		it("should correctly post data and save cookies", async () => {
			const response = {
				data: {
					token: "mocked-token",
				},
			};

			axios.post.mockResolvedValue(response);

			await Api.login("patient", "email", "password");

			expect(axios.post).toHaveBeenCalledWith(`/patient/login`, {
				email: "email",
				password: "password",
			});
			expect(saveUserSession).toHaveBeenCalled();
		});
	});

	describe("when login() call fails", () => {
		it("should throw", async () => {
			const message = "error";
			axios.post.mockRejectedValueOnce(new Error(message));

			try {
				await Api.login("patient", "email", "password");
			} catch (err) {
				expect(err.message).toBe("error");
			}
		});
	});

	describe("when getVaccinationSlots() is called", () => {
		it("should correctly send request", async () => {
			const date = new Date().toISOString();
			await Api.getVaccinationSlots(1, date, date, "1");
			expect(axios.get).toHaveBeenCalledWith(
				`/doctor/vaccination-slots?page=1&startDate=${date}&endDate=${date}&onlyReserved=1`
			);
		});
	});

	describe("when createVaccinationSlot() is called", () => {
		it("should correctly post date", async () => {
			const date = new Date().toISOString();
			await Api.createVaccinationSlot(date);
			expect(axios.post).toHaveBeenCalledWith(`/doctor/vaccination-slots`, {
				date: date,
			});
		});
	});

	describe("when deleteVaccinationSlot() is called", () => {
		it("should correctly send request", async () => {
			await Api.deleteVaccinationSlot(1);
			expect(axios.delete).toHaveBeenCalledWith("/doctor/vaccination-slots/1");
		});
	});

	describe("when confirmVaccinationSlot() is called", () => {
		it("should correctly send request", async () => {
			await Api.confirmVaccinationSlot(1);
			expect(axios.put).toHaveBeenCalledWith("/doctor/vaccination-slots/1", { status: "COMPLETED" });
		});
	});

	describe("when cancelPlannedVaccinationSlot() is called", () => {
		it("should correctly send request", async () => {
			await Api.cancelPlannedVaccinationSlot(1);
			expect(axios.put).toHaveBeenCalledWith("/doctor/vaccination-slots/1", { status: "CANCELED" });
		});
	});

	describe("when getDoctors() is called", () => {
		it("should correctly send request", async () => {
			await Api.getDoctors();
			expect(axios.get).toHaveBeenCalledWith("/admin/doctors?page=1");
		});
	});

	describe("when createDoctor() is called", () => {
		it("should correctly post doctor info", async () => {
			await Api.createDoctor("test", "test", "test", "test");
			expect(axios.post).toHaveBeenCalledWith(`/admin/doctors`, {
				firstName: "test",
				lastName: "test",
				email: "test",
				password: "test",
			});
		});
	});

	describe("when editDoctor() is called", () => {
		it("should correctly put doctor info", async () => {
			await Api.editDoctor(0, "test", "test", "test");
			expect(axios.put).toHaveBeenCalledWith(`/admin/doctors/0`, {
				firstName: "test",
				lastName: "test",
				email: "test",
			});
		});
	});

	describe("when deleteDoctor() is called", () => {
		it("should correctly send request", async () => {
			await Api.deleteDoctor(1);
			expect(axios.delete).toHaveBeenCalledWith("/admin/doctors/1");
		});
	});

	describe("when reportBug() is called", () => {
		it("should correctly post bug info", async () => {
			await Api.reportBug("name", "desc");
			expect(axios.post).toHaveBeenCalledWith(`/bugs`, {
				name: "name",
				description: "desc",
			});
		});
	});

	describe("when register() is called", () => {
		it("should correctly post register data", async () => {
			await Api.register("test", "test", "test", "test", "test", "test");
			expect(axios.post).toHaveBeenCalledWith(`/patient/registration`, {
				firstName: "test",
				lastName: "test",
				pesel: "test",
				email: "test",
				password: "test",
				address: "test",
			});
		});
	});

	describe("when changeData() is called", () => {
		it("should correctly send request", async () => {
			await Api.changeData("test");
			expect(axios.put).toHaveBeenCalledWith(`/patient/account`, "test");
		});
	});

	describe("when getVaccinationHistory() is called", () => {
		it("should correctly send request", async () => {
			await Api.getVaccinationHistory();
			expect(axios.get).toHaveBeenCalledWith(`/patient/vaccinations?page=1`);
		});
	});

	describe("when cancelVaccinationSlot() is called", () => {
		it("should correctly send request", async () => {
			await Api.cancelVaccinationSlot(0);
			expect(axios.delete).toHaveBeenCalledWith(`/patient/vaccination-slots/0`);
		});
	});

	describe("when getAdminSettings() is called", () => {
		it("should correctly send request", async () => {
			await Api.getAdminSettings();
			expect(axios.get).toHaveBeenCalledWith(`/admin/settings`);
		});
	});

	describe("when changeAdminSettings() is called", () => {
		it("should correctly send request", async () => {
			await Api.changeAdminSettings("test");
			expect(axios.put).toHaveBeenCalledWith(`/admin/settings`, {
				bugEmail: "test",
			});
		});
	});

	describe("when getVaccines() is called", () => {
		it("should correctly send request", async () => {
			await Api.getVaccines("test");
			expect(axios.get).toHaveBeenCalledWith("/patient/vaccines?disease=test");
		});
	});

	describe("when getSlots() is called", () => {
		it("should correctly send request", async () => {
			await Api.getSlots();
			expect(axios.get).toHaveBeenCalledWith("/vaccination-slots");
		});
	});

	describe("when reserveSlot() is called", () => {
		it("should correctly send request", async () => {
			await Api.reserveSlot(0, 0);
			expect(axios.put).toHaveBeenCalledWith("/patient/vaccination-slots/0", { vaccineId: 0 });
		});
	});

	describe("when getPatients() is called", () => {
		it("should correctly send request", async () => {
			await Api.getPatients();
			expect(axios.get).toHaveBeenCalledWith("/admin/patients?page=1");
		});
	});

	describe("when editPatient() is called", () => {
		it("should correctly put patient info", async () => {
			await Api.editPatient(0, {});
			expect(axios.put).toHaveBeenCalledWith(`/admin/patients/0`, {});
		});
	});

	describe("when rescheduleVaccination() is called", () => {
		it("should correctly send request", async () => {
			await Api.rescheduleVaccination(1, 1);
			expect(axios.post).toHaveBeenCalledWith(`/admin/vaccinations/1/change-slot/`, {
				vaccinationSlotId: 1,
			});
		});
	});
    
	describe("when deletePatient() is called", () => {
		it("should correctly send request", async () => {
			await Api.deletePatient(1);
			expect(axios.delete).toHaveBeenCalledWith("/admin/patients/1");
		});
	});

	describe("when deleteAccount() is called", () => {
		it("should correctly send request", async () => {
			await Api.deleteAccount();
			expect(axios.delete).toHaveBeenCalledWith(`/patient/account`);
		});
	});
});
