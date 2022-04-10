<template>
    {{selectedOptions.slot.date}}
    {{selectedOptions.disease}}
	{{selectedOptions.vaccine.name}}
	<div class="mt-5">
		<Button label="Back" icon="pi pi-angle-left" @click="$router.back()" :loading="loading"  class="mr-1"/>
		<Button
			label="Confirm"
			icon-pos="right"
			icon="pi pi-angle-right"
			:loading="loading"  class="ml-1"/>
	</div>
</template>

<script setup>
import Button from "primevue/button";
import { ref } from "vue";
// eslint-disable-next-line
const props = defineProps({
	selectedOptions: {
		type: Object,
		required: true
	}
});

const loading = ref(false);
</script>

<style lang="scss"></style>
