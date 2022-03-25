<template>
	<form @submit.prevent="handleSubmit(!v$.$invalid)" class="p-fluid">
		<div class="field mb-4">
			<div class="p-float-label">
				<InputText
					id="firstname"
					v-model="v$.firstname.$model"
					:class="{
						'p-invalid': v$.firstname.$invalid && submitted,
					}"
				/>
				<label
					for="firstname"
					:class="{
						'p-error': v$.firstname.$invalid && submitted,
					}"
					>Firstname*</label
				>
			</div>
			<small
				v-if="
					(v$.firstname.$invalid && submitted) ||
					v$.firstname.$pending.$response
				"
				class="p-error"
				>{{
					v$.firstname.required.$message.replace("Value", "Firstname")
				}}</small
			>
		</div>
		<div class="field mb-4">
			<div class="p-float-label">
				<InputText
					id="lastname"
					v-model="v$.lastname.$model"
					:class="{
						'p-invalid': v$.lastname.$invalid && submitted,
					}"
				/>
				<label
					for="lastname"
					:class="{
						'p-error': v$.lastname.$invalid && submitted,
					}"
					>Lastname*</label
				>
			</div>
			<small
				v-if="
					(v$.lastname.$invalid && submitted) ||
					v$.lastname.$pending.$response
				"
				class="p-error"
				>{{
					v$.lastname.required.$message.replace("Value", "Lastname")
				}}</small
			>
		</div>
		<div class="field mb-4">
			<div class="p-float-label">
				<InputNumber
					id="pesel"
					v-model="v$.pesel.$model"
					:class="{
						'p-invalid': v$.pesel.$invalid && submitted,
					}"
				/>
				<label
					for="pesel"
					:class="{
						'p-error': v$.pesel.$invalid && submitted,
					}"
					>Pesel*</label
				>
			</div>
			<small
				v-if="
					(v$.pesel.$invalid && submitted) ||
					v$.pesel.$pending.$response
				"
				class="p-error"
				>{{
					v$.pesel.required.$message.replace("Value", "Pesel")
				}}</small
			>
		</div>
		<div class="field mb-4">
			<div class="p-float-label p-input-icon-right">
				<i class="pi pi-envelope" />
				<InputText
					id="email"
					v-model="v$.email.$model"
					:class="{
						'p-invalid': v$.email.$invalid && submitted,
					}"
					aria-describedby="email-error"
				/>
				<label
					for="email"
					:class="{
						'p-error': v$.email.$invalid && submitted,
					}"
					>Email*</label
				>
			</div>
			<span v-if="v$.email.$error && submitted">
				<span
					id="email-error"
					v-for="(error, index) of v$.email.$errors"
					:key="index"
				>
					<small class="p-error">{{ error.$message }}</small>
				</span>
			</span>
			<small
				v-else-if="
					(v$.email.$invalid && submitted) ||
					v$.email.$pending.$response
				"
				class="p-error"
				>{{
					v$.email.required.$message.replace("Value", "Email")
				}}</small
			>
		</div>
		<div class="field mb-4">
			<div class="p-float-label">
				<Password
					id="password"
					v-model="v$.password.$model"
					:class="{
						'p-invalid': v$.password.$invalid && submitted,
					}"
					toggleMask
				>
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
				<label
					for="password"
					:class="{
						'p-error': v$.password.$invalid && submitted,
					}"
					>Password*</label
				>
			</div>
			<small
				v-if="
					(v$.password.$invalid && submitted) ||
					v$.password.$pending.$response
				"
				class="p-error"
				>{{
					v$.password.required.$message.replace("Value", "Password")
				}}</small
			>
		</div>
		<div class="field mb-4">
			<div class="p-float-label">
				<InputText id="street" v-model="v$.address.street.$model" />
				<label for="street">Street*</label>
			</div>
		</div>
		<div class="field mb-4 flex justify-content-between">
        <div class="p-float-label w-6 pr-1">
				<InputNumber
					id="houseNumber"
					v-model="v$.address.houseNumber.$model"
				/>
				<label for="houseNumber">House number*</label>
			</div>
			<div class="p-float-label w-6 pl-1">
				<InputNumber
					id="localNumber"
					v-model="v$.address.localNumber.$model"
				/>
				<label for="localNumber">Local number*</label>
			</div>
		</div>
		<div class="field mb-4 flex justify-content-between">
			<div class="p-float-label w-8 pr-1">
				<InputText id="city" v-model="v$.address.city.$model" />
				<label for="city">City*</label>
			</div>
			<div class="p-float-label w-4 pl-1">
				<InputNumber id="zipCode" v-model="v$.address.zipCode.$model" />
				<label for="zipCode">Zip code*</label>
			</div>
		</div>
		<Button type="submit" label="Register" class="mt-2"/>
	</form>
</template>

<script setup>
import { reactive, ref } from "vue";
import { email, required, decimal } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Password from "primevue/password";
import Divider from "primevue/divider";
import { register } from "@/services/api";

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
		houseNumber: null,
		localNumber: null,
	},
	accept: null,
});

const rules = {
	firstname: { required },
	lastname: { required },
	pesel: { required, decimal },
	email: { required, email },
	password: { required },
	accept: { required },
	address: {
		city: { required },
		zipCode: { required },
		street: { required },
		houseNumber: { required },
		localNumber: { required },
	},
};

const submitted = ref(false);

const v$ = useVuelidate(rules, state);

const handleSubmit = (isFormValid) => {
	submitted.value = true;
    if (!isFormValid) {
		return;
	}
    register(state.firstname, state.lastname, state.pesel, state.email, state.password, state.address)
    .then(() =>{
        resetForm();
    })
		.catch((err) => {
			console.error(err);
		})
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
.form-demo {
	.card {
		min-width: 450px;

		form {
			margin-top: 2rem;
		}

		.field {
			margin-bottom: 1.5rem;
		}
	}

	@media screen and (max-width: 960px) {
		.card {
			width: 80%;
		}
	}
}
</style>
