<template>
    <nav v-if="loggedIn">
        <div v-if="userType === 'doctor'">
            
        </div>
        <div v-else>
            
        </div>
    </nav>
    <Toast /> 
</template>

<script setup>
import Toast from "primevue/toast";
import Cookies from 'js-cookie'

const userType = Cookies.get('user-type')
const loggedIn = Cookies.get('logged-in')
</script>

<style lang="scss">
    
</style>