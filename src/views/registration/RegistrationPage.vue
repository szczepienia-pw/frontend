<template>
	???
	<div>
		<Toast />

		<div class="card">
			<Steps :model="items"/>
		</div>

		<router-view
			v-slot="{ Component }"
			:formData="formObject"
			@prevPage="prevPage($event)"
			@nextPage="nextPage($event)"
			@complete="complete">
			<keep-alive>
				<component :is="Component" />
			</keep-alive>
		</router-view>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import Steps from "primevue/steps";
import Toast from "primevue/toast";

const router = useRouter();
const toast = useToast();
const items = ref([
	{
		label: "Time slot",
		to: "/patient/registration/slots",
	},
	{
		label: "Vaccine type",
		to: "/patient/registration/vaccines",
	},
	{
		label: "Confirmation",
		to: "/patient/registration/confirm",
	}
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
</style>
