<script lang="ts" setup>
import auth from '~/middleware/auth';
import verify from '~/middleware/verify';

definePageMeta({
    layout: 'admin',
    middleware: [auth, verify]
});

</script>

<template>
    <div>
        <h1>Dashboard</h1>
    </div>
</template>

<style scoped>
</style>