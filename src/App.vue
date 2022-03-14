<template>
  <div>
      <head-container/>
      <body-container/>
      <footer-container/>
  </div>
</template>

<script setup>
  import HeadContainer from "./containers/HeadContainer";
  import BodyContainer from "./containers/BodyContainer";
  import FooterContainer from "./containers/FooterContainer";
  import * as Api from './services/api'

  Api.loginDoctor('test@test.com', 'test');

</script>

<style lang="scss" scoped>
  @import '../node_modules/primeflex/primeflex.css'
</style>