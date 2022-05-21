<template>
    <div>
        <div class="card">
            <DataTable ref="dt" :value="vaccinations" v-model:selection="selectedVaccinations" dataKey="id" 
                paginator v-model:filters="filters" :loading="loading" lazy filterDisplay="menu"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} vaccinations" responsiveLayout="scroll"
                :rows="pageSize" :totalRecords="pagination.totalRecords"
                @page="loadVaccinations($event.page+1)" @sort="onSort" @filter="onFilter"
            >
                <template #header>
                    <div class="table-header flex flex-column md:flex-row md:justify-content-between">
                        <div class="flex-start">
                            <h5 class="mb-2 md:m-0 p-as-md-center">Scheduled vaccinations</h5>
                        </div>
						<div class="flex-end">
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedVaccinations || !selectedVaccinations.length" />
                            <div class="p-input-icon-left ml-5">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." @input="onSearch"/>
                            </div>
                        </div>
					</div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem"></Column>
                <Column field="patient" header="Patient" :sortable="true">
                    {{ patient }}
                </Column>
                <Column field="date" filterField="date" dataType="date" header="Date" :sortable="true" :filterMatchModeOptions="matchModes" :showFilterOperator="false">
                    <template #body="{ data }">
                        {{ new Date(data.date).toLocaleDateString() }}
                    </template>
                    <template #filter="{filterModel}">
                        <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                    </template>
                </Column>
                <Column field="time" header="Time" :sortable="true">
                    {{ time }}
                </Column>
                <Column field="status" filterField="status" header="Status" :sortable="true" :showFilterMatchModes="false">
                     <template #body="{ data }">
                        <i :class="'mr-2 pi ' + getStatusIcon(data.status) + ' ' + getStatusColor(data.status)"/>
                        <span :class="getStatusColor(data.status)">{{ data.status }}</span>
                    </template>
                    <template #filter="{filterModel}">
                         <div class="field-checkbox">
                            <TriStateCheckbox v-model="filterModel.value" />
                            <label>Reserved slots</label>
                        </div>
                    </template>
                </Column>
                <Column style="min-width:10rem">
                    <template #body="{ data }">
                        <Button
                            v-if="data.vaccine"
                            icon="pi pi-info-circle"
                            class="p-button-info p-button-rounded"
                            v-tooltip="'Details'"
                            @click="showVaccinationDetails(data)"
                        />
                        <span v-if="data.status === VaccinationStatuses.planned" class="ml-2">
                            <Button
                                icon="pi pi-times-circle"
                                class="p-button-danger p-button-rounded"
                                v-tooltip="'Cancel'"
                                @click="confirmCancelVaccination(data)"
                            />
                            <Button
                                icon="pi pi-check"
                                class="ml-2 p-button-success p-button-rounded"
                                v-tooltip="'Confirm'"
                                @click="confirmVaccination(data)"
                            />
                        </span>
                        <Button
                            v-else-if="data.status === VaccinationStatuses.free"
                            icon="pi pi-trash"
                            class="p-button-danger p-button-rounded"
                            v-tooltip="'Delete'"
                            @click="confirmDeleteVaccination(data)"
                        />
                    </template>
                </Column>
                <template #paginatorstart>
                    <Button type="button" icon="pi pi-refresh" class="p-button-text" @click="loadVaccinations(pagination.currentPage)"/>
                </template>
                <template #paginatorend>
                    <!-- leave empty for correct margins -->
                </template>
            </DataTable>
        </div>

        <Dialog v-model:visible="deleteVaccinationDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="vaccination">Are you sure you want to delete slot <b>{{formatDate(vaccination.date)}}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteVaccinationDialog = false"/>
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteVaccinationCallback" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteVaccinationsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="vaccination">Are you sure you want to delete the selected slots?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteVaccinationsDialog = false"/>
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedVaccinationsCallback" />
            </template>
        </Dialog>

        <Dialog v-model:visible="confirmVaccinationDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="vaccination">Are you sure you want to mark this vaccination as completed <b>{{vaccination.date.toLocaleString()}}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="confirmVaccinationDialog = false"/>
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="confirmVaccinationCallback" />
            </template>
        </Dialog>

        <Dialog v-model:visible="cancelVaccinationDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="vaccination">Are you sure you want to cancel this vaccination <b>{{vaccination.date.toLocaleString()}}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="cancelVaccinationDialog = false"/>
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="cancelVaccinationCallback" />
            </template>
        </Dialog>

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
					<div class="vaccination-details__field">
						<div class="field-label">Required doses</div>
						{{ vaccination.vaccine.requiredDoses }}
					</div>
					<div class="vaccination-details__field">
						<div class="field-label">Serial number</div>
						{{ vaccination.vaccine.serialNumber }}
					</div>
				</div>
				<div class="flex-1">
					<div class="vaccination-details__field">
						<div class="field-label">Date</div>
						{{ formatDate(vaccination.date.toISOString()) }}
					</div>
					<div class="vaccination-details__field">
						<div class="field-label">Status</div>
						{{ vaccination.status }}
					</div>
					<div class="vaccination-details__field">
						<div class="field-label">Patient</div>
						{{ vaccination.patient }}
					</div>
					<div class="vaccination-details__field">
						<div class="field-label">Contact</div>
						{{ vaccination.patientEmail }}
					</div>
				</div>
			</div>
            <template #footer>
				<Button
					v-if="vaccination.status === VaccinationStatuses.planned"
					label="Reschedule visit"
					icon="pi pi-pencil"
					@click="
						() => {
							vaccinationRescheduleDialog = true;
							newVaccinationDate = { date: '', id: '' };
						}
					" />
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
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Calendar from 'primevue/calendar'
import InputText from 'primevue/inputtext'
import TriStateCheckbox  from 'primevue/tristatecheckbox'
import SlotCalendar from "@/components/SlotCalendar";
import { ref, onMounted } from 'vue';
import { FilterMatchMode,FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { getVaccinationSlots, deleteVaccinationSlot, confirmVaccinationSlot, cancelPlannedVaccinationSlot, changeVaccinationSlot } from '@/services/api'
import { errorToast, successToast, formatDate, formatTime, VaccinationStatuses } from '@/services/helpers'

const toast = useToast();
const loading = ref(true)
const dt = ref();
const vaccinations = ref();
const vaccinationsBackup = ref();
const deleteVaccinationDialog = ref(false);
const deleteVaccinationsDialog = ref(false);
const confirmVaccinationDialog = ref(false);
const cancelVaccinationDialog = ref(false);
const vaccinationDetailsDialog = ref(false);
const vaccinationRescheduleDialog = ref(false);
const newVaccinationDate = ref({ date: "", id: "" });
const vaccination = ref({});
const selectedVaccinations = ref();
const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'date': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
    'status': {value: null},
});
const matchModes = [
    {label: 'Starts With', value: FilterMatchMode.STARTS_WITH},
    {label: 'Ends with', value: FilterMatchMode.ENDS_WITH},
]
const pagination = ref({
    currentPage: 0,
    totalPages: 0,
    currentRecords: 0,
    totalRecords: 0
})
const pageSize = ref(0);
const loadVaccinations = (page = 1) => {
    loading.value = true;
    getVaccinationSlots(page, getFilterStartDate(), getFilterEndDate(), getFilterOnlyReserved())
        .then(response => {
            response = response.data
            pagination.value = response.pagination;
            pageSize.value = Math.max(pageSize.value, pagination.value.currentRecords);
            vaccinations.value = vaccinationsBackup.value = response.data.map(item => ({
                patient: item.vaccination?.patient ? `${item.vaccination.patient.firstName} ${item.vaccination.patient.lastName}` : '',
                patientEmail: item.vaccination?.patient?.email,
                date: new Date(item.date),
                id: item.id,
                vaccinationId: item.vaccination?.id,
                time: formatTime(new Date(item.date)),
                status: getStatus(item),
                vaccine: item.vaccination?.vaccine
            }))
        })
        .catch(err => {
            console.error(err);
            errorToast(toast, "Could not fetch vaccinations", err);
        })
        .finally(() => loading.value = false)
}

