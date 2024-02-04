<script lang="ts" setup>
import auth from "~/middleware/auth";

definePageMeta({
  middleware: [auth]
})
</script>

<template>
  <div>
    Page: foo
  </div>
</template>

<style scoped></style>