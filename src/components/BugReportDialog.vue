<template>
    <Dialog :visible="visible" @update:visible="$emit('hide')">
        <template #header>
            <h3>Report a bug</h3>
        </template>
        <div class="flex flex-column pt-4">
            <span class="p-float-label mb-5">
            <InputText
                class="w-full"
                id="name-input"
                type="text"
                v-model="name"
            />
            <label for="name-input">Bug name</label>
            </span>

            <span class="p-float-label mb-2">
            <Textarea
                class="w-full"
                id="desc-input"
                v-model="description"
                rows="8"
                cols="50"
            />
            <label for="desc-input">Bug description</label>
            </span>
        </div>
        <template #footer>
            <Button label="Send" icon="pi pi-check" @click="report" :loading="loading"/>
        </template>
    </Dialog>
</template>

<script>

import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";

import { ref } from "vue";
import { reportBug } from "../services/api";
import { useToast } from "primevue/usetoast";

export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    components: {
        Dialog,
        Button,
        InputText,
        Textarea
    },
    setup(_, context) {
        const name = ref("");
        const description = ref("");
        const loading = ref(false);
        const toast = useToast();

        function report() {
            loading.value = true;
            reportBug(name.value, description.value)
                .then(() => {
                    toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Successfully reported bug',
                        life: 3000
                    })
                })
                .catch(err => {
                    console.error(err)
                    toast.add({
                        severity: 'error',
                        summary: err?.response?.statusText || 'Error',
                        detail: err?.response?.data?.msg || 'Could not report bug',
                        life: 3000
                    })
                })
                .finally(() => {
                    loading.value = false;
                    context.emit('hide');
                    name.value = "";
                    description.value = "";
                })
        }

        return {
            name,
            description,
            loading,
            report
        }
    },
}

</script>

<style lang="scss">

</style>