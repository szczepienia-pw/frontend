<template>
	<div class="flex flex-column align-items-center">
		<SlotCalendar v-model="selectedSlot"/>
		<Button
			label="Next"
			icon-pos="right"
			icon="pi pi-angle-right"
			@click="nextStep"
			class="mt-5"
			data-testid="next-1"
			:disabled="selectedSlot.date == ''" />
	</div>
</template>

<script setup>
import Button from "primevue/button";
import SlotCalendar from "@/components/SlotCalendar.vue"
import { ref } from "vue";
import { useRouter } from "vue-router";
import { setVisitRegistration } from "@/services/useVisitRegistration"

const router = useRouter();
const selectedSlot = ref({ date: "", id: "" });

const nextStep = () => {
	setVisitRegistration('slot', selectedSlot.value);
	router.push("diseases");
};
</script>

<style lang="scss" scoped>
.highlighted-day {
	background-color: var(--primary-color);
	color: #fff;
	border-radius: 50%;
	padding: 1rem;
	pointer-events: none;

	&:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}
}
</style>
