<template>
	<SelectButton v-model="selectedDisease" :options="diseases" />
	<div class="mt-5">
		<Button label="Back" icon="pi pi-angle-left" @click="$router.back()" :loading="loading" class="mr-1" />
		<Button
			label="Next"
			icon-pos="right"
			icon="pi pi-angle-right"
			@click="() => nextStep()"
			:loading="loading"
			class="ml-1"
			:disabled="selectedDisease == ''" />
	</div>
</template>

<script setup>
import Button from "primevue/button";
import { ref } from "vue";
import SelectButton from "primevue/selectbutton";
import { getDiseases } from "@/services/api";
import { useRouter } from "vue-router";

const router = useRouter();
const selectedDisease = ref("");
const diseases = ref(getDiseases());
const loading = ref(false);

// eslint-disable-next-line
const emit = defineEmits(["select-option"]);

const nextStep = () => {
	emit("select-option", { option: "disease", value: selectedDisease });
	router.push("vaccines");
};
</script>

<style lang="scss" scoped>
.p-selectbutton:deep() > div {
	width: 100px;
	padding: 8px;
}
</style>
