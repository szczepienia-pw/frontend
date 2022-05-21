<template>
	<div>
		<div class="card">
			<DataTable
				ref="dt"
				:value="vaccinations"
				dataKey="id"
				paginator
				v-model:filters="filters"
				:loading="loading"
				lazy
				filterDisplay="menu"
				paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
				currentPageReportTemplate="Showing {first} to {last} of {totalRecords} vaccinations"
				responsiveLayout="scroll"
				:rows="pageSize"
				:totalRecords="pagination.totalRecords"
				@page="loadVaccinations($event.page + 1)"
				@sort="onSort"
				@filter="onFilter">
				<template #header>
					<div class="table-header flex flex-column md:flex-row md:justify-content-between">
						<div class="flex-start">
							<h5 class="mb-2 md:m-0 p-as-md-center">Scheduled and completed vaccinations</h5>
						</div>
						<div class="flex-end">
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

				<Column
					field="patient"
					header="Patient"
					:sortable="true"
					filterField="patient"
					:showFilterMatchModes="false"
					:filterMenuStyle="{ width: '14rem' }"
					style="min-width: 14rem">
					<template #body="{ data }">
						{{ data.patient }}
					</template>
					<template #filter="{ filterModel }">
						<Dropdown
							v-model="filterModel.value"
							:options="lazyPatients"
							:virtualScrollerOptions="{
								lazy: true,
								onLazyLoad: lazyLoadPatients,
								itemSize: 38,
								showLoader: true,
								loading: loadingPatients,
								delay: 250,
							}"
							placeholder="Select patient"
                        >
							<template #value="props">
								<span v-if="props.value">
									{{ props.value.firstName + " " + props.value.lastName }}
								</span>
								<span v-else>
									{{ props.placeholder }}
								</span>
							</template>
							<template #option="{ option }">
								{{ option.firstName + " " + option.lastName }}
							</template>
							<template v-slot:loader="{ options }">
								<div class="flex align-items-center p-2" style="height: 38px">
									<Skeleton :width="options.even ? '60%' : '50%'" height="1rem" />
								</div>
							</template>
						</Dropdown>
					</template>
				</Column>
				<Column 
                    field="doctor"
					header="Doctor"
					:sortable="true"
					filterField="doctor"
					:showFilterMatchModes="false"
					:filterMenuStyle="{ width: '14rem' }"
					style="min-width: 14rem">
					<template #body="{ data }">
						{{ data.doctor }}
					</template>
					<template #filter="{ filterModel }">
						<Dropdown
							v-model="filterModel.value"
							:options="lazyDoctors"
							:virtualScrollerOptions="{
								lazy: true,
								onLazyLoad: lazyLoadDoctors,
								itemSize: 38,
								showLoader: true,
								loading: loadingDoctors,
								delay: 250,
							}"
							placeholder="Select doctor"
                        >
							<template #value="props">
								<span v-if="props.value">
									{{ props.value.firstName + " " + props.value.lastName }}
								</span>
								<span v-else>
									{{ props.placeholder }}
								</span>
							</template>
							<template #option="{ option }">
								{{ option.firstName + " " + option.lastName }}
							</template>
							<template v-slot:loader="{ options }">
								<div class="flex align-items-center p-2" style="height: 38px">
									<Skeleton :width="options.even ? '60%' : '50%'" height="1rem" />
								</div>
							</template>
						</Dropdown>
					</template>
				</Column>
				<Column field="date" dataType="date" header="Date" :sortable="true">
					<template #body="{ data }">
						{{ formatDate(data.date) }}
					</template>
				</Column>
				<Column 
                    field="disease"
					header="Disease"
					:sortable="true"
					filterField="disease"
					:showFilterMatchModes="false"
					:filterMenuStyle="{ width: '14rem' }"
					style="min-width: 14rem">
					<template #body="{ data }">
						{{ data.disease }}
					</template>
					<template #filter="{ filterModel }">
						<Dropdown
							v-model="filterModel.value"
							:options="diseases"
							placeholder="Select disease"
                        />
					</template>
				</Column>
				<Column
					field="status"
					filterField="status"
					header="Status"
					:sortable="true"
					:showFilterMatchModes="false">
					<template #body="{ data }">
						<i :class="'mr-2 pi ' + getStatusIcon(data.status) + ' ' + getStatusColor(data.status)" />
						<span :class="getStatusColor(data.status)">{{ data.status }}</span>
					</template>
					<template #filter="{ filterModel }">
						<div class="field-checkbox">
							<TriStateCheckbox v-model="filterModel.value" />
							<label>Planned vaccinations</label>
						</div>
					</template>
				</Column>
				<Column style="min-width: 10rem">
					<template #body="{ data }">
						<Button
							v-if="data.vaccine"
							icon="pi pi-info-circle"
							class="p-button-info p-button-rounded"
							@click="showVaccinationDetails(data)" />
					</template>
				</Column>
				<template #paginatorstart>
					<Button
						type="button"
						icon="pi pi-refresh"
						class="p-button-text"
						@click="loadVaccinations(pagination.currentPage)" />
				</template>
				<template #paginatorend>
					<!-- leave empty for correct margins -->
				</template>
			</DataTable>
		</div>

		<Dialog
			v-model:visible="vaccinationDetailsDialog"
			header="Vaccination details"
			modal
			:draggable="false"
			:style="{ width: '600px' }">
			<div class="flex flex-row w-full">
				<div class="flex-1">
					<div class="vaccination-details__field">
						<div class="field-label">Vaccine</div>
						{{ vaccination.vaccine.name }}
					</div>
					<div class="vaccination-details__field">
						<div class="field-label">Disease</div>
						{{ vaccination.vaccine.disease }}
					</div>
					<div v-if="vaccination.status === VaccinationStatuses.completed" class="vaccination-details__field">
						<div class="field-label">Date</div>
						{{ formatDate(vaccination.date.toISOString()) }}
					</div>
					<div
						v-else-if="vaccination.status === VaccinationStatuses.planned"
						class="vaccination-details__field">
						<div class="field-label">Date</div>
						<div class="flex flex-row align-items-center">
							{{ formatDate(vaccination.date.toISOString()) }}
							<Button
								icon="pi pi-pencil"
								class="p-button-rounded mr-2 change-date"
								@click="
									() => {
										vaccinationRescheduleDialog = true;
										newVaccinationDate = { date: '', id: '' };
										selectedVaccination = vaccination.id;
									}
								" />
						</div>
					</div>
					<div class="vaccination-details__field">
						<div class="field-label">Status</div>
						{{ vaccination.status }}
					</div>
				</div>
				<div class="flex-1">
					<div class="vaccination-details__field">
						<div class="field-label">Patient</div>
						{{ vaccination.patient }}
					</div>
					<div class="vaccination-details__field">
						<div class="field-label">Contact</div>
						{{ vaccination.patientEmail }}
					</div>
					<div class="vaccination-details__field">
						<div class="field-label">Doctor</div>
						{{ vaccination.doctor }}
					</div>
					<div class="vaccination-details__field">
						<div class="field-label">Contact</div>
						{{ vaccination.doctorEmail }}
					</div>
				</div>
			</div>
		</Dialog>
		<Dialog v-model:visible="vaccinationRescheduleDialog" header="Choose new date" modal :draggable="false">
			<div class="confirmation-content">
				<SlotCalendar v-model="newVaccinationDate" />
			</div>
			<template #footer>
				<Button
					label="Cancel"
					icon="pi pi-times"
					class="p-button-text"
					@click="vaccinationRescheduleDialog = false" />
				<Button
					label="Reschedule"
					icon="pi pi-pencil"
					class="p-button-text"
					@click="rescheduleVaccinationCallback" />
			</template>
		</Dialog>
	</div>
