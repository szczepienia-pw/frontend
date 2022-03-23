<template>
	<nav v-if="userSession.isLoggedIn">
		<Button label="Log out" @click="logout" />
		<div v-if="userSession.userType === 'doctor'"></div>
		<div v-else></div>
	</nav>
	<Toast />
</template>

<script setup>
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useRouter } from "vue-router";
import { useUserSession, clearUserSession } from "@/services/useUserSession";

const userSession = useUserSession();
const router = useRouter();

function logout() {
	clearUserSession();
	router.push({ name: "login" });
}
</script>

<style lang="scss"></style>
