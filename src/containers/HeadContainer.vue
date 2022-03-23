<template>
  <nav v-if="!!userType">
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
import { ref, watch } from "vue";
import { useRouter, useRoute } from 'vue-router'

const router = useRouter();
const route = useRoute();
const userType = ref(Cookies.get('user-type'));

watch(() => route.name, () => {
    if(!userType.value && route.name != 'login') userType.value = Cookies.get('user-type');
})

const userLogout = function () {
    userType.value = '';
    logout();
    router.push({ name: "login" });
};
</script>

<style lang="scss"></style>