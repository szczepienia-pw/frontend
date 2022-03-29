<template>
	<form @submit.prevent="handleSubmit(!v$.$invalid)" class="p-fluid">
		<div class="field">
			<div class="p-float-label">
				<InputText
					id="firstname"
					v-model="v$.firstname.$model"
					:class="{ 'p-invalid': v$.firstname.$invalid && submitted }" />
				<label for="firstname" :class="{ 'p-error': v$.firstname.$invalid && submitted }">Firstname*</label>
			</div>
			<small v-if="(v$.firstname.$invalid && submitted) || v$.firstname.$pending.$response" class="p-error">
				{{ v$.firstname.required.$message.replace("Value", "Firstname") }}
			</small>
		</div>
		<div class="field">
			<div class="p-float-label">
				<InputText
					id="lastname"
					v-model="v$.lastname.$model"
					:class="{ 'p-invalid': v$.lastname.$invalid && submitted }" />
				<label for="lastname" :class="{ 'p-error': v$.lastname.$invalid && submitted }">Lastname*</label>
			</div>
			<small v-if="(v$.lastname.$invalid && submitted) || v$.lastname.$pending.$response" class="p-error">
				{{ v$.lastname.required.$message.replace("Value", "Lastname") }}
			</small>
		</div>
		<div class="field">
			<div class="p-float-label">
				<InputMask
					id="pesel"
					v-model="v$.pesel.$model"
					:class="{ 'p-invalid': v$.pesel.$invalid && submitted }"
					mask="99999999999" />
				<label for="pesel" :class="{ 'p-error': v$.pesel.$invalid && submitted }">Pesel*</label>
			</div>
			<small v-if="(v$.pesel.$invalid && submitted) || v$.pesel.$pending.$response" class="p-error">
				{{ v$.pesel.required.$message.replace("Value", "Pesel") }}
			</small>
		</div>
		<div class="field">
			<div class="p-float-label p-input-icon-right">
				<i class="pi pi-envelope" />
				<InputText
					id="email"
					v-model="v$.email.$model"
					:class="{ 'p-invalid': v$.email.$invalid && submitted }"
					aria-describedby="email-error" />
				<label for="email" :class="{ 'p-error': v$.email.$invalid && submitted }">Email*</label>
			</div>
			<span v-if="v$.email.$error && submitted">
				<span id="email-error" v-for="(error, index) of v$.email.$errors" :key="index">
					<small class="p-error">{{ error.$message }}</small>
				</span>
			</span>
			<small v-else-if="(v$.email.$invalid && submitted) || v$.email.$pending.$response" class="p-error">
				{{ v$.email.required.$message.replace("Value", "Email") }}
			</small>
		</div>
		<div class="field">
			<div class="p-float-label">
				<Password
					id="password"
					v-model="v$.password.$model"
					:class="{ 'p-invalid': v$.password.$invalid && submitted }"
					toggleMask>
					<template #header>
						<h6>Pick a password</h6>
					</template>
					<template #footer="sp">
						{{ sp.level }}
						<Divider />
						<p class="mt-2">Suggestions</p>
						<ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
							<li>At least one lowercase</li>
							<li>At least one uppercase</li>
							<li>At least one numeric</li>
							<li>Minimum 8 characters</li>
						</ul>
					</template>
				</Password>
				<label for="password" :class="{ 'p-error': v$.password.$invalid && submitted }">Password*</label>
			</div>
			<small v-if="(v$.password.$invalid && submitted) || v$.password.$pending.$response" class="p-error">
				{{ v$.password.required.$message.replace("Value", "Password") }}
			</small>
		</div>
		<div class="field">
			<div class="p-float-label">
				<InputText
					id="street"
					v-model="v$.address.street.$model"
					:class="{ 'p-invalid': v$.address.street.$invalid && submitted }" />
				<label for="street">Street*</label>
			</div>
			<span v-if="v$.address.street.$error && submitted">
				<span id="street-error" v-for="(error, index) of v$.address.street.$errors" :key="index">
					<small class="p-error">{{ error.$message }}</small>
				</span>
			</span>
			<small
				v-else-if="(v$.address.street.$invalid && submitted) || v$.address.street.$pending.$response"
				class="p-error">
				{{ v$.address.street.required.$message.replace("Value", "Street") }}
			</small>
		</div>
		<div class="field flex justify-content-between">
			<div class="w-7">
				<div class="p-float-label w-12 pr-1">
					<InputText
						id="houseNumber"
						v-model="v$.address.houseNumber.$model"
						:class="{ 'p-invalid': v$.address.houseNumber.$invalid && submitted }" />
					<label for="houseNumber">House number*</label>
				</div>
				<span v-if="v$.address.houseNumber.$error && submitted">
					<span id="houseNumber-error" v-for="(error, index) of v$.address.houseNumber.$errors" :key="index">
						<small class="p-error">{{ error.$message }}</small>
					</span>
				</span>
				<small
					v-else-if="
						(v$.address.houseNumber.$invalid && submitted) || v$.address.houseNumber.$pending.$response
					"
					class="p-error">
					{{ v$.address.houseNumber.required.$message.replace("Value", "Value") }}
				</small>
			</div>
			<div class="w-7 pl-1">
				<div class="p-float-label">
					<InputText id="localNumber" v-model="v$.address.localNumber.$model" />
					<label for="localNumber">Local number</label>
				</div>
			</div>
		</div>
		<div class="field flex justify-content-between">
			<div class="p-float-label w-10">
				<div class="p-float-label w-12 pr-1">
					<InputText
						id="city"
						v-model="v$.address.city.$model"
						:class="{ 'p-invalid': v$.address.city.$invalid && submitted }" />
					<label for="city">City*</label>
				</div>
				<span v-if="v$.address.city.$error && submitted">
					<span id="city-error" v-for="(error, index) of v$.address.city.$errors" :key="index">
						<small class="p-error">{{ error.$message }}</small>
					</span>
				</span>
				<small
					v-else-if="(v$.address.city.$invalid && submitted) || v$.address.street.$pending.$response"
					class="p-error">
					{{ v$.address.city.required.$message.replace("Value", "City") }}
				</small>
			</div>
			<div class="p-float-label w-4">
				<div class="p-float-label w-12 pl-1">
					<InputMask
						mask="99-999"
						id="zipCode"
						v-model="v$.address.zipCode.$model"
						:class="{ 'p-invalid': v$.address.zipCode.$invalid && submitted }" />
					<label for="zipCode">Zip code*</label>
				</div>
				<span v-if="v$.address.zipCode.$error && submitted">
					<span id="zipCode-error" v-for="(error, index) of v$.address.zipCode.$errors" :key="index">
						<small class="p-error">{{ error.$message }}</small>
					</span>
				</span>
			</div>
		</div>
		<Button type="submit" label="Register" class="mt-2" v-on:keyup.enter="handleSubmit" :loading="isLoading" />
	</form>
