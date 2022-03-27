<template>
    <div>
        <div class="card">
            <DataTable ref="dt" :value="doctors" v-model:selection="selectedDoctors" dataKey="id" 
                paginator :filters="filters" :loading="loading" lazy
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} doctors" responsiveLayout="scroll"
                :first="pagination.currentPage * pagination.currentRecords" :rows="pagination.currentRecords" :totalRecords="pagination.totalRecords"
                @page="loadDoctors($event.page)"
            >
                <template #header>
                    <div class="table-header flex flex-column md:flex-row md:justify-content-between">
                        <div class="flex-start">
                            <h5 class="mb-2 md:m-0 p-as-md-center">Manage doctors</h5>
                        </div>
						<div class="flex-end">
                            <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedDoctors || !selectedDoctors.length" />
                            <div class="p-input-icon-left ml-5">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </div>
                        </div>
					</div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="id" header="ID" :sortable="true" style="min-width:12rem"></Column>
                <Column field="firstName" header="First name" :sortable="true" style="min-width:12rem"></Column>
                <Column field="lastName" header="Last name" :sortable="true" style="min-width:16rem"></Column>
                <Column field="email" header="Email" :sortable="true" style="min-width:8rem"></Column>
                <Column :exportable="false" style="min-width:8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="p-button-rounded mr-2" @click="startEditingDoctor(slotProps.data)" />
                        <Button icon="pi pi-trash" class="p-button-danger p-button-rounded" @click="confirmDeleteDoctor(slotProps.data)" />
                    </template>
                </Column>
                <template #paginatorstart>
                    <Button type="button" icon="pi pi-refresh" class="p-button-text" @click="loadDoctors(pagination.currentPage)"/>
                </template>
                <template #paginatorend>
                    <!-- leave empty for correct margins -->
                </template>
            </DataTable>
        </div>

        <Dialog v-model:visible="doctorDialog" :style="{width: '450px'}" header="Doctor Details" :modal="true" class="p-fluid">
            <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" :alt="doctor.image" class="doctor-image" v-if="doctor.image" />
            <div class="field">
                <label for="firstName">First name</label>
                <InputText id="firstName" v-model.trim="doctor.firstName" required="true" autofocus :class="{'p-invalid': submitted && !doctor.firstName}" />
                <small class="p-error" v-if="submitted && !doctor.firstName">First name is required.</small>
            </div>
            <div class="field">
                <label for="lastName">Last name</label>
                <InputText id="lastName" v-model.trim="doctor.lastName" required="true" autofocus :class="{'p-invalid': submitted && !doctor.lastName}" />
                <small class="p-error" v-if="submitted && !doctor.lastName">Last name is required.</small>
            </div>
            <div class="field">
                <label for="email">Email</label>
                <InputText id="email" v-model.trim="doctor.email" required="true" autofocus :class="{'p-invalid': submitted && !doctor.email}" />
                <small class="p-error" v-if="submitted && !doctor.email">Email is required.</small>
            </div>
            <div v-if="!editingDoctor" class="field">
                <label for="password">Password</label>
                <InputText id="password" v-model.trim="doctor.password" required="true" autofocus :class="{'p-invalid': submitted && !doctor.password}" />
                <small class="p-error" v-if="submitted && !doctor.password">Password is required.</small>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="() => editingDoctor ? saveEditedDoctor() : saveNewDoctor()" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteDoctorDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="doctor">Are you sure you want to delete <b>{{doctor.name}}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDoctorDialog = false"/>
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteDoctorCallback" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteDoctorsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="doctor">Are you sure you want to delete the selected doctors?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDoctorsDialog = false"/>
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedDoctorsCallback" />
            </template>
        </Dialog>
	</div>
</template>

<script setup>

import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import InputText from 'primevue/inputtext'


import { ref, onMounted } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { getDoctors, deleteDoctor, createDoctor, editDoctor } from '@/services/api'

