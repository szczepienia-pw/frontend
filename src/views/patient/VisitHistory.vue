<template>
	<div class="container">
		<Card>
			<template #header>
				<ProgressBar v-if="loading" mode="indeterminate" />
				<h1 class="m-3">History of vaccinations</h1>
				<Dropdown
					v-model="selectedDisease"
					:options="diseases"
					placeholder="Filter by disease"
					class="my-2 mx-5"
					disabled />
			</template>
			<template #content>
				<ScrollPanel style="height: 50vh; width: 100%">
					<Timeline :value="vaccinations" v-if="!loading">
						<template #opposite="{ item }">
							<small class="p-text-secondary">
								{{ formatDate(item.vaccinationSlot.date) }}
							</small>
						</template>
						<template #content="{ item }">
							<div
								class="history-item"
								@click="
									() => {
										selectedVaccination = item;
										vaccinationDetailsDialog = true;
									}
								">
								<div class="history-item__icon">
									<i
										:class="`pi ${getItemIcon(item.status)}`"
										:style="`color: ${getItemColor(item.status)}`" />
								</div>
								<div class="history-item__title">
									{{ item.vaccine.name }}
									<div class="history-item__subtitle">
										{{ item.vaccine.disease }}
									</div>
								</div>
								<div class="history-item__details">
									<i class="pi pi-ellipsis-v" />
								</div>
							</div>
						</template>
					</Timeline>
					<Timeline :value="vaccinationsSkeleton" v-else>
						<template #opposite>
							<small class="p-text-secondary">
								<Skeleton width="10rem" height="1rem" />
							</small>
						</template>
						<template #content>
							<Skeleton width="8rem" height="4rem" borderRadius="16px" class="mb-4" />
						</template>
					</Timeline>
					<div class="no-visits-info" v-if="!loading && !vaccinations.length">
						<div class="no-visits-text">No visits to display</div>
						<Button label="Register for a visit" @click="$router.push('registration')" />
					</div>
				</ScrollPanel>
			</template>
			<template #footer>
				<Paginator
					:rows="pageSize"
					:totalRecords="pagination.totalRecords"
					@page="loadVaccinationHistory($event.page + 1)" />
			</template>
		</Card>
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
						{{ selectedVaccination.vaccine.name }}
					</div>
					<div class="vaccination-details__field">
						<div class="field-label">Disease</div>
						{{ selectedVaccination.vaccine.disease }}
					</div>
					<div class="vaccination-details__field">
						<div class="field-label">Required doses</div>
						{{ selectedVaccination.vaccine.requiredDoses }}
					</div>
					<div class="vaccination-details__field">
						<div class="field-label">Serial number</div>
						{{ selectedVaccination.vaccine.serialNumber }}
					</div>
				</div>
				<div class="flex-1">
					<div class="vaccination-details__field">
						<div class="field-label">Date</div>
						{{ formatDate(selectedVaccination.vaccinationSlot.date) }}
					</div>
					<div class="vaccination-details__field">
						<div class="field-label">Status</div>
						{{ selectedVaccination.status }}
					</div>
					<div class="vaccination-details__field">
						<div class="field-label">Doctor</div>
						{{ selectedVaccination.doctor.firstName + " " + selectedVaccination.doctor.lastName }}
					</div>
					<div class="vaccination-details__field">
						<div class="field-label">Contact</div>
						{{ selectedVaccination.doctor.email }}
					</div>
				</div>
			</div>
			<template #footer>
				<Button
					v-if="selectedVaccination.status === VaccinationStatuses.planned"
					label="Reschedule visit"
					icon="pi pi-pencil"
					@click="
						() => {
							vaccinationRescheduleDialog = true;
							newVaccinationDate = { date: '', id: '' };
						}
					" />
				<Button
					v-if="selectedVaccination.status === VaccinationStatuses.planned"
					label="Cancel visit"
					icon="pi pi-times"
					class="p-button-danger"
					@click="vaccinationCancelDialog = true" />
				<Button
					v-else-if="selectedVaccination.status === VaccinationStatuses.completed"
					label="Download certificate"
					icon="pi pi-download"
					class="p-button-success"
					@click="download" />
			</template>
		</Dialog>
		<Dialog
			v-model:visible="vaccinationCancelDialog"
			:style="{ width: '450px' }"
			header="Confirm"
			modal
			:draggable="false">
			<div class="confirmation-content">
				<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
				<span>
					Are you sure you want to cancel visit
					<b>{{ formatDate(selectedVaccination.vaccinationSlot.date) }}</b>
					?
				</span>
			</div>
			<template #footer>
				<Button label="No" icon="pi pi-times" class="p-button-text" @click="vaccinationCancelDialog = false" />
				<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="cancelVaccinationCallback" />
			</template>
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
import ScrollPanel from "primevue/scrollpanel";
import Skeleton from "primevue/skeleton";
import ProgressBar from "primevue/progressbar";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import Card from "primevue/card";
import Timeline from "primevue/timeline";
import Paginator from "primevue/paginator";
import SlotCalendar from "@/components/SlotCalendar";
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { getVaccinationHistory, cancelVaccinationSlot, reserveSlot, downloadCertificate } from "@/services/api";
import { errorToast, formatDate, successToast, VaccinationStatuses } from "@/services/helpers";

