<template>
	<div class="flex flex-column align-items-center">
		<Dropdown v-model="selectedVaccine" :options="vaccines" placeholder="Select vaccine" optionLabel="name" data-testid="dropdown"/>
		<div class="mt-5">
			<Button label="Back" icon="pi pi-angle-left" @click="$router.back()" :loading="loading" class="mr-1" />
			<Button
				label="Next"
				icon-pos="right"
				icon="pi pi-angle-right"
				@click="nextStep"
				:loading="loading"
				class="ml-1"
				data-testid="next-3"
				:disabled="!selectedVaccine" />
		</div>
	</div>
</template>

<script setup>
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import { ref, onMounted } from "vue";
import { getVaccines } from "@/services/api";
import { useRouter } from "vue-router";
import { useVisitRegistration, setVisitRegistration } from "@/services/useVisitRegistration"

const registrationInfo = useVisitRegistration();
const router = useRouter();

let selectedVaccine = ref(null);
const vaccines = ref([]);

onMounted(() => {
	getVaccines(registrationInfo.disease)
		.then((response) => {
			response = response.data;
			vaccines.value = response.vaccines;
		})
		.catch((err) => {
			console.error(err);
		});
});

// eslint-disable-next-line
const emit = defineEmits(["select-option"]);
const loading = ref(false);

const nextStep = () => {
	setVisitRegistration('vaccine', selectedVaccine.value);
	router.push("confirm");
};
</script>

<style lang="scss"></style>
