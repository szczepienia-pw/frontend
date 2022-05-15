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

				<Column field="patient" header="Patient" :sortable="true">
					{{ patient }}
				</Column>
				<Column field="doctor" header="Doctor" :sortable="true">
					{{ doctor }}
				</Column>
				<Column
					field="date"
					filterField="date"
					dataType="date"
					header="Date"
					:sortable="true"
					:filterMatchModeOptions="matchModes"
					:showFilterOperator="false">
					<template #body="{ data }">
						{{ new Date(data.date).toLocaleDateString() }}
					</template>
					<template #filter="{ filterModel }">
						<Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
					</template>
				</Column>
				<Column field="time" header="Time" :sortable="true">
					{{ time }}
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
import Column from "primevue/column";
import Calendar from "primevue/calendar";
import InputText from "primevue/inputtext";
import TriStateCheckbox from "primevue/tristatecheckbox";
import SlotCalendar from "@/components/SlotCalendar";
import { ref, onMounted } from "vue";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { getVaccinations, changeVaccinationSlot } from "@/services/api";
import { errorToast, successToast, formatDate, formatTime, VaccinationStatuses } from "@/services/helpers";

const toast = useToast();
const loading = ref(true);
const dt = ref();
const vaccinations = ref();
const vaccinationsBackup = ref();
const vaccinationDetailsDialog = ref(false);
const vaccination = ref({});
const selectedVaccination = ref();
const vaccinationRescheduleDialog = ref(false);
const newVaccinationDate = ref({ date: "", id: "" });
const filters = ref({
	global: { value: null, matchMode: FilterMatchMode.CONTAINS },
	date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
	status: { value: null },
});
const matchModes = [
	{ label: "Starts With", value: FilterMatchMode.STARTS_WITH },
	{ label: "Ends with", value: FilterMatchMode.ENDS_WITH },
];
const pagination = ref({
	currentPage: 0,
	totalPages: 0,
	currentRecords: 0,
	totalRecords: 0,
});
const pageSize = ref(0);
const loadVaccinations = (page = 1) => {
	loading.value = true;
	getVaccinations(page, getFilterStartDate(), getFilterEndDate(), getFilterOnlyReserved())
		.then((response) => {
			response = response.data;
			console.log(response.data);
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
				vaccinationSlot: item.vaccinationSlot,
			}));
			console.log(vaccinations.value);
		})
		.catch((err) => {
			console.error(err);
			errorToast(toast, "Could not fetch vaccinations", err);
		})
		.finally(() => (loading.value = false));
};

const rescheduleVaccinationCallback = () => {
	changeVaccinationSlot(newVaccinationDate.value.id, selectedVaccination.value)
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

onMounted(() => {
	loadVaccinations();
});

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

const getFilterStartDate = () =>
	filters.value.date.constraints.find((el) => el.matchMode === "startsWith")?.value?.toISOString();

const getFilterEndDate = () =>
	filters.value.date.constraints.find((el) => el.matchMode === "endsWith")?.value?.toISOString();

const getFilterOnlyReserved = () =>
	filters.value.status.value === true ? "1" : filters.value.status.value === false ? "0" : null;

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