const vaccinationsSkeleton = [1, 2, 3];
const toast = useToast();
const diseases = ["Covid-19", "Covid-21", "Flu", "Other"];
const selectedDisease = ref();
const selectedVaccination = ref();
const vaccinationDetailsDialog = ref();
const vaccinationCancelDialog = ref();
const vaccinationRescheduleDialog = ref();
const loading = ref(false);
const newVaccinationDate = ref({ date: "", id: "" });
const pageSize = ref(0);

const pagination = ref({
	currentPage: 0,
	totalPages: 0,
	currentRecords: 0,
	totalRecords: 0,
});

const loadVaccinationHistory = (page) => {
	loading.value = true;
	getVaccinationHistory(page)
		.then((response) => {
			response = response.data;
			pagination.value = response.pagination;
			pageSize.value = Math.max(pageSize.value, pagination.value.currentRecords);
			vaccinations.value = response.data;
		})
		.catch((err) => {
			console.error(err);
			errorToast(toast, "Could not fetch vaccination history", err);
		})
		.finally(() => {
			loading.value = false;
		});
};

onMounted(() => {
	loadVaccinationHistory(1);
});

const download = () => {
  downloadCertificate(selectedVaccination.value.id)
    .then(certificate => {
      const fileUrl = URL.createObjectURL(certificate.data);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = 'Vaccination certificate';
      link.click();
      URL.revokeObjectURL(link.href);
      link.remove();
    })
    .catch(err => {
      console.error(err);
      errorToast(toast, "Could not download certificate", err);
    })
}

const rescheduleVaccinationCallback = () => {
	reserveSlot(newVaccinationDate.value.id, selectedVaccination.value.vaccine.id)
		.then(() => {
			successToast(toast, "Successfully rescheduled vaccination slot");
			cancelVaccinationCallback(false);
			loadVaccinationHistory(pagination.value.currentPage);
		})
		.catch((err) => {
			console.error(err);
			errorToast(toast, "Could not reschedule vaccination slot", err);
		})
		.finally(() => {
			vaccinationRescheduleDialog.value = false;
		});
}

const cancelVaccinationCallback = (showToast = true) => {
	cancelVaccinationSlot(selectedVaccination.value.vaccinationSlot.id)
		.then(() => {
			if (showToast)
				successToast(
					toast,
					`Visit ${formatDate(selectedVaccination.value.vaccinationSlot.date)} canceled`
				);
			loadVaccinationHistory(pagination.value.currentPage);
			vaccinationDetailsDialog.value = false;
		})
		.catch((err) => {
			console.error(err);
			errorToast(toast, "Could not cancel vaccination", err);
		})
		.finally(() => {
			vaccinationCancelDialog.value = false;
		});
};

const getItemIcon = (status) =>
	"pi-" +
	{
		Planned: "calendar",
		Completed: "check-circle",
		Canceled: "times-circle",
	}[status];

const getItemColor = (status) =>
	"var(--" +
	{
		Planned: "info",
		Completed: "success",
		Canceled: "danger",
	}[status] +
	")";

const vaccinations = ref([]);
</script>

<style lang="scss" scoped>
.container {
	width: unset;
}

.confirmation-content {
	display: flex;
	align-items: center;
	justify-content: center;
}

.p-card :deep() {
	overflow: hidden;
	position: relative;
	.p-progressbar {
		height: 3px;
		background: transparent;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
	}
	.p-card-content,
	.p-card-header {
		display: flex;
		flex-direction: column;
		justify-content: center;

		.p-timeline-event-opposite {
			flex: unset;
			width: 130px;
		}
	}
}

.history-item {
	position: relative;
	border: 1px solid var(--primary-color);
	color: var(--blue-800);
	padding: 0.75rem;
	border-radius: 8px;
	margin-bottom: 1rem;
	display: flex;
	flex-direction: row;
	align-items: center;
	transition: background-color 0.2s;
	cursor: pointer;

	&:hover {
		background-color: #737dec24;
	}

	.history-item__icon > i {
		font-size: 1.5rem;
	}

	.history-item__title {
		margin: 0 1rem;

		.history-item__subtitle {
			font-size: 0.75rem;
			opacity: 0.7;
		}
	}

	.history-item__details > i {
		position: absolute;
		right: 0.35rem;
		top: 0.75rem;
		font-size: 0.85rem;
	}
}

.no-visits-info {
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 100%;

	.no-visits-text {
		opacity: 0.5;
		text-align: center;
		margin-bottom: 1rem;
	}
}
</style>
