<template>
	<h3>Date: {{ selectedOptions.slot.date.replace('T', '   ').slice(0,-3) }}</h3>
	<h3>Disease: {{ selectedOptions.disease }}</h3>
	<h3>Vaccine: {{ selectedOptions.vaccine.name }}</h3>

	<div class="mt-5">
		<Button label="Back" icon="pi pi-angle-left" @click="$router.back()" class="mr-1" />
		<Button label="Confirm" icon-pos="right" icon="pi pi-angle-right" :loading="loading" class="ml-1" @click="reserve"/>
	</div>
</template>

<script setup>
import Button from "primevue/button";
import { ref } from "vue";
import { reserveSlot } from "@/services/api";
import { useToast } from "primevue/usetoast";
import { errorToast, successToast } from "@/services/helpers";
import { useRouter } from "vue-router";

const toast = useToast();
const router = useRouter();

// eslint-disable-next-line
const props = defineProps({
	selectedOptions: {
		type: Object,
		required: true,
	},
});

const reserve = () => {
	loading.value = true;
	reserveSlot(props.selectedOptions.slot.id, props.selectedOptions.vaccine.id)
	.then(() => {
		successToast(toast, "Successfully reserved vaccination slot");
	})
	.catch((err) => {
		errorToast(toast, "Could not reserve vaccination slot", err)
	}).finally(()=>{
		loading.value = false;
		router.replace({ name: "patient"})
	});
}

const loading = ref(false);
</script>

<style lang="scss"></style>
