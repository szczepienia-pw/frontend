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
import { useCookies } from '@vueuse/integrations/useCookies'

const userType = useCookies().get('user-type')
const loggedIn = useCookies().get('logged-in')
</script>

<style lang="scss">
    
</style>