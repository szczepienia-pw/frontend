<template>
    <div>
        <div class="card">
            <DataTable ref="dt" :value="vaccinations" v-model:selection="selectedVaccinations" dataKey="id" 
                paginator v-model:filters="filters" :loading="loading" lazy filterDisplay="menu"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} vaccinations" responsiveLayout="scroll"
                :rows="10" :totalRecords="pagination.totalRecords"
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
                        {{ formatDate(data.date) }}
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
                        <span :class="getStatusColor(data.status)">{{ data.status }}</span><i :class="'ml-2 pi ' + getStatusIcon(data.status) + ' ' + getStatusColor(data.status)"/>
                    </template>
                    <template #filter="{filterModel}">
                         <div class="field-checkbox">
                            <TriStateCheckbox v-model="filterModel.value" />
                            <label>Reserved slots</label>
                        </div>
                    </template>
                </Column>
                <Column style="min-width:8rem">
                    <template #body="{ data }">
                        <Button v-if="data.status === 'Free'" icon="pi pi-trash" class="p-button-danger p-button-rounded" @click="confirmDeleteVaccination(data)" />
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
                <span v-if="vaccination">Are you sure you want to delete slot <b>{{vaccination.date.toLocaleString()}}</b>?</span>
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
import { ref, onMounted } from 'vue';
import { FilterMatchMode,FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { getVaccinationSlots, deleteVaccinationSlot } from '@/services/api'
import { errorToast, successToast } from '@/services/helpers'

const toast = useToast();
const loading = ref(true)
const dt = ref();
const vaccinations = ref();
const vaccinationsBackup = ref();
const deleteVaccinationDialog = ref(false);
const deleteVaccinationsDialog = ref(false);
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
const loadVaccinations = (page = 1) => {
    loading.value = true;
    getVaccinationSlots(page, getFilterStartDate(), getFilterEndDate(), getFilterOnlyReserved())
        .then(response => {
            response = response.data
            pagination.value = response.pagination;
            vaccinations.value = vaccinationsBackup.value = response.data.map(item => ({
                patient: item.vaccination?.patient ? `${item.vaccination.patient.firstName} ${item.vaccination.patient.lastName}` : '',
                date: new Date(item.date),
                id: item.id,
                time: formatTime(new Date(item.date)),
                status: getStatus(item)
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
const confirmDeleteVaccination = (doct) => {
    vaccination.value = {...doct};
    deleteVaccinationDialog.value = true;
};
const deleteVaccinationCallback = () => {
    deleteVaccinationSlot(vaccination.value.id)
        .then(() => {
            successToast(toast, `Vaccination ${vaccination.value.date.toLocaleString()} removed`);
            loadVaccinations();
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
    loadVaccinations();
};

const formatDate = (date) => (
    date.toDateString()
)

const formatTime = (date) => (
    `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`
)

const getStatus = (data) => (
    data.vaccination?.status ? data.vaccination.status : 'Free'
)

const getStatusColor = (status) => (
    'text-' + {
        Planned: 'blue-500',
        Completed: 'green-500',
        Canceled: 'pink-500',
        Free: 'gray-500'
    }[status]
)

const getStatusIcon = (status) => (
    'pi-' + {
        Planned: 'calendar',
        Completed: 'check-circle',
        Canceled: 'times-circle',
        Free: 'lock-open'
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
    loadVaccinations();
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