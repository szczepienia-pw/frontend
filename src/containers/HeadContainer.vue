<template>
	<nav v-if="userSession.isLoggedIn">
		<Button label="Log out" @click="logout" />
		<div v-if="userSession.userType === userTypes.doctor"></div>
		<div v-else></div>
	</nav>
	<Toast />
</template>

<script setup>
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useRouter } from "vue-router";
import { useUserSession, clearUserSession, userTypes } from "@/services/useUserSession";
import { successToast } from "@/services/helpers";
import { useToast } from "primevue/usetoast";

const userSession = useUserSession();
const router = useRouter();
const toast = useToast();

function logout() {
	clearUserSession();
	successToast(toast, "Logged out");
	router.push({ name: "login" });
}
</script>

<style lang="scss"></style>
