<template>
    <Card class="data-card">
        <template #title>Edit settings</template>
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

.p-inputtext {
	width: 250px;
}
</style>
