<template>
	<Card v-if="visible" :visible="visible" @update:visible="$emit('hide')" class="data-card">
		<template #title>Edit settings</template>
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
					<span class="label">{{ adminSettings.bugEmail }}</span>
					<span class="pi pi-pencil" style="vertical-align: middle"></span>
				</template>
				<template #content>
					<InputText v-model="adminSettings.bugEmail" autoFocus />
				</template>
			</Inplace>
			
			<Button class="" label="Confirm" @click="sendData" :loading="isLoading" />
		</template>
	</Card>
</template>

<script setup>
import Inplace from "primevue/inplace";
import InputText from "primevue/inputtext";
import Card from "primevue/card";
import Button from "primevue/button";
import { changeAdminSettings, getAdminSettings } from "@/services/api";
import { useToast } from "primevue/usetoast";
import { ref, defineProps, defineEmits, onMounted } from "vue";

defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
});
const emit = defineEmits(["hide"]);

const isLoading = ref(false);
const toast = useToast();
const adminSettings = ref({})

onMounted(() => {
    isLoading.value = true;
    getAdminSettings()
        .then(response => {
            adminSettings.value = response.data;
        })
        .catch(err => {
            console.error(err);
            toast.add({
				severity: "error",
				summary: err?.err?.statusText || "Error",
				detail: err?.err?.data?.msg || "Could not process your request",
				life: 3000,
			});
        })
        .finally(() => {
            isLoading.value = false;
        })
})

const sendData = () => {
	isLoading.value = true;
	changeAdminSettings(adminSettings.value?.bugEmail)
		.then(() => {
            emit("hide");
            toast.add({
                severity: "success",
                summary: "Success",
                detail: "Successfully changed settings",
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

</script>

<style lang="scss" scoped>
.data-card.p-card,
.data-card ::v-deep {
    width: 25rem;
    margin: 5rem;

    .p-card-header {
        display: flex;
        width: 100%;
        padding-right: 20px;
        padding-top: 10px;
        justify-content: flex-end;
    }

    .p-card-body  {
        width: 25rem;
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
	width: 250px;
}
.pi-times:not(.btn):before {
	content: "\e909";
}

.inplace ::v-deep {
	padding-top: 8px;
	padding-bottom: 8px;
	height: 42px;
	margin-bottom: 20px;

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
	width: 250px;
}
</style>
