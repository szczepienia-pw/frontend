<template>
	<div
		class="w-screen h-screen flex flex-row justify-content-center align-items-center"
	>
		<div class="h-auto flex flex-row">
			<Card class="btw">
				<template #content>
					<div class="flex flex-column justify-content-space-between">
						<div class="p-float-label mb-4">
							<InputText
								class="w-full"
								id="email-input"
								type="text"
								v-model="email"
							/>
							<label for="email-input">Email</label>
						</div>
						<div class="p-float-label">
							<Password
								id="password-input"
								inputClass="w-full"
								class="w-full"
								v-model="password"
								:feedback="false"
							/>
							<label for="password-input">Password</label>
						</div>
						<Button
							:label="`Not ${userType == 'admin' ? 'an' : 'a'} ${
								userType == 'admin' ? 'administrator' : userType
							}?`"
							class="p-button-link align-self-end mb-6 p-0"
							@click="toggleMenu"
						/>
						<Menu
							ref="userTypeMenu"
							:model="userTypes"
							:popup="true"
						/>
					</div>
					<div
						v-if="isRegistering"
						class="flex justify-content-center align-items-center h-20rem"
					>
						<img
							alt="Doctor"
							style="
								object-fit: cover;
								width: 100%;
								max-width: 400px;
								height: auto;
							"
							:src="require('@/assets/doctor.png')"
						/>
					</div>
					<div class="flex flex-column">
						<Button
							label="Log in"
							@click="sendLoginRequest"
							:loading="isLoading"
						/>
						<Button v-if="!isRegistering && userType == 'patient'"
							label="Create an account"
							class="p-button-link mt-2 p-0 h-2rem"
							@click="register"
						/>
					</div>
				</template>
			</Card>
			<Divider layout="vertical" />
			<Card class="w-20rem justify-content-center align-items-center no-margin-top">
				<template #content>
					<div v-if="isRegistering && userType == 'patient'">
						<div class="flex flex-row justify-content-end" style="height: 40px">
							<Button
								icon="pi pi-times"
								class="p-button-text p-button-rounded"
                                style="width: 20px"
                                @click="register"
							/>
						</div>

						<RegisterForm />
					</div>
					<div
						v-else
						class="flex justify-content-center align-items-center h-20rem"
					>
						<img
							alt="Doctor"
							style="
								object-fit: cover;
								width: 100%;
								max-width: 400px;
								height: auto;
							"
							:src="require('@/assets/doctor.png')"
						/>
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

const email = ref("");
const password = ref("");
const isLoading = ref(false);
const userType = ref("patient");
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

const userTypes = computed(() =>
	[
		{
			label: "Log in as patient",
			command: () => {
				userType.value = "patient";
			},
		},
		{
			label: "Log in as doctor",
			command: () => {
				userType.value = "doctor";
			},
		},
		{
			label: "Log in as admin",
			command: () => {
				userType.value = "admin";
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
			toast.add({
				severity: "error",
				summary: err?.response?.statusText || "Error",
				detail: err?.response?.data?.msg || "Could not log in",
				life: 3000,
			});
		})
		.finally(() => {
			isLoading.value = false;
		});
}
</script>

<style lang="scss">
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
.no-margin-top .p-card-content{
    margin-top: 0;
    padding-top: 0;
}
</style>
