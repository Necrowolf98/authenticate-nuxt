<script lang="ts" setup>
import {useAuthStore} from "~/stores/useAuthStore";

import guest from "../middleware/guest";

definePageMeta({
  middleware: [guest],
});

const form = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: ""
});

const auth = useAuthStore();

const errors = ref<{
  [key in keyof typeof form]?: string[]
}>({});

async function handleRegister() {
  const {error} = await auth.register(form.value);
  if(error.value?.statusCode === 422){
    errors.value = error.value.data?.errors;
  }
  if (!error.value) {
    navigateTo("/");
  }
}
</script>

<template>
  <form @submit.prevent="handleRegister">

      <InputText type="text" class="p-inputtext-sm border-round" v-model="form.name" />
    <label>
      Email
      <input v-model="form.email" type="email">
    </label>
    <label>
      Password
      <input v-model="form.password" type="password">
    </label>
    <label>
      Password confirmation
      <input v-model="form.password_confirmation" type="password">
    </label>

    <button>Register</button>

    <p class="error" v-for="error in errors">{{ error }}</p>

</form>
</template>

<style scoped>
html{
  font-size: 14.5px !important;
}
</style>