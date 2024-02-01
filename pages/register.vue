<script lang="ts" setup>
import useVuelidate from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators';
import {useAuthStore} from "~/stores/useAuthStore";
import guest from "~/middleware/guest";

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

const submitted = ref(false)

async function handleRegister(isFormValid) {  
  submitted.value = true;
  if (!isFormValid) return;
  const {error} = await auth.register(form.value);
  if(error.value?.statusCode === 422){
    errors.value = error.value.data?.errors;
  }
  if (!error.value) {
    navigateTo("/");
  }
}

const validations = {
    name: { required, minLength: minLength(4) },
    email: { required, email },
    password: { required, minLength: minLength(6) },
    password_confirmation: { required, sameAsPassword: sameAs(computed(() => form.value.password)) }
};

const v$ = useVuelidate(validations, form.value);
</script>

<template>
  <form @submit.prevent="handleRegister(!v$.$invalid)">
    <div class="col-12 sm:col-6">
        <span class="p-input-icon-left">
            <i class="pi pi-user" :class="[{ 'input-icon-error': errors.name || v$.name.$invalid && submitted }]" />
            <InputText placeholder="Nombres" v-model="form.name" class="p-inputtext-sm border-round"
                :class="[{ 'p-invalid input-error': errors.name || v$.name.$invalid && submitted }]" aria-describedby="name-error" />
        </span>

        <div class="flex justify-content-end">
            <small v-if="v$.name.$invalid && submitted" class="p-error"
                v-text="(v$.name.$invalid && v$.name.required.$invalid 
                ? 'El campo nombre es obligatorio.' 
                : (v$.name.$invalid && v$.name.minLength.$invalid) 
                ? 'El campo nombre requiere almenos 4 caracteres.' : '')"/>
            <small v-else-if="errors.name && !v$.name.$invalid && submitted" class="p-error">{{ errors.name[0] }}</small>
        </div>
    </div>

    <div class="col-12">
      <span class="p-input-icon-left">
          <i class="pi pi-at" :class="[{'input-icon-error': errors.email || v$.email.$invalid && submitted}]" />
          <InputText placeholder="Ingrese su correo electrónico" v-model="form.email" class="p-inputtext-sm border-round" 
            :class="[{'p-invalid input-error': errors.email || v$.email.$invalid && submitted}]" aria-describedby="email-error" />
      </span>
      <div class="flex justify-content-end">
          <small v-if="v$.email.$invalid && submitted" class="p-error"
            v-text="(v$.email.$invalid && v$.email.required.$invalid 
            ? 'El campo correo es obligatorio.' 
            : (v$.email.$invalid && v$.email.email.$invalid) 
            ? 'El campo correo debe ser una dirección de correo válida.' : '')" />
          <small v-else-if="errors.email" class="p-error">{{ errors.email[0] }}</small>
      </div>
    </div>

    <div class="col-12 sm:col-6">
      <span class="p-input-icon-left p-input-icon-left-password">
          <i class="pi pi-lock" :class="[{ 'input-icon-error': errors.password || v$.password.$invalid && submitted }]" />
          <Password placeholder="Contraseña" v-model="form.password" class="p-inputtext-sm border-round"
              :class="[{ 'p-invalid input-error': errors.password || v$.password.$invalid && submitted }]"
              aria-describedby="password-error" toggleMask :feedback="false" />
      </span>

      <div class="flex justify-content-end">
          <small v-if="(v$.password.$invalid && submitted)" class="p-error" 
            v-text="(v$.password.$invalid && v$.password.required.$invalid 
            ? 'El campo contraseña es requerido' 
            : (v$.password.$invalid && v$.password.minLength.$invalid) 
            ? 'El campo contraseña requiere almenos 6 caracteres' : '')"/>
          <small v-else-if="errors.password && !v$.password.$invalid && submitted" class="p-error">{{ errors.password[0] }}</small>
      </div>
    </div>

    <div class="col-12 sm:col-6">
      <span class="p-input-icon-left p-input-icon-left-password">
          <i class="pi pi-lock" :class="[{ 'input-icon-error': errors.password || v$.password_confirmation.$invalid && submitted }]" />
          <Password placeholder="Confirme la contraseña" v-model="form.password_confirmation" class="p-inputtext-sm border-round"
              :class="[{ 'p-invalid input-error': errors.password_confirmation || v$.password_confirmation.$invalid && submitted }]"
              aria-describedby="password-error" toggleMask :feedback="false" />
      </span>

      <div class="flex justify-content-end">
          <small v-if="(v$.password_confirmation.$invalid && submitted)" class="p-error"
              v-text="(v$.password_confirmation.$invalid && v$.password_confirmation.required.$invalid 
              ? 'El campo confirmación de contraseña es requerido.' 
              : (v$.password_confirmation.$invalid && v$.password_confirmation.sameAsPassword.$invalid) 
              ? 'Las contraseñas no coinciden' : '')"/>
          <small v-else-if="errors.password && !v$.password.$invalid && submitted" class="p-error">{{
              errors.password[0] }}</small>
      </div>
    </div>
    <Button class="border-round" label="Registrarse" type="submit" />
  </form>
</template>

<style scoped>
</style>