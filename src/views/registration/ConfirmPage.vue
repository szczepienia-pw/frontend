<template>
    {{props.selectedVaccine.disease}}
    {{props.selectedVaccine.name}}
	<div class="mt-5">
		<Button label="Back" icon="pi pi-angle-left" @click="$router.back()" :loading="loading"  class="mr-1"/>
		<Button
			label="Confirm"
			icon-pos="right"
			icon="pi pi-angle-right"
			@click="$emit('next-page', { formData: {}, pageIndex: 2 })"
			:loading="loading"  class="ml-1"/>
	</div>
</template>

<script setup>
import Button from "primevue/button";
import { ref } from "vue";
// eslint-disable-next-line
const props = defineProps({
	selectedDisease: {
		type: String,
		default: "",
	},
    selectedVaccine: {
		type: String,
		default: "",
	},
    selectedDate: {
		type: Date,
		default: "",
	},
});

// eslint-disable-next-line
const emit = defineEmits(["next-page"]);
const loading = ref(false);
</script>

<style lang="scss"></style>