</template>

<script setup>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Dropdown from "primevue/dropdown";
import Skeleton from "primevue/skeleton";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import TriStateCheckbox from "primevue/tristatecheckbox";
import SlotCalendar from "@/components/SlotCalendar";
import { ref, onMounted } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { getVaccinations, rescheduleVaccination, getPatients, getDoctors, getDiseases } from "@/services/api";
import { errorToast, successToast, formatDate, formatTime, VaccinationStatuses } from "@/services/helpers";

const toast = useToast();
const loading = ref(true);
const dt = ref();
const vaccinations = ref();
const loadingPatients = ref(false);
const patients = ref();
const lazyPatients = ref();
const patientsMaxPage = ref(1);
const loadingDoctors = ref(false);
const doctors = ref();
const lazyDoctors = ref();
const doctorsMaxPage = ref(1);
const diseases = getDiseases();
const vaccinationsBackup = ref();
const vaccinationDetailsDialog = ref(false);
const vaccination = ref({});
const selectedVaccination = ref();
const vaccinationRescheduleDialog = ref(false);
const newVaccinationDate = ref({ date: "", id: "" });
const filters = ref({
	global: { value: null, matchMode: FilterMatchMode.CONTAINS },
	doctor: { value: null },
	patient: { value: null },
	disease: { value: null },
});

