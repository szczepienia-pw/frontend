import { login, createVaccinationSlot, reportBug, getVaccinationSlots, register, deleteVaccinationSlot, changeData, changeAdminSettings, getAdminSettings, confirmVaccinationSlot, cancelPlannedVaccinationSlot, getVaccinationHistory, cancelVaccinationSlot, getDiseases, getVaccines, getSlots, reserveSlot, getPatients, editPatient, deletePatient } from '@/services/api'
import axios from 'axios'
import { saveUserSession } from '@/services/useUserSession'

jest.mock('@/services/useUserSession', () => ({
    useUserSession: () => ({ token: 'mock' }),
    saveUserSession: jest.fn()
}));

describe("api tests", () => {
    describe("when login() call is successful", () => {
        it("should correctly post data and save cookies", async () => {
            const response = {
                data: {
                    token: 'mocked-token'
                }
            }

            axios.post.mockResolvedValue(response);

            await login('patient', 'email', 'password');

            expect(axios.post).toHaveBeenCalledWith(`/patient/login`, {
                email: "email",
                password: "password"
            });
            expect(saveUserSession).toHaveBeenCalled();
        });
    });

    describe("when login() call fails", () => {
        it("should throw", async () => {
            const message = "error";
            axios.post.mockRejectedValueOnce(new Error(message));

            try {
                await login('patient', 'email', 'password');
            } catch (err) {
                expect(err.message).toBe("error")
            }
        });
    });

    describe("when getVaccinationSlots() is called", () => {
        it("should correctly send request", async () => {
            const date = new Date().toISOString();
            await getVaccinationSlots(1, date, date, "1");
            expect(axios.get).toHaveBeenCalledWith(`/doctor/vaccination-slots?page=1&startDate=${date}&endDate=${date}&onlyReserved=1`);
        });
    });

    describe("when createVaccinationSlot() is called", () => {
        it("should correctly post date", async () => {
            const date = new Date().toISOString();
            await createVaccinationSlot(date);
            expect(axios.post).toHaveBeenCalledWith(`/doctor/vaccination-slots`, {
                date: date
            });
        });
    });

    describe("when deleteVaccinationSlot() is called", () => {
        it("should correctly send request", async () => {
            await deleteVaccinationSlot(1);
            expect(axios.delete).toHaveBeenCalledWith("/doctor/vaccination-slots/1");
        });
    });

    describe("when reportBug() is called", () => {
        it("should correctly post bug info", async () => {
            await reportBug('name', 'desc');
            expect(axios.post).toHaveBeenCalledWith(`/bugs`, {
                name: 'name',
                description: 'desc'
            });
        });
    });

    describe("when register() is called", () => {
        it("should correctly post register data", async () => {
            await register('test', 'test', 'test', 'test', 'test', 'test');
            expect(axios.post).toHaveBeenCalledWith(`/patient/registration`, {
                firstName: 'test',
                lastName: 'test',
                pesel: 'test',
                email: 'test',
                password: 'test',
                address: 'test'
            });
        });
    });

    describe("when changeData() is called", () => {
        it("should correctly send request", async () => {
            await changeData('test');
            expect(axios.put).toHaveBeenCalledWith(`/patient/account`, 'test');
        });
    });

    describe("when getAdminSettings() is called", () => {
        it("should correctly send request", async () => {
            await getAdminSettings();
            expect(axios.get).toHaveBeenCalledWith(`/admin/settings`);
        });
    });

    describe("when changeAdminSettings() is called", () => {
        it("should correctly send request", async () => {
            await changeAdminSettings('test');
            expect(axios.put).toHaveBeenCalledWith(`/admin/settings`, {
                bugEmail: 'test'
            });
        });
    });
});

describe("when confirmVaccinationSlot() is called", () => {
    it("should correctly send request", async () => {
        await confirmVaccinationSlot(1);
        expect(axios.put).toHaveBeenCalledWith(`/doctor/vaccination-slots/1`, {
            status: "COMPLETED",
        });
    });
});

describe("when cancelPlannedVaccinationSlot() is called", () => {
    it("should correctly send request", async () => {
        await cancelPlannedVaccinationSlot(1);
        expect(axios.put).toHaveBeenCalledWith(`/doctor/vaccination-slots/1`, {
            status: "CANCELED",
        });
    });
});

describe("when cancelVaccinationSlot() is called", () => {
    it("should correctly send request", async () => {
        await cancelVaccinationSlot(1);
        expect(axios.delete).toHaveBeenCalledWith(`/patient/vaccination-slots/1`)
    });
});

describe("when getVaccinationHistory() is called", () => {
    it("should correctly send request", async () => {
        await getVaccinationHistory(2);
        expect(axios.get).toHaveBeenCalledWith(`/patient/vaccinations?page=2`)
    });
});

describe("when getDiseases() is called", () => {
    it("should correctly send request", async () => {
        const response = getDiseases();
        expect(response).toContain("COVID-19")
        expect(response).toContain("COVID-21")
        expect(response).toContain("Flu")
        expect(response).toContain("OTHER")
    });
});

describe("when getVaccines() is called", () => {
    it("should correctly send request", async () => {
        await getVaccines("OTHER");
        expect(axios.get).toHaveBeenCalledWith(`/patient/vaccines?disease=OTHER`);
    });
});

describe("when getSlots() is called", () => {
    it("should correctly send request", async () => {
        await getSlots();
        expect(axios.get).toHaveBeenCalledWith("/vaccination-slots");
    });
});

describe("when reserveSlot() is called", () => {
    it("should correctly send request", async () => {
        await reserveSlot(1,1);
        expect(axios.put).toHaveBeenCalledWith(`/patient/vaccination-slots/1`, {
            vaccineId: 1,
        });
    });
});

describe("when getPatients() is called", () => {
    it("should correctly send request", async () => {
        await getPatients(1);
        expect(axios.get).toHaveBeenCalledWith(`/admin/patients?page=1`)
    });
});

describe("when editPatient() is called", () => {
    it("should correctly send request", async () => {
        await editPatient(1, {address:{street: "test"}});
        expect(axios.put).toHaveBeenCalledWith(`/admin/patients/1`, {address:{street: "test"}})
    });
});

describe("when deletePatient() is called", () => {
    it("should correctly send request", async () => {
        await deletePatient(1);
        expect(axios.delete).toHaveBeenCalledWith(`/admin/patients/1`)
    });
});