<template>
	<Card>
		<template #content>
			<div class="w-30rem flex flex-column justify-content-between align-items-center" style="gap: 20px">
				<Toast />
				<div class="w-30rem flex flex-row flex-justify-center">
					<div class="card w-30rem pb-4">
						<Steps :model="items" />
					</div>
				</div>

				<router-view v-slot="{ Component }">
					<keep-alive>
						<component
							:is="Component"
							:selectedOptions="selectedOptions"
							@select-option="({ option, value }) => (selectedOptions[option] = value)" />
					</keep-alive>
				</router-view>
			</div>
		</template>
	</Card>
</template>

<script setup>
import { ref } from "vue";
//import { useRouter } from "vue-router";
//import { useToast } from "primevue/usetoast";
import Steps from "primevue/steps";
import Toast from "primevue/toast";
import Card from "primevue/card";

//const router = useRouter();
//const toast = useToast();
const selectedOptions = ref({
	vaccine: "",
	slot: {},
	disease: "",
});
const path = "/patient/registration";
const items = ref([
	{
		label: "Time slot",
		to: `${path}/slots`,
	},
	{
		label: "Choose disease",
		to: `${path}/diseases`,
	},
	{
		label: "Vaccine type",
		to: `${path}/vaccines`,
	},
	{
		label: "Confirmation",
		to: `${path}/confirm`,
	},
]);
</script>

<style scoped lang="scss">
.p-card {
	width: unset;
}
</style>
