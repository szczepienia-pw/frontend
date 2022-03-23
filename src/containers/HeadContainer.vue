<template>
    <nav v-if="userSession.isLoggedIn">
        <div v-if="userSession.userType === 'doctor'"></div>
        <div v-else></div>
    </nav>
    <Toast />
</template>

<script setup>
import Toast from "primevue/toast";
import { useUserSession } from "@/services/useUserSession";

const userSession = useUserSession();
</script>

<style lang="scss">
</style>