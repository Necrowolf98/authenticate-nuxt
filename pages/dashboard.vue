<script lang="ts" setup>
import '~/assets/css/app.css'
import auth from '~/middleware/auth';
import verify from '~/middleware/verify';

definePageMeta({
    layout: 'admin',
    middleware: [auth, verify]
});

</script>

<template>
    <div>
        <h1>Hola desde dashboard</h1>
    </div>
</template>

<style scoped>
</style>