<template>
    <div class="flex flex-column ">
        <VaccinationReports class="align-self-center" />
        <AdminVaccinationList class="mb-5" />
    </div>
</template>

<script setup>

import AdminVaccinationList from '@/components/AdminVaccinationList'
import VaccinationReports from '@/components/VaccinationReports'

</script>

<style lang="scss" scoped>
.p-card {
    width: 25rem;
}
</style>