<template>
    <div>
        <Timeline :value="vaccinations">
            <template #opposite="{item}">
                <small class="p-text-secondary">{{item.vaccinationSlot.date}}</small>
            </template>
            <template #content="{item}">
                {{item.vaccine.name}}
            </template>
        </Timeline>
        <Paginator :rows="10" :totalRecords="pagination.totalRecords" @page="onPage" />
    </div>
</template>

<script setup>
import Timeline from "primevue/timeline"
import Paginator from 'primevue/paginator';
import { ref, onMounted } from 'vue';
//import { getVaccinationHistory } from '@/services/api'

const pagination = ref({
    currentPage: 0,
    totalPages: 0,
    currentRecords: 0,
    totalRecords: 0
})

const onPage = (event) => {
    console.log(event);
}

//
onMounted(() => {
    /*
    getVaccinationHistory(1)
        .then(response => {
            response = response.data;
            vaccinations.value = response.data
        })*/
})

const vaccinations = ref([
    {
      id: 1,
      vaccine: {
        id: 1,
        name: "Phizer",
        disease: "COVID-19",
        requiredDoses: 2,
        serialNumber: "000-1311231"
      },
      vaccinationSlot: {
        id: 1,
        date: "2019-08-24T14:15:22Z"
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
          localNumber: "1A"
        }
      },
      doctor: {
        id: 1,
        firstName: "Dr John",
        lastName: "Doe",
        email: "john.doe@doctor.com"
      }
    },
    {
      id: 2,
      vaccine: {
        id: 2,
        name: "Phizer2",
        disease: "COVID-19",
        requiredDoses: 2,
        serialNumber: "000-1311231"
      },
      vaccinationSlot: {
        id: 2,
        date: "2019-08-25T14:15:22Z"
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
          localNumber: "1A"
        }
      },
      doctor: {
        id: 2,
        firstName: "Dr John2",
        lastName: "Doe",
        email: "john.doe@doctor.com"
      }
    },
    {
      id: 3,
      vaccine: {
        id: 3,
        name: "Phizer3",
        disease: "COVID-19",
        requiredDoses: 2,
        serialNumber: "000-1311231"
      },
      vaccinationSlot: {
        id: 3,
        date: "2019-08-26T14:15:22Z"
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
          localNumber: "1A"
        }
      },
      doctor: {
        id: 3,
        firstName: "Dr John3",
        lastName: "Doe",
        email: "john.doe@doctor.com"
      }
    }
  ]);
</script>

<style lang="scss">

</style>