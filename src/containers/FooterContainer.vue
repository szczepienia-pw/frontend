<template>
  <footer>
    <Dialog v-model:visible="display">
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
        <Button label="Send" icon="pi pi-check" @click="report" />
      </template>
    </Dialog>
    <Button label="Report a bug" @click="display = true" />
  </footer>
</template>

<script setup>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import { ref } from "vue";
import { reportBug } from "../services/api";

const display = ref(false);
const name = ref("");
const description = ref("");

function report() {
  reportBug(name.value, description.value);
  display.value = false;
  name.value = "";
  description.value = "";
}
</script>

<style lang="scss"></style>
