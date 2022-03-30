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
 
const compare = (obj1, obj2) => {
    let res = {};
	Object.keys(obj1).forEach((key) => {
		if (typeof obj1[key] === "object") {
            let deepCompare = compare(obj1[key], obj2[key]);
            if(Object.keys(deepCompare).length > 0) res[key] = deepCompare;
		} else if (obj1[key] != obj2[key]) {
			res[key] = obj1[key];
		}
	});
	return res;
};

const compareData = () => {
	const changes = compare(patientData.value, userData);
	if (Object.keys(changes).length === 0) {
		toast.add({
			severity: "error",
			summary: "Error",
			detail: "No changes made",
			life: 3000,
		});
	} else {
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

const userData = {...useUserSession().userInfo, password: ""};
const patientData = ref({...JSON.parse(JSON.stringify(userData)), password: ""});

</script>

<style lang="scss" scoped>
.data-card.p-card,
.data-card ::v-deep {
    .p-card-header {
        display: flex;
        width: 100%;
        padding-right: 20px;
        padding-top: 10px;
        justify-content: flex-end;
    }

    .p-card-body  {
        width: 20rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        .p-button.p-button-icon-only {
            margin-left: -3.7px;
        }
    }
}
.data-card ::v-deep .p-card-content {
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

.inplace ::v-deep {
	padding-top: 8px;
	padding-bottom: 8px;
	height: 42px;
	margin-bottom: 20px;

    .p-password-input {
        width: 200px;
    }

    .p-inplace-display {
        padding-bottom: 12px;
        padding-top: 8px;
        height: 40px;
        border: 1px solid #2196f3;
    }

    .p-inplace-display:not(.p-disabled):hover {
        background-color: #eef7ff;
    }

    .p-inplace-content {
        position: relative;
        top: -9px;
        & > * {
            height: 41px;
        }
    }
}

.p-inputtext {
	width: 200px;
}
</style>
