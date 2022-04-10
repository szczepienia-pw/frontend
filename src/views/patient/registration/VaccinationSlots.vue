<template>
	<div class="flex flex-row">
		<Calendar inline v-model="date">
			<template #date="{date}">
				<strong v-if="slots.some(s => s.date.getFullYear() == date.year && s.date.getMonth() == date.month && s.date.getDate() == date.day)" class="highlighted-day">{{date.day}}</strong>
				<template v-else>{{date.day}}</template>
			</template>
		</Calendar>
		<div class="flex flex-column justify-content-center">
			<Button
				v-for="slot in chosenDay"
				:key="slot"
				:class="{
					'p-button-outlined': slot != selectedSlot,
					'm-2': true
				}"
				:label="formatTime(slot.date)"
				@click="selectedSlot = slot"
			/>
		</div>
	</div>
	Selected slot: {{ selectedSlot.date.toLocaleString() }}
	<Button
		label="Next"
		icon-pos="right"
		icon="pi pi-angle-right"
		@click="nextStep"
		:loading="loading" class="mt-5"
	/>
</template>

<script setup>
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const date = ref(new Date());
const selectedSlot = ref({date: ''});

const slots = ref(
	[...Array(30).keys()].map(id => {
		let date = new Date();
		date.setDate(id % 15);
		date.setHours(id);
		//date = date.toISOString();
		return {
			id,
			date
		}
	})
)

const chosenDay = computed(() => (
	slots.value.filter(s => s.date.getFullYear() == date.value.getFullYear() && s.date.getMonth() == date.value.getMonth() && s.date.getDate() == date.value.getDate())
))

const formatTime = (date) => {
	const hours = date.getHours();
	const minutes = date.getMinutes();
	return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

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
	router.push('diseases');
	emit('select-option', { option: 'slot', value: { id: selectedSlot.value.id, date: selectedSlot.value.date.toISOString()} });
}
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
