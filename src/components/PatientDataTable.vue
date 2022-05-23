<template>
	<div>
		<div class="card">
			<DataTable
				ref="dt"
				:value="patients"
				v-model:selection="selectedPatients"
				dataKey="id"
				paginator
				:filters="filters"
				:loading="loading"
				lazy
				paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
				currentPageReportTemplate="Showing {first} to {last} of {totalRecords} patients"
				responsiveLayout="scroll"
				:rows="pageSize"
				:totalRecords="pagination.totalRecords"
				@page="loadPatients($event.page + 1)"
				@sort="onSort">
				<template #header>
					<div class="table-header flex flex-column md:flex-row md:justify-content-between">
						<div class="flex-start">
							<h5 class="mb-2 md:m-0 p-as-md-center">Manage patients</h5>
						</div>
						<div class="flex-end">
							<Button
								label="Delete"
								icon="pi pi-trash"
								class="p-button-danger"
								@click="confirmDeleteSelected"
								:disabled="!selectedPatients || !selectedPatients.length" />
							<div class="p-input-icon-left ml-5">
								<i class="pi pi-search" />
								<InputText
									v-model="filters['global'].value"
									placeholder="Search..."
									@input="onSearch" />
							</div>
						</div>
					</div>
				</template>

				<Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
				<Column field="id" header="ID" :sortable="true" style="min-width: 12rem"></Column>
				<Column field="firstName" header="First name" :sortable="true" style="min-width: 12rem"></Column>
				<Column field="lastName" header="Last name" :sortable="true" style="min-width: 16rem"></Column>
				<Column field="email" header="Email" :sortable="true" style="min-width: 8rem"></Column>
				<Column :exportable="false" style="min-width: 8rem">
					<template #body="slotProps">
						<Button
							icon="pi pi-pencil"
							class="p-button-rounded mr-2"
							@click="startEditingPatient(slotProps.data)" />
						<Button
							icon="pi pi-trash"
							class="p-button-danger p-button-rounded"
							@click="confirmDeletePatient(slotProps.data)" />
					</template>
				</Column>
				<template #paginatorstart>
					<Button
						type="button"
						icon="pi pi-refresh"
						class="p-button-text"
						@click="loadPatients(pagination.currentPage)" />
				</template>
				<template #paginatorend>
					<!-- leave empty for correct margins -->
				</template>
			</DataTable>
		</div>

		<Dialog
			v-model:visible="patientDialog"
			:style="{ width: '450px' }"
			header="Patient Details"
			:modal="true"
			class="p-fluid">
			<img
				src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"
				:alt="patient.image"
				class="patient-image"
				v-if="patient.image" />
			<div class="field">
				<label for="firstName">First name</label>
				<InputText
					id="firstName"
					v-model.trim="patient.firstName"
					required="true"
					autofocus
					:class="{ 'p-invalid': submitted && !patient.firstName }" />
				<small class="p-error" v-if="submitted && !patient.firstName">First name is required.</small>
			</div>
			<div class="field">
				<label for="lastName">Last name</label>
				<InputText
					id="lastName"
					v-model.trim="patient.lastName"
					required="true"
					autofocus
					:class="{ 'p-invalid': submitted && !patient.lastName }" />
				<small class="p-error" v-if="submitted && !patient.lastName">Last name is required.</small>
			</div>
			<div class="field">
				<label for="email">Email</label>
				<InputText
					id="email"
					v-model.trim="patient.email"
					required="true"
					autofocus
					:class="{ 'p-invalid': submitted && !patient.email }" />
				<small class="p-error" v-if="submitted && !patient.email">Email is required.</small>
			</div>
			<div class="field">
				<label for="city">City</label>
				<InputText
					id="city"
					v-model.trim="patient.address.city"
					required="true"
					autofocus
					:class="{ 'p-invalid': submitted && !patient.address.city }" />
				<small class="p-error" v-if="submitted && !patient.address.city">City is required.</small>
			</div>
			<div class="field">
				<label for="zipCode">Zip code</label>
				<InputMask
					mask="99-999"
					id="zipCode"
					v-model.trim="patient.address.zipCode"
					required="true"
					autofocus
					:class="{ 'p-invalid': submitted && !patient.address.zipCode }" />
				<small class="p-error" v-if="submitted && !patient.address.zipCode">Zip code is required.</small>
			</div>
			<div class="field">
				<label for="street">Street</label>
				<InputText
					id="street"
					v-model.trim="patient.address.street"
					required="true"
					autofocus
					:class="{ 'p-invalid': submitted && !patient.address.street }" />
				<small class="p-error" v-if="submitted && !patient.address.street">Street is required.</small>
			</div>
			<div class="field">
				<label for="houseNumber">House number</label>
				<InputText
					id="houseNumber"
					v-model.trim="patient.address.houseNumber"
					required="true"
					autofocus
					:class="{ 'p-invalid': submitted && !patient.address.houseNumber }" />
				<small class="p-error" v-if="submitted && !patient.address.houseNumber">City is required.</small>
			</div>
			<div class="field">
				<label for="localNumber">Local number</label>
				<InputText
					id="localNumber"
					v-model.trim="patient.address.localNumber"
					required="true"
					autofocus
					:class="{ 'p-invalid': submitted && !patient.address.localNumber }" />
				<small class="p-error" v-if="submitted && !patient.address.localNumber">City is required.</small>
			</div>
			<template #footer>
				<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
				<Button label="Save" icon="pi pi-check" class="p-button-text" @click="() => saveEditedPatient()" />
			</template>
		</Dialog>

		<Dialog v-model:visible="deletePatientDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
			<div class="confirmation-content">
				<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
				<span v-if="patient">
					Are you sure you want to delete
					<b>{{ patient.firstName }} {{ patient.lastName }}</b>
					?
				</span>
			</div>
			<template #footer>
				<Button label="No" icon="pi pi-times" class="p-button-text" @click="deletePatientDialog = false" />
				<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deletePatientCallback" />
			</template>
		</Dialog>

		<Dialog v-model:visible="deletePatientsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
			<div class="confirmation-content">
				<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
				<span v-if="patient">Are you sure you want to delete the selected patients?</span>
			</div>
			<template #footer>
				<Button label="No" icon="pi pi-times" class="p-button-text" @click="deletePatientsDialog = false" />
				<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedPatientsCallback" />
			</template>
		</Dialog>
	</div>
