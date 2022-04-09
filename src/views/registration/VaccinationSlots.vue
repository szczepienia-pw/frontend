<template>
	slots
	<Button
		label="Next"
		icon-pos="right"
		icon="pi pi-angle-right"
		@click="$router.push('diseases')"
		:loading="loading" class="mt-5"/>
</template>

<script setup>
import Button from "primevue/button";
import { ref } from "vue";

// eslint-disable-next-line
defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
});

// eslint-disable-next-line
const emit = defineEmits(["next-page"]);
const loading = ref(false);
</script>

<style lang="scss"></style>
