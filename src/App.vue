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
  import Cookies from './services/cookies'

  Cookies.setCookie('userType', 'doctor')

</script>

<style lang="scss">

</style>