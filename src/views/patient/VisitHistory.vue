<template>
	<div class="container">
		<Card>
			<template #header>
				<ProgressBar v-if="loading" mode="indeterminate" />
			</template>
			<template #title>History of vaccinations</template>
			<template #content>
				<Dropdown
					v-model="selectedDisease"
					:options="diseases"
					placeholder="Filter by disease"
					class="mb-5"
					disabled />
				<Timeline :value="vaccinations" v-if="!loading">
					<template #opposite="{ item }">
						<div>
							<small class="p-text-secondary">
								{{ formatDate(item.vaccinationSlot.date) }}
							</small>
						</div>
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
                    <Button label="Register for a visit" @click="$router.push('registration')"/>
                </div>
				<Paginator
					:rows="pagination.currentRecords"
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
					v-if="selectedVaccination.status === 'Planned'"
					label="Cancel visit"
					icon="pi pi-times"
					class="p-button-danger"
					@click="vaccinationCancelDialog = true" />
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
	</div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
import ProgressBar from "primevue/progressbar";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import Card from "primevue/card";
import Timeline from "primevue/timeline";
import Paginator from "primevue/paginator";
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { errorToast, formatDate, successToast } from "@/services/helpers";

const vaccinationsSkeleton = [1, 2, 3];

const toast = useToast();
import { getVaccinationHistory, cancelVaccinationSlot } from "@/services/api";

const diseases = ["Covid-19", "Covid-21", "Flu", "Other"];

const selectedDisease = ref();
const selectedVaccination = ref();
const vaccinationDetailsDialog = ref();
const vaccinationCancelDialog = ref();
const loading = ref(false);

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

const cancelVaccinationCallback = () => {
	cancelVaccinationSlot(selectedVaccination.value.vaccinationSlot.id)
		.then(() => {
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
	.p-card-content {
		display: flex;
		flex-direction: column;
		justify-content: center;

		.p-timeline-event-opposite {
			flex: unset;
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
		background-color: var(--blue-100);
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

.vaccination-details__field {
	position: relative;
	padding-bottom: 1rem;

	&:not(:first-child) {
		margin-top: 1rem;
	}

	.field-label {
		opacity: 0.7;
		font-size: 0.75rem;
	}

	&::after {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 90%;
		height: 1px;
		background-color: var(--primary-color);
		content: "";
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