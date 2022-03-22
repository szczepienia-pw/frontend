<template>
  <footer>
    <BugReportDialog :visible="bugReportDialogVisible" @hide="bugReportDialogVisible = false"/>
    <Button label="Report a bug" @click="bugReportDialogVisible = true" />
  </footer>
</template>

<script setup>
import Button from "primevue/button";
import BugReportDialog from '@/components/BugReportDialog'

import { ref } from "vue";

const bugReportDialogVisible = ref(false);

</script>

<style lang="scss"></style>
