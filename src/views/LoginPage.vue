<template>
  <div class="w-screen h-screen flex justify-content-center align-items-center">
    <Card class="w-20rem">
      <template #title> Log in </template>
      <template #content>
        <div class="flex flex-column">
          <span class="p-float-label mb-4">
            <InputText
              class="w-full"
              id="email-input"
              type="text"
              v-model="email"
            />
            <label for="email-input">Email</label>
          </span>
          <span class="p-float-label">
            <Password
              id="password-input"
              inputClass="w-full"
              class="w-full"
              v-model="password"
              :feedback="false"
            />
            <label for="password-input">Password</label>
          </span>
          <Button
            :label="`Not ${userType == 'admin' ? 'an' : 'a'} ${userType == 'admin' ? 'administrator' : userType}?`"
            class="p-button-link align-self-end mb-6 p-0"
            @click="toggleMenu"
          />
          <Menu ref="userTypeMenu" :model="userTypes" :popup="true" />
          <Button label="Log in" @click="sendLoginRequest" :loading="isLoading" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Menu from "primevue/menu";

import { computed, ref } from "vue";
import { login } from "@/services/api";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

const email = ref("");
const password = ref("");
const isLoading = ref(false);
const userType = ref('patient');
const userTypeMenu = ref();

const router = useRouter();
const toast = useToast();

const toggleMenu = (event) => {
  userTypeMenu.value.toggle(event);
}

const userTypes = computed(() => [
  {
    label: 'Log in as patient',
    command: () => {
      userType.value = 'patient'
    }
  },
  {
    label: 'Log in as doctor',
    command: () => {
      userType.value = 'doctor'
    }
  },
  {
    label: 'Log in as admin',
    command: () => {
      userType.value = 'admin'
    }
  }
].filter(item => !item.label.toLowerCase().includes(userType.value)))

function sendLoginRequest() {
  isLoading.value = true;
  login(userType.value, email.value, password.value)
    .then(() => {
      router.push({ name: userType.value });
    })
    .catch((err) => {
      console.error(err);
      toast.add({
                  severity: 'error',
                  summary: err?.response?.statusText || 'Error',
                  detail: err?.response?.data?.msg || 'Could not log in',
                  life: 3000
                })
    })
    .finally(() => {
      isLoading.value = false;
    });
}
</script>

<style lang="scss"></style>
