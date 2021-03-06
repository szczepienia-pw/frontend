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

export const confirmVaccinationSlot = (id) => {
	return api.put(`/doctor/vaccination-slots/${id}`, {
		status: "COMPLETED",
	});
};

export const cancelPlannedVaccinationSlot = (id) => {
	return api.put(`/doctor/vaccination-slots/${id}`, {
		status: "CANCELED",
	});
};

export const changeVaccinationSlot = (vaccinationSlotId, vaccinationId) => {
	return api.post(`/doctor/vaccinations/${vaccinationId}/change-slot/`, {
		vaccinationSlotId
	});
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

export const confirmRegistration = (token) => {
	return api.post(`/patient/registration/confirm`, {
		token
	});
};

export const changeData = (data) => {
	return api.put(`/patient/account`, data);
};

export const getVaccinationHistory = (page = 1) => {
	return api.get(`/patient/vaccinations?page=${page}`);
};

export const cancelVaccinationSlot = (id) => {
	return api.delete(`/patient/vaccination-slots/${id}`);
};

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
	return api.get("/vaccination-slots");
};

export const reserveSlot = (vaccinationSlotId, vaccineId) => {
	return api.put(`/patient/vaccination-slots/${vaccinationSlotId}`, {
		vaccineId,
	});
};

export const getPatients = (page = 1) => {
	return api.get(`/admin/patients?page=${page}`);
};

export const editPatient = (id, data) => {
	return api.put(`/admin/patients/${id}`, data);
};

export const deletePatient = (id) => {
	return api.delete(`/admin/patients/${id}`);
};

export const downloadCertificate = (vaccinationId) => {
	return api.get(`/patient/vaccinations/${vaccinationId}/certificate`, {
		responseType: "blob",
	});
};

export const getVaccinations = (page = 1, disease = null, doctorId = null, patientId = null) => {
	return api.get(
		`/admin/vaccinations?page=${page}` +
			`${disease ? "&disease=" + disease : ""}` +
			`${doctorId ? "&doctorId=" + doctorId : ""}` +
			`${patientId ? "&patientId=" + patientId : ""}`
	);
};

export const rescheduleVaccination = (vaccinationSlotId, vaccinationId) => {
	return api.post(`/admin/vaccinations/${vaccinationId}/change-slot/`,{
		vaccinationSlotId
	})
}

export const getVaccinationReport = (startDate, endDate) => {
	return api.get(`/admin/vaccinations/report?startDate=${startDate}&endDate=${endDate}`);
}

export const downloadVaccinationReport = (startDate, endDate) => {
	return api.get(`/admin/vaccinations/report/download?startDate=${startDate}&endDate=${endDate}`, {
		responseType: "blob",
	});
};

export const deleteAccount = () => {
	return api.delete(`/patient/account`);
}