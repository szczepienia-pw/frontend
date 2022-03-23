<template>
  <div>
    <head-container />
    <body-container />
    <footer-container />
  </div>
</template>

<script setup>
import HeadContainer from "./containers/HeadContainer";
import BodyContainer from "./containers/BodyContainer";
import FooterContainer from "./containers/FooterContainer";
</script>

<style lang="scss" scoped>
@import "../node_modules/primeflex/primeflex.css";
</style>