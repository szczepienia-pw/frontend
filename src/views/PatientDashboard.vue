<template>
	<div
		class="flex flex-row justify-content-center align-items-center"
		style="padding-top: 50px; padding-bottom: 50px; min-height: 85vh">
		<Button v-if="!dialogVisible" label="Edit personal data" @click="dialogVisible = !dialogVisible" />
		<ChangeDataForm :visible="dialogVisible" @hide="dialogVisible = false" />
	</div>
</template>

<script setup>
import ChangeDataForm from "@/components/ChangeDataForm";
import Button from "primevue/button";
import { ref } from "vue";

const dialogVisible = ref(false);
</script>

<style lang="scss"></style>
