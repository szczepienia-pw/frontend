<template>
	<div class="flex flex-column align-items-center">
		<Dropdown v-model="selectedVaccine" :options="vaccines" placeholder="Select vaccine" optionLabel="name" />
		<div class="mt-5">
			<Button label="Back" icon="pi pi-angle-left" @click="$router.back()" :loading="loading" class="mr-1" />
			<Button
				label="Next"
				icon-pos="right"
				icon="pi pi-angle-right"
				@click="nextStep"
				:loading="loading"
				class="ml-1"
				:disabled="selectedVaccine == {}" />
		</div>
	</div>
</template>

<script setup>
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import { ref } from "vue";
import { getVaccines } from "@/services/api";
import { useRouter } from "vue-router";

const router = useRouter();
// eslint-disable-next-line
const props = defineProps({
	selectedOptions: {
		type: Object,
		required: true,
	},
});

let selectedVaccine = ref({});
const vaccines = ref([]);

getVaccines(props.selectedOptions.disease)
	.then((response) => {
		response = response.data;
		vaccines.value = response.vaccines;
	})
	.catch((err) => {
		console.error(err);
	});

// eslint-disable-next-line
const emit = defineEmits(["select-option"]);
const loading = ref(false);

const nextStep = () => {
	router.push("confirm");
	emit("select-option", { option: "vaccine", value: selectedVaccine.value });
};
</script>

<style lang="scss"></style>
