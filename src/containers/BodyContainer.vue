<template>
    <main :class="{'centered': centered}">
        <router-view />
    </main>
</template>

<script setup>
import { computed } from "@vue/runtime-core";
import { useRoute } from "vue-router";

const route = useRoute();

const centered = computed(() => {
    if(['login', 'register'].includes(route.name)) return true;
    else return false;
})
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

    &.centered {
        left: 0;
        width: 100%;
    }

    & > div {
        width: 100%;
    }
}

</style>