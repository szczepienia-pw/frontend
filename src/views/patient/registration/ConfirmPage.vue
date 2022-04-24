<template>
	<div class="flex flex-column align-items-center">
		<h3>Date: {{ formatDate(registrationInfo.slot.date) }}</h3>
		<h3>Disease: {{ registrationInfo.disease }}</h3>
		<h3>Vaccine: {{ registrationInfo.vaccine.name }}</h3>

		<div class="mt-5">
			<Button label="Back" icon="pi pi-angle-left" @click="$router.back()" class="mr-1" />
			<Button
				label="Confirm"
				icon-pos="right"
				icon="pi pi-angle-right"
				:loading="loading"
				class="ml-1"
				@click="reserve" />
		</div>
	</div>
</template>

<script setup>
import Button from "primevue/button";
import { ref } from "vue";
import { reserveSlot } from "@/services/api";
import { useToast } from "primevue/usetoast";
import { errorToast, successToast, formatDate } from "@/services/helpers";
import { useRouter } from "vue-router";
import { useVisitRegistration } from "@/services/useVisitRegistration"

const registrationInfo = useVisitRegistration();
const toast = useToast();
const router = useRouter();

const reserve = () => {
	loading.value = true;
	reserveSlot(registrationInfo.slot.id, registrationInfo.vaccine.id)
		.then(() => {
			successToast(toast, "Successfully reserved vaccination slot");
		})
		.catch((err) => {
			errorToast(toast, "Could not reserve vaccination slot", err);
		})
		.finally(() => {
			loading.value = false;
			router.replace({ name: "patient" });
		});
};

const loading = ref(false);
</script>

<style lang="scss"></style>
