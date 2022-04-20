<template>
    <main>
        <router-view />
    </main>
</template>

<script setup>

</script>

<style lang="scss" scoped>

main {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 64vw;
    min-height: 100vh;
    left: 22rem;

    & > div {
        width: 100%;
    }
}

</style>