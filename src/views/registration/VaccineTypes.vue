<template>
	<Dropdown v-model="selectedVaccine" :options="vaccines" placeholder="Select vaccine" optionLabel="name" />
	<div class="mt-5">
		<Button label="Back" icon="pi pi-angle-left" @click="$router.back()" :loading="loading" class="mr-1" />

		<Button
			label="Next"
			icon-pos="right"
			icon="pi pi-angle-right"
			@click="nextStep"
			:loading="loading"
			class="ml-1" />
	</div>
</template>

<script setup>
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import { ref } from "vue";
import { getVaccines } from "../../services/api";
import { useRouter } from "vue-router";

const router = useRouter();


let selectedVaccine = ref();
const vaccines = getVaccines(props.selectedDisease);
console.log(vaccines);
// eslint-disable-next-line
const props = defineProps({
	selectedDisease: {
		type: String,
		default: "",
	},
});

// eslint-disable-next-line
const emit = defineEmits(["selectVaccine"]);
const loading = ref(false);

const nextStep = () => {
	router.push("confirm");
	emit("selectVaccine", selectedVaccine.value);
};
</script>

<style lang="scss"></style>
