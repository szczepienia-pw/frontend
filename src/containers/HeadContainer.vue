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
    import { useCookies } from '@vueuse/integrations/useCookies'

    const userType = useCookies().get('user-type')
</script>

<style lang="scss">
    
</style>