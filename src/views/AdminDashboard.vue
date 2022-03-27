<template>
    <div>
        <Button v-if="!settingsDialogVisible" class="my-5" label="Edit settings" @click="settingsDialogVisible = true" />
        <AdminSettingsForm :visible="settingsDialogVisible" @hide="settingsDialogVisible = false" />
        <AdminDataTable class="my-5"/>
    </div>
</template>

<script setup>
import AdminSettingsForm from "@/components/AdminSettingsForm";
import AdminDataTable from '@/components/AdminDataTable'
import Button from "primevue/button";
import { ref } from "vue";

const settingsDialogVisible = ref(false);

</script>

<style lang="scss">

</style>