const toast = useToast();
const loading = ref(true)
const dt = ref();
const doctors = ref();
const doctorDialog = ref(false);
const editingDoctor = ref(false);
const deleteDoctorDialog = ref(false);
const deleteDoctorsDialog = ref(false);
const doctor = ref({});
const selectedDoctors = ref();
const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});
const submitted = ref(false);
const pagination = ref({
    currentPage: 0,
    totalPages: 0,
    currentRecords: 0,
    totalRecords: 0
})

const loadDoctors = (page = 0) => {
    loading.value = true;
    getDoctors(page)
        .then(response => {
            pagination.value = response.pagination
            doctors.value = response.data
        })
        .catch(err => {
            console.error(err);
            toast.add({severity:'error', summary: err?.response?.statusText || 'Error', detail: err?.response?.data?.msg || 'Could not fetch doctors', life: 3000});
        })
        .finally(() => loading.value = false)
}

onMounted(() => {
    loadDoctors();
})

const openNew = () => {
    doctor.value = {};
    submitted.value = false;
    doctorDialog.value = true;
};
const hideDialog = () => {
    doctorDialog.value = false;
    submitted.value = false;
};
const saveNewDoctor = () => {
    submitted.value = true;
    if(!doctor.value.firstName || !doctor.value.lastName || !doctor.value.email || !doctor.value.password) return;
    createDoctor(doctor.value.firstName, doctor.value.lastName, doctor.value.email, doctor.value.password)
        .then(() => {
            toast.add({severity:'success', summary: 'Success', detail: 'Doctor information saved', life: 3000});
            loadDoctors();
        })
        .catch(err => {
            console.error(err);
            toast.add({severity:'error', summary: err?.response?.statusText || 'Error', detail: err?.response?.data?.msg || 'Could not create doctor', life: 3000});
        })
        .finally(() => {
            doctorDialog.value = false;
            doctor.value = {};
        })
};

const saveEditedDoctor = () => {
    submitted.value = true;
    if(!doctor.value.firstName || !doctor.value.lastName || !doctor.value.email) return;
    editDoctor(doctor.value.id, doctor.value.firstName, doctor.value.lastName, doctor.value.email)
        .then(() => {
            toast.add({severity:'success', summary: 'Success', detail: 'Doctor information saved', life: 3000});
            loadDoctors();
        })
        .catch(err => {
            console.error(err);
           toast.add({severity:'error', summary: err?.response?.statusText || 'Error', detail: err?.response?.data?.msg || 'Could not edit doctor', life: 3000});
        })
        .finally(() => {
            doctorDialog.value = false;
            editingDoctor.value = false;
            doctor.value = {};
        })
};

const startEditingDoctor = (doct) => {
    doctor.value = {...doct};
    editingDoctor.value = true;
    doctorDialog.value = true;
};
const confirmDeleteDoctor = (doct) => {
    doctor.value = {...doct};
    deleteDoctorDialog.value = true;
};
const deleteDoctorCallback = () => {
    deleteDoctor(doctor.value.id)
        .then(() => {
            toast.add({severity:'success', summary: 'Success', detail: `Doctor ${doctor.value.firstName} ${doctor.value.lastName} removed`, life: 3000});
            loadDoctors();
        })
        .catch(err => {
            console.error(err);
            toast.add({severity:'error', summary: err?.response?.statusText || 'Error', detail: err?.response?.data?.msg || 'Could not delete doctor', life: 3000});
        })
        .finally(() => {
            deleteDoctorDialog.value = false;
            doctor.value = {};
        })
};

const confirmDeleteSelected = () => {
    deleteDoctorsDialog.value = true;
};
const deleteSelectedDoctorsCallback = () => {
    selectedDoctors.value.every(async (doctor) => {
        try {
            await deleteDoctor(doctor.id);
        } catch(err) {
            console.error(err);
            toast.add({severity:'error', summary: err?.response?.statusText || 'Error', detail: err?.response?.data?.msg || 'Could not delete doctor', life: 3000});
            return false;
        }
        return true;
    })
    deleteDoctorsDialog.value = false;
    selectedDoctors.value = null;
    loadDoctors();
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