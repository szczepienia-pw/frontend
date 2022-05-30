<template>
	<div
		class="flex flex-row justify-content-center align-items-center"
		style="padding-top: 150px; padding-bottom: 150px; min-height: 100vh">
		<div class="h-auto flex container">
			<Card class="btw">
				<template #title>{{`${userType[0].toUpperCase() + userType.substring(1)} log in`}}</template>
				<template #content>
					<div class="flex flex-column justify-content-space-between">
						<div class="p-float-label mb-5">
							<InputText class="w-full" id="email-input" type="text" v-model="email" />
							<label for="email-input">Email</label>
						</div>
						<div class="p-float-label">
							<Password
								id="password-input"
								inputClass="w-full"
								class="w-full"
								v-model="password"
								:feedback="false"
								v-on:keyup.enter="sendLoginRequest" />
							<label for="password-input">Password</label>
						</div>
						<Button
							:label="`Not ${userType === userTypes.admin ? 'an' : 'a'} ${userType}?`"
							class="p-button-link align-self-end mb-6 p-0"
							@click="toggleMenu" />
						<Menu ref="userTypeMenu" :model="computedUserTypes" :popup="true" />
					</div>
					<div v-if="isRegistering" class="flex justify-content-center align-items-center h-20rem">
						<img
							alt="Doctor"
							style="object-fit: cover; width: 100%; max-width: 400px; height: auto"
							:src="require('@/assets/doctor.png')" />
					</div>
					<div class="flex flex-column">
						<Button label="Log in" @click="sendLoginRequest" :loading="isLoading" />
						<Button
							v-if="!isRegistering && userType === userTypes.patient"
							label="Create an account"
							class="p-button-link mt-2 p-0 h-2rem"
							@click="register" />
					</div>
				</template>
			</Card>
			<Divider layout="vertical" class="divider" />
			<Card
				:class="{ hide: !displayForm }"
				class="w-20rem justify-content-center align-items-center no-margin-top form pb-0">
				<template #content>
					<div v-if="isRegistering && userType === userTypes.patient">
						<div class="flex flex-row justify-content-end" style="height: 40px">
							<Button
								icon="pi pi-times"
								class="p-button-text p-button-rounded"
								style="width: 20px"
								@click="register" />
						</div>
						<RegisterForm />
					</div>
					<div v-else class="flex flex-column justify-content-center align-items-center" style="height: 100%">
						<img
							alt="Logo"
							style="object-fit: cover; width: 100%; max-width: 400px; height: auto"
							:src="require('@/assets/logo.png')" />
					</div>
				</template>
			</Card>
		</div>
	</div>
</template>

<script setup>
import Button from "primevue/button";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Menu from "primevue/menu";
import RegisterForm from "@/components/RegisterForm";
import Divider from "primevue/divider";
import { computed, ref } from "vue";
import { login } from "@/services/api";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { errorToast } from "@/services/helpers";
import { userTypes } from "@/services/useUserSession"

const email = ref("");
const password = ref("");
const isLoading = ref(false);
const userType = ref(userTypes.patient);
const userTypeMenu = ref();
const isRegistering = ref(false);

const router = useRouter();
const toast = useToast();

const toggleMenu = (event) => {
	userTypeMenu.value.toggle(event);
};

const register = () => {
	isRegistering.value = !isRegistering.value;
};

const displayForm = computed(() => isRegistering.value && userType.value == userTypes.patient);

const computedUserTypes = computed(() =>
	[
		{
			label: "Log in as patient",
			command: () => {
				userType.value = userTypes.patient;
			},
		},
		{
			label: "Log in as doctor",
			command: () => {
				userType.value = userTypes.doctor;
				isRegistering.value = false;
			},
		},
		{
			label: "Log in as admin",
			command: () => {
				userType.value = userTypes.admin;
				isRegistering.value = false;
			},
		},
	].filter((item) => !item.label.toLowerCase().includes(userType.value))
);

function sendLoginRequest() {
	isLoading.value = true;
	login(userType.value, email.value, password.value)
		.then(() => {
			router.push({ name: userType.value });
		})
		.catch((err) => {
			console.error(err);
			errorToast(toast, "Could not log in", err);
		})
		.finally(() => {
			isLoading.value = false;
		});
}
</script>

<style lang="scss">

main {
	width: 100% !important;
	left: 0 !important;
}

* {
	padding: 0;
	margin: 0;
}
.btw .p-card,
.btw .p-card-body {
	min-height: 24rem;
	height: 100%;
	width: 20rem;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	box-shadow: none;
}
.btw .p-card-content {
	padding-top: 40px;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.no-margin-top .p-card-content {
	margin-top: 0;
	padding-top: 0;
	height: 100%;
}

.p-card-body,
.p-card-content {
	height: 100%;
}

@media screen and (max-width: 768px) {
	.container {
		flex-direction: column;
	}
	.divider {
		display: none;
	}
	.hide {
		display: none;
	}
	.form {
		margin-top: 20px;
	}
}
</style>
