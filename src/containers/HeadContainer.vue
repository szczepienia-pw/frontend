<template>
	<div class="wrapper">
		<nav v-if="userSession.isLoggedIn">
			<div class="username">
				<i class="pi pi-user" />
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
				<Button v-if="userSession.userType === userTypes.patient"
					icon="pi pi-trash"
					class="p-button-text p-button-plain"
					label="Delete account"
					@click="deletePatientDialog = true" />
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
	<Dialog v-model:visible="deletePatientDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
		<div class="confirmation-content flex flex-row align-items-center">
			<div><i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: red" /></div>
			<div class="flex flex-column">
				<p>Are you sure you want to delete your account?</p>
				<b>This operation is irreversible!</b>
			</div>
		</div>
		<template #footer>
			<Button label="No" icon="pi pi-times" class="p-button-text" @click="deletePatientDialog = false" />
			<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deletePatient" />
		</template>
	</Dialog>
</template>

<script setup>
import Button from "primevue/button";
import Toast from "primevue/toast";
import Dialog from "primevue/dialog";
import BugReportDialog from "@/components/BugReportDialog";
import { useRouter } from "vue-router";
import { useUserSession, clearUserSession, userTypes } from "@/services/useUserSession";
import { successToast, errorToast } from "@/services/helpers";
import { useToast } from "primevue/usetoast";
import { computed, ref } from "vue";
import { deleteAccount } from "@/services/api";

const bugReportDialogVisible = ref(false);
const userSession = useUserSession();
const router = useRouter();
const deletePatientDialog = ref(false);
const toast = useToast();

const deletePatient = () => {
	deleteAccount()
		.then(() => {
			successToast(toast, "Your account was deleted");
			clearUserSession();
			router.push({ name: "login" });
		})
		.catch((err) => {
			console.error(err);
			errorToast(toast, "Could not delete account", err)
		})
		.finally(() => {
			deletePatientDialog.value = false;
		})
};

const menuItems = computed(() => {
	return {
		[userTypes.doctor]: [
			{
				label: "Time slots",
				icon: "pi-calendar",
				page: "slots",
			}
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
				page: "visits",
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
				label: "Patients",
				icon: "pi-users",
				page: "patients",
			},
			{
				label: "Vaccinations",
				icon: "pi-list",
				page: "vaccinations"
			},
			{
				label: "Statistics",
				icon: "pi-chart-line",
				page: "statistics"
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
