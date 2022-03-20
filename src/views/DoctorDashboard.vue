<template>
    <div class="w-screen h-screen flex justify-content-center align-items-center">
        <Card>
            <template #title>
                Add new vaccination slot
            </template>
            <template #content>
                <Calendar
                    v-model="selectedDate"
                    showTime
                    showIcon
                    class="mr-3"
                    v-tooltip.bottom="'Enter desired date'"
                />
                <Button label="Submit" @click="submitTimeslot" :loading="isLoading"/>
            </template>
        </Card>
    </div>
</template>

<script setup>
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Card from "primevue/card";

import { ref } from 'vue'
import { useToast } from "primevue/usetoast";
import * as Api from '@/services/api'

const toast = useToast();

const selectedDate = ref('');
const isLoading = ref(false);

function submitTimeslot() {
    isLoading.value = true;
    Api.createVaccinationSlot(new Date(selectedDate.value || new Date().toString()).toISOString())
        .then(() => {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Successfully added vaccination slot',
                life: 3000
            })
        })
        .catch(err => {
            console.error(err)
            toast.add({
                severity: 'error',
                summary: err.response.statusText,
                detail: err.response.data.msg,
                life: 3000
            })
        })
        .finally(() => {
            isLoading.value = false;
        })
}

</script>

<style lang="scss" scoped>

    .p-card {
        width: 28rem;
    }

</style>