<template>
    <Dialog :visible="visible" @update:visible="$emit('hide')">
        <template #header>
            <h3>Report a bug</h3>
        </template>
        <div class="flex flex-column pt-4">
            <div class="p-float-label mb-5">
                <InputText
                    class="w-full"
                    id="name-input"
                    type="text"
                    v-model="name"
                />
                <label for="name-input">Bug name</label>
            </div>

            <div class="p-float-label mb-2">
                <Textarea
                    class="w-full"
                    id="desc-input"
                    v-model="description"
                    rows="8"
                    cols="50"
                />
                <label for="desc-input">Bug description</label>
            </div>
        </div>
        <template #footer>
            <Button
                label="Send"
                icon="pi pi-check"
                @click="report"
                :loading="loading"
            />
        </template>
    </Dialog>
</template>

<script setup>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import { ref } from "vue";
import { reportBug } from "../services/api";
import { useToast } from "primevue/usetoast";
import { errorToast, successToast } from "@/services/helpers";

// eslint-disable-next-line
defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
});

// eslint-disable-next-line
const emit = defineEmits(["hide"]);

const name = ref("");
const description = ref("");
const loading = ref(false);
const toast = useToast();

function report() {
    loading.value = true;
    reportBug(name.value, description.value)
        .then(() => {
            successToast(toast, "Successfully reported bug");
        })
        .catch((err) => {
            console.error(err);
            errorToast(toast, "Could not report bug", err)
        })
        .finally(() => {
            loading.value = false;
            emit("hide");
            name.value = "";
            description.value = "";
        });
}
</script>

<style lang="scss">
</style>