// eslint-disable-next-line
defineExpose({
    loadVaccinations
})

onMounted(() => {
    loadVaccinations();
})
const confirmDeleteVaccination = (vacc) => {
    vaccination.value = {...vacc};
    deleteVaccinationDialog.value = true;
};
const confirmVaccination = (vacc) => {
    vaccination.value = {...vacc};
    confirmVaccinationDialog.value = true;
};
const confirmCancelVaccination = (vacc) => {
    vaccination.value = {...vacc};
    cancelVaccinationDialog.value = true;
};

const showVaccinationDetails = (vacc) => {
    vaccination.value = {...vacc};
    vaccinationDetailsDialog.value = true;
};

const deleteVaccinationCallback = () => {
    deleteVaccinationSlot(vaccination.value.id)
        .then(() => {
            successToast(toast, `Vaccination ${formatDate(vaccination.value.date)} removed`);
            loadVaccinations(pagination.value.currentPage);
        })
        .catch(err => {
            console.error(err);
            errorToast(toast, "Could not delete vaccination", err);
        })
        .finally(() => {
            deleteVaccinationDialog.value = false;
            vaccination.value = {};
        })
};
const confirmVaccinationCallback = () => {
    confirmVaccinationSlot(vaccination.value.id)
        .then(() => {
            successToast(toast, `Vaccination ${vaccination.value.date.toLocaleString()} completed`);
            loadVaccinations(pagination.value.currentPage);
        })
        .catch(err => {
            console.error(err);
            errorToast(toast, "Could not complete vaccination", err);
        })
        .finally(() => {
            confirmVaccinationDialog.value = false;
            vaccination.value = {};
        })
};
const cancelVaccinationCallback = () => {
    cancelPlannedVaccinationSlot(vaccination.value.id)
        .then(() => {
            successToast(toast, `Vaccination ${vaccination.value.date.toLocaleString()} canceled`);
            loadVaccinations(pagination.value.currentPage);
        })
        .catch(err => {
            console.error(err);
            errorToast(toast, "Could not cancel vaccination", err);
        })
        .finally(() => {
            cancelVaccinationDialog.value = false;
            vaccination.value = {};
        })
};