</template>

<script setup>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";
import { ref, onMounted } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { getPatients, deletePatient, editPatient } from "@/services/api";
import { errorToast, objectDiff } from "@/services/helpers";

const pageSize = ref(0);
const toast = useToast();
const loading = ref(true);
const dt = ref();
const patients = ref();
const patientsBackup = ref();
const patientDialog = ref(false);
const editingPatient = ref(false);
const deletePatientDialog = ref(false);
const deletePatientsDialog = ref(false);
const patient = ref({});
const oldPatient = ref({});
const selectedPatients = ref();
const filters = ref({
	global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const pagination = ref({
	currentPage: 0,
	totalPages: 0,
	currentRecords: 0,
	totalRecords: 0,
});

const loadPatients = (page = 1) => {
	loading.value = true;
	getPatients(page)
		.then((response) => {
			response = response.data;
			pagination.value = response.pagination;
			pageSize.value = Math.max(pageSize.value, pagination.value.currentRecords);
			patients.value = patientsBackup.value = response.data;
		})
		.catch((err) => {
			console.error(err);
			toast.add({
				severity: "error",
				summary: err?.response?.statusText || "Error",
				detail: err?.response?.data?.msg || "Could not fetch patients",
				life: 3000,
			});
		})
		.finally(() => (loading.value = false));
};

onMounted(() => {
	loadPatients();
});

const hideDialog = () => {
	editingPatient.value = false;
	patientDialog.value = false;
	submitted.value = false;
};

const saveEditedPatient = () => {
	submitted.value = true;
	const changes = objectDiff(patient.value, oldPatient.value);
	if (Object.keys(changes).length === 0) {
		errorToast(toast, "No changes were made");
		return;
	}
	editPatient(patient.value.id, changes)
		.then(() => {
			toast.add({ severity: "success", summary: "Success", detail: "Patient information saved", life: 3000 });
			loadPatients(pagination.value.currentPage);
		})
		.catch((err) => {
			console.error(err);
			toast.add({
				severity: "error",
				summary: err?.response?.statusText || "Error",
				detail: err?.response?.data?.msg || "Could not edit patient",
				life: 3000,
			});
		})
		.finally(() => {
			patientDialog.value = false;
			editingPatient.value = false;
			patient.value = {};
		});
};

const startEditingPatient = (pat) => {
	patient.value = { ...pat };
	oldPatient.value = JSON.parse(JSON.stringify(pat));
	editingPatient.value = true;
	patientDialog.value = true;
};
const confirmDeletePatient = (pat) => {
	patient.value = { ...pat };
	deletePatientDialog.value = true;
};
const deletePatientCallback = () => {
	deletePatient(patient.value.id)
		.then(() => {
			toast.add({
				severity: "success",
				summary: "Success",
				detail: `Patient ${patient.value.firstName} ${patient.value.lastName} removed`,
				life: 3000,
			});
			loadPatients(pagination.value.currentPage);
		})
		.catch((err) => {
			console.error(err);
			toast.add({
				severity: "error",
				summary: err?.response?.statusText || "Error",
				detail: err?.response?.data?.msg || "Could not delete patient",
				life: 3000,
			});
		})
		.finally(() => {
			deletePatientDialog.value = false;
			patient.value = {};
		});
};

const confirmDeleteSelected = () => {
	deletePatientsDialog.value = true;
};
const deleteSelectedPatientsCallback = () => {
	selectedPatients.value.every(async (patient) => {
		try {
			await deletePatient(patient.id);
		} catch (err) {
			console.error(err);
			toast.add({
				severity: "error",
				summary: err?.response?.statusText || "Error",
				detail: err?.response?.data?.msg || "Could not delete patient",
				life: 3000,
			});
			return false;
		}
		return true;
	});
	deletePatientsDialog.value = false;
	selectedPatients.value = null;
	loadPatients(pagination.value.currentPage);
};

const onSort = (event) => {
	const { sortField } = event;
	patients.value = patientsBackup.value.sort((i1, i2) => {
		return (i1[sortField] < i2[sortField] ? -1 : i1[sortField] > i2[sortField] ? 1 : 0) * event.sortOrder;
	});
};

const onSearch = () => {
	patients.value = patientsBackup.value.filter((item) =>
		Object.keys(item).some((property) =>
			item[property].toString().toLowerCase().includes(filters.value.global.value.toLowerCase())
		)
	);
};
</script>

<style lang="scss" scoped>
.table-header {
	display: flex;
	align-items: center;
	justify-content: space-between;

	@media screen and (max-width: 960px) {
		align-items: start;
	}
}

.confirmation-content {
	display: flex;
	align-items: center;
	justify-content: center;
}

@media screen and (max-width: 960px) {
	::v-deep(.p-toolbar) {
		flex-wrap: wrap;

		.p-button {
			margin-bottom: 0.25rem;
		}
	}
}
</style>
