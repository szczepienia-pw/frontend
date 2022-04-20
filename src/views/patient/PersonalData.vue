<template>
	<Card class="data-card">
		<template #title>Edit your personal data</template>
		<template #content>
			<div class="flex flex-column">
				<div class="flex flex-row">
					<div>
						<Inplace :closable="true" class="inplace">
							<template #display>
								<span class="label">{{ patientData.firstName }}</span>
								<span class="pi pi-pencil" style="vertical-align: middle"></span>
							</template>
							<template #content>
								<InputText v-model="patientData.firstName" autoFocus />
							</template>
						</Inplace>
						<Inplace :closable="true" class="inplace">
							<template #display>
								<span class="label">{{ patientData.lastName }}</span>
								<span class="pi pi-pencil" style="vertical-align: middle"></span>
							</template>
							<template #content>
								<InputText v-model="patientData.lastName" autoFocus />
							</template>
						</Inplace>
						<Inplace :closable="true" class="inplace">
							<template #display>
								<span
									class="label"
									:style="[patientData.password.length && { '-webkit-text-security': 'disc' }]">
									{{ patientData.password.length > 1 ? patientData.password : "Enter new password" }}
								</span>
								<span class="pi pi-pencil" style="vertical-align: middle"></span>
							</template>
							<template #content>
								<Password v-model="patientData.password" toggleMask>
									<template #header>
										<h6>Pick a password</h6>
									</template>
									<template #footer="sp">
										{{ sp.level }}
										<Divider />
										<p class="mt-2">Suggestions</p>
										<ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
											<li>At least one lowercase</li>
											<li>At least one uppercase</li>
											<li>At least one numeric</li>
											<li>Minimum 8 characters</li>
										</ul>
									</template>
								</Password>
							</template>
						</Inplace>
						<Inplace :closable="true" class="inplace">
							<template #display>
								<span class="label">{{ patientData.address.street }}</span>
								<span class="pi pi-pencil" style="vertical-align: middle"></span>
							</template>
							<template #content>
								<InputText v-model="patientData.address.street" autoFocus />
							</template>
						</Inplace>
					</div>
					<div>
						<Inplace :closable="true" class="inplace">
							<template #display>
								<span class="label">{{ patientData.address.houseNumber }}</span>
								<span class="pi pi-pencil" style="vertical-align: middle"></span>
							</template>
							<template #content>
								<InputText v-model="patientData.address.houseNumber" autoFocus />
							</template>
						</Inplace>
						<Inplace :closable="true" class="inplace">
							<template #display>
								<span class="label">{{ patientData.address.localNumber }}</span>
								<span class="pi pi-pencil" style="vertical-align: middle"></span>
							</template>
							<template #content>
								<InputText v-model="patientData.address.localNumber" autoFocus />
							</template>
						</Inplace>
						<Inplace :closable="true" class="inplace">
							<template #display>
								<span class="label">{{ patientData.address.city }}</span>
								<span class="pi pi-pencil" style="vertical-align: middle"></span>
							</template>
							<template #content>
								<InputText v-model="patientData.address.city" autoFocus />
							</template>
						</Inplace>
						<Inplace :closable="true" class="inplace">
							<template #display>
								<span class="label">{{ patientData.address.zipCode }}</span>
								<span class="pi pi-pencil" style="vertical-align: middle"></span>
							</template>
							<template #content>
								<InputMask v-model="patientData.address.zipCode" mask="99-999" />
							</template>
						</Inplace>
					</div>
				</div>
				<Button class="confirm-button" label="Confirm" @click="compareAndSendData" :loading="isLoading" />
			</div>
		</template>
	</Card>
</template>

<script setup>
import Inplace from "primevue/inplace";
import InputText from "primevue/inputtext";
import Card from "primevue/card";
import InputMask from "primevue/inputmask";
import Button from "primevue/button";
import Password from "primevue/password";
import Divider from "primevue/divider";
import { changeData } from "@/services/api";
import { useToast } from "primevue/usetoast";
import { useUserSession, saveUserSession } from "@/services/useUserSession";
import { ref } from "vue";
import { errorToast, objectDiff, successToast } from "@/services/helpers";

// eslint-disable-next-line
defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
});

// eslint-disable-next-line
const emit = defineEmits(["hide"]);
const toast = useToast();
const userData = { ...useUserSession().userInfo, password: "" };
const patientData = ref({ ...JSON.parse(JSON.stringify(userData)), password: "" });
const isLoading = ref(false);

const compareAndSendData = () => {
	const changes = objectDiff(patientData.value, userData);
	if (Object.keys(changes).length === 0) {
		errorToast(toast, "No changes were made");
	} else {
		sendData(changes);
	}
};

const sendData = (changes) => {
	isLoading.value = true;
	changeData(changes)
		.then((response) => {
			response = response.data
			useUserSession().userInfo = response;
			saveUserSession();
			emit("hide");
			successToast(toast, "Successfully changed data");
		})
		.catch((err) => {
			console.error(err);
			errorToast(toast, "Could not change data", err);
		})
		.finally(() => {
			isLoading.value = false;
		});
};
</script>

<style lang="scss" scoped>
.data-card.p-card,
.data-card :deep() {
    width: unset;

	.p-card-header {
		display: flex;
		width: 100%;
		padding-right: 20px;
		padding-top: 10px;
		justify-content: flex-end;
	}

	.p-card-body {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;

        .inplace, .confirm-button {
            margin: 1.25rem;
        }

		.p-button.p-button-icon-only {
			margin-left: -3.7px;
		}
	}
}
.data-card :deep(.p-card-content) {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.label {
	display: inline-block;
	vertical-align: middle;
	width: 200px;
}
.pi-times:not(.btn):before {
	content: "\e909";
}

.p-inputtext {
	width: 200px;
}
</style>
