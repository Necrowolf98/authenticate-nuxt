<script lang="ts" setup>
import {definePageMeta} from "#imports";

import guest from "../middleware/guest";

definePageMeta({
  middleware: [guest]
})
</script>

<template>
  <div>
    Page: foo
  </div>
</template>

<style scoped></style>