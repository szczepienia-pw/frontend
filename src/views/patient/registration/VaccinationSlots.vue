<template>
	<div class="flex flex-column align-items-center">
		<div class="flex flex-row mb-2">
			<Calendar inline v-model="date" @click="selectedSlot = { date: '', id: '' }">
				<template #date="{ date }">
					<strong
						v-if="
							slots.some(
								(s) =>
									new Date(s.date).getFullYear() == date.year &&
									new Date(s.date).getMonth() == date.month &&
									new Date(s.date).getDate() == date.day
							)
						"
						class="highlighted-day">
						{{ date.day }}
					</strong>
					<template v-else>{{ date.day }}</template>
				</template>
			</Calendar>
			<div class="flex flex-column justify-content-center">
				<Button
					v-for="slot in chosenDay"
					:key="slot"
					:class="{
						'p-button-outlined': slot != selectedSlot,
						'm-2': true,
					}"
					:label="formatTime(slot.date)"
					@click="selectedSlot = slot" />
			</div>
		</div>
		<h3>Selected slot: {{ format(selectedSlot.date) }}</h3>
		<Button
			label="Next"
			icon-pos="right"
			icon="pi pi-angle-right"
			@click="nextStep"
			:loading="loading"
			class="mt-5"
			:disabled="selectedSlot.date == ''" />
	</div>
</template>

<script setup>
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getSlots } from "@/services/api";

const router = useRouter();

const date = ref(new Date());
const selectedSlot = ref({ date: "", id: "" });
const slots = ref([]);

onMounted(() => {
	getSlots()
		.then((response) => {
			response = response.data;
			slots.value = response;
		})
		.catch((err) => {
			console.error(err);
		});
});

const chosenDay = computed(() =>
	slots.value.filter(
		(s) =>
			new Date(s.date).getFullYear() == date.value.getFullYear() &&
			new Date(s.date).getMonth() == date.value.getMonth() &&
			new Date(s.date).getDate() == date.value.getDate()
	)
);

const formatTime = (date) => {
	const hours = new Date(date).getHours();
	const minutes = new Date(date).getMinutes();
	return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
};

const format = (date) => {
	return date.replace("T", "   ").slice(0, -3);
};

// eslint-disable-next-line
defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
});

// eslint-disable-next-line
const emit = defineEmits(["select-option"]);
const loading = ref(false);

const nextStep = () => {
	router.push("diseases");
	emit("select-option", { option: "slot", value: { id: selectedSlot.value.id, date: selectedSlot.value.date } });
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
