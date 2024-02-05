<script lang="ts" setup>
import {useAuthStore} from '~/stores/useAuthStore';
const auth = useAuthStore();
</script>

<template>
    <pre>{{ auth.user }}</pre>
    <h1>fasdfasdfasdf</h1>
</template>

<style scoped></style>
