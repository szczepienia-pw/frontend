<template>
  <div>
      <head-container/>
      <body-container/>
      <footer-container/>
  </div>
</template>

<script>

import HeadContainer from "./containers/HeadContainer";
import BodyContainer from "./containers/BodyContainer";
import FooterContainer from "./containers/FooterContainer";

export default {
  name: 'app',
  components: {BodyContainer, HeadContainer, FooterContainer},
}
</script>

<style lang="scss">

</style>