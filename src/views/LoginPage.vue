<template>
  <Card class="w-20rem">
    <template #title> Log in </template>
    <template #content>
      <div class="flex flex-column">
        <span class="p-float-label mb-4">
          <InputText class="w-full" id="email-input" type="text" v-model="email" />
          <label for="email-input">Email</label>
        </span>
 <span class="p-float-label mb-6">
          <Password
          id="password-input"
          inputClass="w-full"
          class="w-full"
          v-model="password"
          :feedback="false"
        />
          <label for="password-input">Password</label>
        </span>
        
        <Button label="Log in" @click="login" :loading="isLoading" />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from "vue";
import * as Api from "../services/api";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const isLoading = ref(false);
const router = useRouter();

function login() {
  isLoading.value = true;
  Api.loginDoctor(email.value, password.value)
    .then(() => {
      router.push({ name: "doctor" });
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      isLoading.value = false;
    });
}
</script>

<style lang="scss"></style>
