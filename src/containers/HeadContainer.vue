<template>
    <nav>
        <div v-if="userType === 'doctor'">
            This is a doctor nav component
        </div>
        <div v-else>
            This is a patient nav component
        </div>
    </nav>
</template>

<script setup>
    import Cookies from '../services/cookies'

    const userType = Cookies.getCookie('userType')
</script>

<style lang="scss">
    
</style>