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
          <Button label="Log in" @click="login" :loading="isLoading" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import * as Api from "../services/api";
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
    label: 'Patient log-in',
    command: () => {
      userType.value = 'patient'
    }
  },
  {
    label: 'Doctor log-in',
    command: () => {
      userType.value = 'doctor'
    }
  },
  {
    label: 'Administrator log-in',
    command: () => {
      userType.value = 'admin'
    }
  }
].filter(item => !item.label.toLowerCase().includes(userType.value)))

function login() {
  isLoading.value = true;
  Api.login(userType.value, email.value, password.value)
    .then(() => {
      router.push({ name: userType });
    })
    .catch((err) => {
      console.error(err);
      toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Could not log in',
                    life: 3000
                })
    })
    .finally(() => {
      isLoading.value = false;
    });
}
</script>

<style lang="scss"></style>
