<template>
slots
	<Button label="Send" icon="pi pi-check" @click="$router.push('vaccines')" :loading="loading" />
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
