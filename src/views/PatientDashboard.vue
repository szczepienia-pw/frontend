<template>
    <div>
        Lorem ipsum
    </div>
</template>

<script setup>


import {useUserSession} from '@/services/useUserSession'

console.log(useUserSession().userInfo)

</script>

<style lang="scss">

</style>