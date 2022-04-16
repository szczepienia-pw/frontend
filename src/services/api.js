import axios from "axios";
import { saveUserSession, useUserSession } from "@/services/useUserSession";

const userSession = useUserSession();

const api = axios.create({
	baseURL: "https://localhost:7229",
	timeout: 5000,
	headers: {
		Authorization: userSession.token,
	},
});

const setTokenAndCookies = (userType, token, userInfo = {}) => {
	api.defaults.headers["Authorization"] = token;
	userSession.token = token;
	userSession.userType = userType;
	userSession.userInfo = userInfo;
	saveUserSession();
};

export const login = (userType, email, password) => {
	return api
		.post(`/${userType}/login`, {
			email,
			password,
		})
		.then((response) => {
			setTokenAndCookies(userType, response.data.token, response.data?.[userType]);
		});
};

export const getVaccinationSlots = (page = 1, startDate = null, endDate = null, onlyReserved = null) => {
	return api.get(
		`/doctor/vaccination-slots?page=${page}` +
			`${startDate ? "&startDate=" + startDate : ""}` +
			`${endDate ? "&endDate=" + endDate : ""}` +
			`${onlyReserved ? "&onlyReserved=" + onlyReserved : ""}`
	);
};

export const getDoctors = (page = 1) => {
	return api.get(`/admin/doctors?page=${page}`);
};

export const createDoctor = (firstName, lastName, email, password) => {
	return api.post("/admin/doctors", {
		firstName,
		lastName,
		email,
		password,
	});
};

export const editDoctor = (id, firstName, lastName, email) => {
	return api.put(`/admin/doctors/${id}`, {
		firstName,
		lastName,
		email,
	});
};

export const deleteDoctor = (id) => {
	return api.delete(`/admin/doctors/${id}`);
};

export const createVaccinationSlot = (date) => {
	return api.post("/doctor/vaccination-slots", {
		date,
	});
};

export const deleteVaccinationSlot = (id) => {
	return api.delete(`/doctor/vaccination-slots/${id}`);
};

export const reportBug = (name, description) => {
	return api.post(`/bugs`, {
		name,
		description,
	});
};

export const register = (firstName, lastName, pesel, email, password, address) => {
	return api.post(`/patient/registration`, {
		firstName,
		lastName,
		pesel,
		email,
		password,
		address,
	});
};

export const changeData = (data) => {
	return api.put(`/patient/account`, data);
};

export const getVaccinationHistory = (page = 1) => {
    return new Promise((resolve) => {
        setTimeout(function() {
          resolve({ data: {
              pagination: {
                currentPage: page,
                totalPages: page+1,
                currentRecords: 3,
                totalRecords: 6,
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
                        date: "2019-08-24T14:15:22Z",
                    },
                    status: "Canceled",
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
                            localNumber: "1A",
                        },
                    },
                    doctor: {
                        id: 1,
                        firstName: "Dr John",
                        lastName: "Doe",
                        email: "john.doe@doctor.com",
                    },
                },
                {
                    id: 2,
                    vaccine: {
                        id: 2,
                        name: "Phizer2",
                        disease: "COVID-19",
                        requiredDoses: 2,
                        serialNumber: "000-1311231",
                    },
                    vaccinationSlot: {
                        id: 2,
                        date: "2019-08-25T14:15:22Z",
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
                            localNumber: "1A",
                        },
                    },
                    doctor: {
                        id: 2,
                        firstName: "Dr John2",
                        lastName: "Doe",
                        email: "john.doe@doctor.com",
                    },
                },
                {
                    id: 3,
                    vaccine: {
                        id: 3,
                        name: "Phizer3",
                        disease: "COVID-19",
                        requiredDoses: 2,
                        serialNumber: "000-1311231",
                    },
                    vaccinationSlot: {
                        id: 3,
                        date: "2019-08-26T14:15:22Z",
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
                            localNumber: "1A",
                        },
                    },
                    doctor: {
                        id: 3,
                        firstName: "Dr John3",
                        lastName: "Doe",
                        email: "john.doe@doctor.com",
                    },
                }
              ]
          }})
        }, 1000);
      });
    //return api.get(`/patient/vaccinations?page=${page}`)
}

export const cancelVaccinationSlot = (id) => {
    return api.delete(`/patient/vaccination-slots/${id}`);
}

export const getAdminSettings = () => {
	return api.get(`/admin/settings`);
};

export const changeAdminSettings = (bugEmail) => {
	return api.put(`/admin/settings`, {
		bugEmail,
	});
};

export const getDiseases = () => {
	return ["COVID-19", "COVID-21", "Flu", "OTHER"];
};

export const getVaccines = (disease) => {
	return api.get(`/patient/vaccines?disease=${disease}`);
};

export const getSlots = () => {
	return api.get("/patient/vaccination-slots");
};

export const reserveSlot = (vaccinationSlotId, vaccineId) => {
	return api.put(`/patient/vaccination-slots/${vaccinationSlotId}`, {
		vaccineId,
	});
};