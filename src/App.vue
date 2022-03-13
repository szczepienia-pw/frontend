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
  import { useCookies } from '@vueuse/integrations/useCookies';
  import * as Api from './services/api'

  // example api/cookie usage

  const cookies = useCookies(['logged-in', 'user-type', 'auth-token']);

  cookies.set('logged-in', 'true', { maxAge: 86400, sameSite: true});
  cookies.set('user-type', 'doctor', { maxAge: 86400, sameSite: true});
  cookies.set('auth-token', 'abc-def-123-456', { maxAge: 86400, sameSite: true});

  Api.login('test@test.com', 'test').then(response => console.log(response));

</script>

<style lang="scss">

</style>