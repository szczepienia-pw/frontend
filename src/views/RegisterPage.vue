<template>
    <div
		class="flex flex-row justify-content-center align-items-center"
		style="padding-top: 150px; padding-bottom: 150px; min-height: 100vh"
    >
        <Card>
            <template #title>
                {{ title }}
            </template>
            <template #content>
                {{ msg }}
            </template>
            <template #footer>
                <Button label="Go back" @click="$router.replace('/')" />
            </template>
        </Card>
	</div>
</template>

<script setup>
import Button from "primevue/button";
import { confirmRegistration } from "@/services/api";
import { errorToast } from "@/services/helpers";
import { onMounted, ref } from "@vue/runtime-core";
import Card from "primevue/card";
import { useToast } from "primevue/usetoast";
import { useRoute } from "vue-router";

const route = useRoute();
const title = ref("Your registration was successful.");
const msg = ref("Please check the e-mail you provided for a confirmation link.");
const toast = useToast();

onMounted(() => {
	if (route.query.token) {
		confirmRegistration(route.query.token)
			.then(() => {
				msg.value = "Thank you. Your registration has been confirmed.";
			})
			.catch((err) => {
				console.error(err);
				title.value = "There was an error.";
				msg.value = "Something went wrong when we tried to confirm your registration. Please try again.";
				errorToast(toast, "There was an error with your request", err);
			});
	}
});
</script>

<style lang="scss">
main {
	width: 100% !important;
	left: 0 !important;
}
</style>