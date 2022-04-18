<template>
	<div class="wrapper">
		<nav v-if="userSession.isLoggedIn">
			<div class="username">
				<i class="pi pi-user mr-3" />
				{{ userSession.userInfo.firstName + " " + userSession.userInfo.lastName }}
			</div>
			<Button
				v-for="item in menuItems"
				:key="item.text"
				class="p-button-text p-button-plain"
				:icon="`pi ${item.icon}`"
				:label="item.label"
				:disabled="item.disabled"
				@click="$router.replace(`/${userSession.userType}/${item.page}`)" />
			<div class="mt-8">
				<Button
					class="p-button-text p-button-plain"
					icon="pi pi-exclamation-circle"
					label="Report a bug"
					@click="bugReportDialogVisible = true" />
				<Button class="p-button-text p-button-plain" icon="pi pi-sign-out" label="Log out" @click="logout" />
			</div>
		</nav>
	</div>
	<Toast />
	<BugReportDialog
		modal
		:draggable="false"
		:visible="bugReportDialogVisible"
		@hide="bugReportDialogVisible = false" />
</template>

<script setup>
import Button from "primevue/button";
import Toast from "primevue/toast";
import BugReportDialog from "@/components/BugReportDialog";
import { useRouter } from "vue-router";
import { useUserSession, clearUserSession, userTypes } from "@/services/useUserSession";
import { successToast } from "@/services/helpers";
import { useToast } from "primevue/usetoast";
import { computed, ref } from "vue";

const bugReportDialogVisible = ref(false);
const userSession = useUserSession();
const router = useRouter();
const toast = useToast();

const menuItems = computed(() => {
	return {
		[userTypes.doctor]: [
			{
				label: "Time slots",
				icon: "pi-calendar",
				page: "slots",
			},
			{
				label: "Vaccination",
				icon: "pi-book",
				disabled: true,
			},
		],
		[userTypes.patient]: [
			{
				label: "New appointment",
				icon: "pi-calendar",
				page: "registration",
			},
			{
				label: "Visit history",
				icon: "pi-book",
				disabled: true,
			},
			{
				label: "Personal data",
				icon: "pi-id-card",
				page: "personal",
			},
		],
		[userTypes.admin]: [
			{
				label: "Doctors",
				icon: "pi-copy",
				page: "doctors",
			},
			{
				label: "Users",
				icon: "pi-users",
				disabled: true,
			},
			{
				label: "Vaccinations",
				icon: "pi-list",
				disabled: true,
			},
			{
				label: "Settings",
				icon: "pi-cog",
				page: "settings",
			},
		],
	}[userSession.userType];
});

function logout() {
	clearUserSession();
	successToast(toast, "Logged out");
	router.push({ name: "login" });
}
</script>

<style lang="scss" scoped>
.wrapper {
	position: absolute;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
}

nav :deep() {
	color: #fff;
	position: fixed;
	width: 15rem;
	left: 5rem;
	margin: auto;
	background: var(--primary-color);
	padding: 1rem;
	border-radius: 8px;

	&,
	& > div {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.username {
		align-items: center;
		font-size: 1.25rem;
		margin-bottom: 2rem;
		display: flex;
		flex-direction: row;
	}

	.p-button.p-button-plain {
		margin: 0.5rem 0;
		color: #fff !important;

		&:hover {
			background-color: rgba(0, 0, 0, 0.1) !important;
		}
	}
}
</style>
