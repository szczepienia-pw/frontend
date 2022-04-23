<template>
	<div class="flex flex-column align-items-center">
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
	</div>
</template>

<script setup>
import Button from "primevue/button";
import { ref } from "vue";
import SelectButton from "primevue/selectbutton";
import { getDiseases } from "@/services/api";
import { useRouter } from "vue-router";
import { setVisitRegistration } from "@/services/useVisitRegistration"

const router = useRouter();
const selectedDisease = ref("");
const diseases = ref(getDiseases());
const loading = ref(false);

const nextStep = () => {
	setVisitRegistration('disease', selectedDisease.value);
	router.push("vaccines");
};
</script>

<style lang="scss" scoped>
.p-selectbutton:deep() > div {
	width: 100px;
	padding: 8px;
}
</style>
