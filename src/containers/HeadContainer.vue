<template>
  <nav v-if="!onLoginPage">
    <Button label="Log out" @click="userLogout" />
    <div v-if="userType === 'doctor'">doctor</div>
    <div v-else>patient</div>
  </nav>
  <Toast />
</template>

<script setup>
import Toast from "primevue/toast";
import Button from "primevue/button";

import Cookies from "js-cookie";
import { logout } from "../services/api";
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

const onLoginPage = computed(() => route.name == 'login');
const userType = computed(() => onLoginPage.value ? null : Cookies.get('user-type'));
const router = useRouter();

const userLogout = function () {
  logout();
  router.push({ name: "login" });
};
</script>

<style lang="scss"></style>