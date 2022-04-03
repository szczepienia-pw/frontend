<template>
    <div>
        <Card class="my-5">
            <template #title> Add new vaccination slot </template>
            <template #content>
                <Calendar
                    v-model="selectedDate"
                    showTime
                    showIcon
                    class="mr-3"
                    v-tooltip.bottom="'Enter desired date'"
                />
                <Button
                    label="Submit"
                    @click="submitTimeslot"
                    :loading="isLoading"
                />
            </template>
        </Card>
        <DoctorVaccinationsList ref="vaccinations" class="mb-5" />
    </div>
</template>

<script setup>
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Card from "primevue/card";
import DoctorVaccinationsList from '@/components/DoctorVaccinationsList'

import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { createVaccinationSlot } from "@/services/api";
import { errorToast, successToast } from "@/services/helpers";

const toast = useToast();

const selectedDate = ref("");
const isLoading = ref(false);
const vaccinations = ref();

function submitTimeslot() {
    isLoading.value = true;
    createVaccinationSlot(
        new Date(selectedDate.value || new Date().toString()).toISOString()
    )
        .then(() => {
            successToast(toast, "Successfully added slot");
            vaccinations.value.loadVaccinations?.();
        })
        .catch((err) => {
            console.error(err);
            errorToast(toast, "Could not add slot", err);
        })
        .finally(() => {
            isLoading.value = false;
        });
}
</script>

<style lang="scss" scoped>
.p-card {
    width: 28rem;
}
</style>