</template>

<script setup>
import { reactive, ref } from "vue";
import { email, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Divider from "primevue/divider";
import InputMask from "primevue/inputmask";
import { register } from "@/services/api";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const state = reactive({
	firstname: "",
	lastname: "",
	pesel: null,
	email: "",
	password: "",
	address: {
		city: "",
		zipCode: null,
		street: "",
		houseNumber: "",
		localNumber: "",
	},
});

const rules = {
	firstname: { required },
	lastname: { required },
	pesel: { required },
	email: { required, email },
	password: { required },
	address: {
		city: { required },
		zipCode: { required },
		street: { required },
		houseNumber: { required },
		localNumber: {},
	},
};

const submitted = ref(false);
const isLoading = ref(false);

const v$ = useVuelidate(rules, state);

const handleSubmit = (isFormValid) => {
	submitted.value = true;
	if (!isFormValid) {
		return;
	}
	isLoading.value = true;
	register(state.firstname, state.lastname, state.pesel, state.email, state.password, state.address)
		.then(() => {
			resetForm();
			toast.add({
				severity: "success",
				summary: "Success",
				detail: "Successfully registered",
				life: 3000,
			});
		})
		.catch((err) => {
			console.error(err);
			toast.add({
				severity: "error",
				summary: err?.response?.statusText || "Error",
				detail: err?.response?.data?.msg || "Something went wrong during registration",
				life: 3000,
			});
		})
		.finally(() => {
			isLoading.value = false;
		});
};

const resetForm = () => {
	state.firstname = "";
	state.lastname = "";
	state.email = "";
	state.pesel = null;
	state.password = "";
	state.country = null;
	state.accept = null;
	(state.address = {
		city: "",
		zipCode: "",
		street: null,
		houseNumber: null,
		localNumber: null,
	}),
		(submitted.value = false);
};
</script>

<style lang="scss" scoped>
.field {
	margin-bottom: 2rem;
}
</style>
