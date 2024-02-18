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
        <div>
            <h1>Hola desde dashboard</h1>
            <NuxtLink to="/dashboard">User</NuxtLink>

        </div>
    </div>
</template>

<style scoped>
</style>