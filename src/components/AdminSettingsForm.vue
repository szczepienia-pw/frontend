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
import { errorToast, successToast } from "@/services/helpers";
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";

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
const isLoading = ref(false);
const adminSettings = ref({})

onMounted(() => {
    isLoading.value = true;
    getAdminSettings()
        .then(response => {
            adminSettings.value = response.data;
        })
        .catch(err => {
            console.error(err);
			errorToast(toast, "Could not retrieve settings", err);
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
			successToast(toast, "Successfully changed settings");
		})
		.catch((err) => {
			console.error(err);
			errorToast(toast, "Could not change settings", err);
		})
		.finally(() => {
			isLoading.value = false;
		});
};

</script>

<style lang="scss" scoped>
.data-card.p-card,
.data-card :deep() {
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
.data-card :deep(.p-card-content) {
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

.inplace :deep() {
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