const pagination = ref({
	currentPage: 0,
	totalPages: 0,
	currentRecords: 0,
	totalRecords: 0,
});
const pageSize = ref(0);
const loadVaccinations = (page = 1) => {
	loading.value = true;
	getVaccinations(page, getFilterDisease(), getFilterDoctor(), getFilterPatient())
		.then((response) => {
			response = response.data;
			pagination.value = response.pagination;
			pageSize.value = Math.max(pageSize.value, pagination.value.currentRecords);
			vaccinations.value = vaccinationsBackup.value = response.data.map((item) => ({
				patient: `${item.patient.firstName} ${item.patient.lastName}`,
				doctor: `${item.doctor.firstName} ${item.doctor.lastName}`,
				patientEmail: item.patient.email,
				doctorEmail: item.doctor.email,
				date: new Date(item.vaccinationSlot.date),
				id: item.id,
				time: formatTime(new Date(item.vaccinationSlot.date)),
				status: item.status,
				vaccine: item.vaccine,
				disease: item.vaccine.disease,
				vaccinationSlot: item.vaccinationSlot,
			}));
		})
		.catch((err) => {
			console.error(err);
			errorToast(toast, "Could not fetch vaccinations", err);
		})
		.finally(() => (loading.value = false));
};

const rescheduleVaccinationCallback = () => {
	rescheduleVaccination(newVaccinationDate.value.id, selectedVaccination.value)
		.then(() => {
			successToast(toast, "Successfully rescheduled vaccination slot");
			loadVaccinations(pagination.value.currentPage);
		})
		.catch((err) => {
			console.error(err);
			errorToast(toast, "Could not reschedule vaccination slot", err);
		})
		.finally(() => {
			vaccinationRescheduleDialog.value = false;
			vaccinationDetailsDialog.value = false;
		});
};

// eslint-disable-next-line
defineExpose({
	loadVaccinations,
});

const loadPatients = (page = 1, append = false) => {
    loadingPatients.value = true;
	getPatients(page)
        .then(response => {
            response = response.data;
            patients.value = append ? [...patients.value, response.data] : response.data;
        })
        .catch(err => {
            console.error(err);
            errorToast(toast, 'Could not fetch patients', err);
        })
        .finally(() => {
            loadingPatients.value = false;
        })
};

const loadDoctors = (page = 1, append = false) => {
    loadingDoctors.value = true;
	getDoctors(page)
        .then(response => {
            response = response.data;
            doctors.value = append ? [...doctors.value, response.data] : response.data;
        })
        .catch(err => {
            console.error(err);
            errorToast(toast, 'Could not fetch doctors', err);
        })
        .finally(() => {
            loadingDoctors.value = false;
        })
};

onMounted(() => {
	doctors.value = [];
    loadPatients();
    loadDoctors();
	loadVaccinations();
});

const lazyLoadPatients = ({first, last}) => {
    if(first > patients.value.length) {
        patientsMaxPage.value++;
        loadPatients(patientsMaxPage.value, true);
    }
    lazyPatients.value = patients.value.slice(first, last+1);
};

const lazyLoadDoctors = ({first, last}) => {
    if(first > doctors.value.length) {
        doctorsMaxPage.value++;
        loadDoctors(doctorsMaxPage.value, true);
    }
    lazyDoctors.value = doctors.value.slice(first, last+1);
};

const showVaccinationDetails = (vacc) => {
	vaccination.value = { ...vacc };
	vaccinationDetailsDialog.value = true;
};

const getStatusColor = (status) =>
	"text-" +
	{
		[VaccinationStatuses.planned]: "blue-500",
		[VaccinationStatuses.completed]: "green-500",
		[VaccinationStatuses.canceled]: "pink-500",
		[VaccinationStatuses.free]: "gray-500",
		[VaccinationStatuses.expired]: "bluegray-500",
	}[status];

const getStatusIcon = (status) =>
	"pi-" +
	{
		[VaccinationStatuses.planned]: "calendar",
		[VaccinationStatuses.completed]: "check-circle",
		[VaccinationStatuses.canceled]: "times-circle",
		[VaccinationStatuses.free]: "lock-open",
		[VaccinationStatuses.expired]: "calendar-times",
	}[status];

const onSort = (event) => {
	const { sortField } = event;
	vaccinations.value = vaccinationsBackup.value.sort((i1, i2) => {
		return (i1[sortField] < i2[sortField] ? -1 : i1[sortField] > i2[sortField] ? 1 : 0) * event.sortOrder;
	});
};

const onSearch = () => {
	vaccinations.value = vaccinationsBackup.value.filter((item) =>
		Object.keys(item).some((property) =>
			item[property].toString().toLowerCase().includes(filters.value.global.value.toLowerCase())
		)
	);
};

const getFilterDoctor = () => filters.value.doctor.value?.id;

const getFilterPatient = () => filters.value.patient.value?.id;

const getFilterDisease = () => filters.value.disease.value;

const onFilter = () => {
	loadVaccinations(pagination.value.currentPage);
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
	:deep(.p-toolbar) {
		flex-wrap: wrap;

		.p-button {
			margin-bottom: 0.25rem;
		}
	}
}

.change-date {
	position: absolute;
	left: 210px;
	margin-right: 0;
}
</style>
