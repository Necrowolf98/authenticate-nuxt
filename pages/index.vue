<script lang="ts" setup>
import '~/assets/css/app.css'
import auth from '~/middleware/auth';
import verify from '~/middleware/verify';

definePageMeta({
    middleware: [auth, verify]
});

</script>

<template>
    <div>
        <h1>Index</h1>
        <h1>hola</h1>
    </div>
</template>

<style scoped>
</style>