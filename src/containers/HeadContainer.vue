<template>
    <nav v-if="loggedIn">
        <div v-if="userType === 'doctor'">
            This is a doctor nav component
        </div>
        <div v-else>
            This is a patient nav component
        </div>
    </nav>
    <Toast /> 
</template>

<script setup>
    import { useCookies } from '@vueuse/integrations/useCookies'

    const userType = useCookies().get('user-type')
    const loggedIn = useCookies().get('logged-in')
</script>

<style lang="scss">
    
</style>