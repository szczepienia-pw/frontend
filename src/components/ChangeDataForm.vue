<template>
	<Card v-if="visible" :visible="visible" @update:visible="$emit('hide')" class="data-card">
		<template #title>Edit your personal data</template>
		<template #header>
			<Button
				icon="pi pi-times btn"
				class="p-button-text p-button-rounded"
				style="width: 20px; align-self: flex-end"
                @update:visible="$emit('hide')"
				@click="$emit('hide')" />
		</template>
		<template #content>
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
					<span class="label" :style="[patientData.password.length && { '-webkit-text-security': 'disc' }]">
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
			<Button class="" label="Confirm" @click="compareData" :loading="isLoading" />
		</template>
	</Card>
</template>

<script setup>
import { useUserSession } from "@/services/useUserSession";
import Inplace from "primevue/inplace";
import InputText from "primevue/inputtext";
import Card from "primevue/card";
import InputMask from "primevue/inputmask";
import Button from "primevue/button";
import { changeData } from "@/services/api";
import { useToast } from "primevue/usetoast";
import Password from "primevue/password";
import Divider from "primevue/divider";
import Cookies from "js-cookie";
import { ref, defineProps, defineEmits } from "vue";

defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
});
const emit = defineEmits(["hide"]);

const isLoading = ref(false);
const toast = useToast();

const compare = (obj1, obj2, properties = {}, objKey = null) => {
	Object.keys(obj1).forEach((key) => {
		if (typeof obj1[key] === "object") {
			compare(obj1[key], obj2[key], properties, key);
		} else if (obj1[key] != obj2[key]) {
			if (objKey) {
				if (!properties[objKey]) properties[objKey] = {};
				properties[objKey][key] = obj1[key];
			} else properties[key] = obj1[key];
		}
	});
	return properties;
};

const compareData = () => {
	const changes = compare(patientData, userData);
	if (Object.keys(changes).length === 0) {
		toast.add({
			severity: "error",
			summary: "Error",
			detail: "No changes made",
			life: 3000,
		});
	} else {
		console.log(changes);
		sendData(changes);
	}
};

const sendData = (changes) => {
	isLoading.value = true;
	changeData(changes)
		.then((response) => {
			useUserSession().userInfo = response;
			Cookies.set("user-info", JSON.stringify(response));
            emit("hide");
            toast.add({
                severity: "success",
                summary: "Success",
                detail: "Successfully changed your data",
                life: 3000,
            });
		})
		.catch((err) => {
			console.error(err);
			toast.add({
				severity: "error",
				summary: err?.response?.statusText || "Error",
				detail: err?.response?.data?.msg || "Could not process your request",
				life: 3000,
			});
		})
		.finally(() => {
			isLoading.value = false;
		});
};

const userData = JSON.parse(JSON.stringify(useUserSession().userInfo));
userData["password"] = "";

const patientData = {
	firstName: userData.firstName,
	lastName: userData.lastName,
	password: "",
	address: {
		city: userData.address.city,
		zipCode: userData.address.zipCode,
		street: userData.address.street,
		houseNumber: userData.address.houseNumber,
		localNumber: userData.address.localNumber,
	},
};
</script>

<style lang="scss">
.data-card.p-card,
.data-card .p-card-body {
	min-height: 24rem;
	height: 100%;
	width: 20rem;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
}
.data-card .p-card-content {
	height: 100%;
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
.p-inplace .p-inplace-display {
	padding-bottom: 12px;
	padding-top: 6px;
	height: 40px;
	border: 1px solid #2196f3;
}
.p-inplace .p-inplace-display:not(.p-disabled):hover {
	background-color: #eef7ff;
}
.p-button.p-button-icon-only {
	margin-left: -3px;
}
.inplace {
	padding-top: 8px;
	padding-bottom: 8px;
	height: 42px;
	margin-bottom: 20px;
}
.p-password-input {
	width: 200px;
}
.p-card-header {
	display: flex;
	width: 100%;
	padding-right: 20px;
	padding-top: 10px;
	justify-content: flex-end;
}
.p-inputtext {
	width: 200px;
}
</style>
