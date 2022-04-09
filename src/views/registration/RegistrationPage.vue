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

				<router-view
					v-slot="{ Component }"
					:formData="formObject"
					@prevPage="prevPage($event)"
					@nextPage="nextPage($event)"
					@complete="complete">
					<keep-alive>
						<component
							:is="Component"
                            :selectedVaccine="selectedVaccine"
							@selectVaccine="(vaccine) => (selectedVaccine = vaccine)"
							:selectedDisease="selectedDisease"
							@selectDisease="(disease) => (selectedDisease = disease)" />
					</keep-alive>
				</router-view>
			</div>
		</template>
	</Card>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import Steps from "primevue/steps";
import Toast from "primevue/toast";
import Card from "primevue/card";

const router = useRouter();
const toast = useToast();
const selectedDisease = ref();
const items = ref([
	{
		label: "Time slot",
		to: "/patient/registration/slots",
	},
	{
		label: "Choose disease",
		to: "/patient/registration/diseases",
	},
	{
		label: "Vaccine type",
		to: "/patient/registration/vaccines",
	},
	{
		label: "Confirmation",
		to: "/patient/registration/confirm",
	},
]);
const formObject = ref({});

const nextPage = (event) => {
	console.log(event);
	// for (let field in event.formData) {
	// 	formObject.value[field] = event.formData[field];
	// }
	router.push(items.value[event.pageIndex + 1].to);
};
const prevPage = (event) => {
	router.push(items.value[event.pageIndex - 1].to);
};
const complete = () => {
	toast.add({
		severity: "success",
		summary: "Order submitted",
		detail: "Dear, " + formObject.value.firstname + " " + formObject.value.lastname + " your order completed.",
	});
};
</script>

<style scoped lang="scss">
::v-deep(b) {
	display: block;
}

::v-deep(.p-card-body) {
	padding: 2rem;
}

.p-card {
	width: unset;
}
</style>