const rescheduleVaccinationCallback = () => {
	changeVaccinationSlot(newVaccinationDate.value.id, vaccination.value.vaccinationId)
		.then(() => {
			successToast(toast, "Successfully rescheduled vaccination");
            vaccinationDetailsDialog.value = false;
			loadVaccinations(pagination.value.currentPage);
		})
		.catch((err) => {
			console.error(err);
			errorToast(toast, "Could not reschedule vaccination", err);
		})
		.finally(() => {
			vaccinationRescheduleDialog.value = false;
		});
}

const confirmDeleteSelected = () => {
    deleteVaccinationsDialog.value = true;
};
const deleteSelectedVaccinationsCallback = () => {
    selectedVaccinations.value.every(async (vaccination) => {
        try {
            await deleteVaccinationSlot(vaccination.id);
        } catch(err) {
            console.error(err);
            errorToast(toast, "Could not delete vaccination", err);
            return false;
        }
        return true;
    })
    deleteVaccinationsDialog.value = false;
    selectedVaccinations.value = null;
    loadVaccinations(pagination.value.currentPage);
};

const getStatus = (data) => (
    data.vaccination?.status ? data.vaccination.status : 
        new Date(data.date) >= new Date() ? VaccinationStatuses.free : VaccinationStatuses.expired
)

const getStatusColor = (status) => (
    'text-' + {
        [VaccinationStatuses.planned]: 'blue-500',
        [VaccinationStatuses.completed]: 'green-500',
        [VaccinationStatuses.canceled]: 'pink-500',
        [VaccinationStatuses.free]: 'gray-500',
        [VaccinationStatuses.expired]: 'bluegray-500'
    }[status]
)

const getStatusIcon = (status) => (
    'pi-' + {
        [VaccinationStatuses.planned]: 'calendar',
        [VaccinationStatuses.completed]: 'check-circle',
        [VaccinationStatuses.canceled]: 'times-circle',
        [VaccinationStatuses.free]: 'lock-open',
        [VaccinationStatuses.expired]: 'calendar-times'
    }[status]
)

const onSort = (event) => {
    const { sortField } = event;
    vaccinations.value = vaccinationsBackup.value.sort((i1, i2) => {
        return (i1[sortField] < i2[sortField] ? -1 :
               i1[sortField] > i2[sortField] ? 1 : 0) * event.sortOrder;
    })
}

const onSearch = () => {
    vaccinations.value = vaccinationsBackup.value.filter(
        item => Object.keys(item).some(
            (property) => item[property].toString().toLowerCase().includes(filters.value.global.value.toLowerCase())
        )
    )
}

const getFilterStartDate = () => (
    filters.value.date.constraints.find(el => el.matchMode === 'startsWith')?.value?.toISOString()
)

const getFilterEndDate = () => (
    filters.value.date.constraints.find(el => el.matchMode === 'endsWith')?.value?.toISOString()
)

const getFilterOnlyReserved = () => (
    filters.value.status.value === true ? "1" : filters.value.status.value === false ? "0" : null
)

const onFilter = () => {
    loadVaccinations(pagination.value.currentPage);
}

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
</style> 