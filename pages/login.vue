<script lang="ts" setup>
import {useAuthStore} from '~/stores/useAuthStore';
import useVuelidate from '@vuelidate/core';
import {required, email, minLength} from '@vuelidate/validators';
import guest from '~/middleware/guest';

definePageMeta({
	layout: 'auth',
	middleware: [guest],
});

const form = ref({
	email: 'anthonychica.98@gmail.com',
	password: 'password',
});

const auth = useAuthStore();

const remember = ref(false);
const processing = computed(() => auth.processing);

const errors = ref<{
	[key in keyof typeof form]?: string[];
}>({});

const submitted = ref(false);

async function handleLogin(isFormValid: Boolean) {
	submitted.value = true;
	if (!isFormValid) return;

	if (auth.isLoggedIn) {
		return navigateTo('/');
	}

	const {error} = await auth.login(form.value);
	
	if (error.value?.statusCode === 422) {
		errors.value = error.value.data?.errors;
	}

	if (!error.value) {
		return navigateTo('/dashboard');
	}
}

const validations = {
	email: {required, email},
	password: {required, minLength: minLength(6)},
};

const v$ = useVuelidate(validations, form.value);
</script>

<template>
	<form @submit.prevent="handleLogin(!v$.$invalid)" class="p-fluid">
		<div class="grid grid-flow-row mx-3 gap-3">
			<div class="col-span-12 justify-center">
				<span class="p-input-icon-left">
					<i class="pi pi-at" :class="[{'input-icon-error': errors.email || (v$.email.$invalid && submitted)}]" />
					<InputText placeholder="Ingrese su correo electrónico" v-model="form.email" class="border-round" :class="[{'p-invalid input-error': errors.email || (v$.email.$invalid && submitted)}]" aria-describedby="email-error" />
				</span>
				<div class="flex justify-end">
					<small v-if="v$.email.$invalid && submitted" class="p-error" v-text="v$.email.$invalid && v$.email.required.$invalid ? 'El campo correo es obligatorio.' : v$.email.$invalid && v$.email.email.$invalid ? 'El campo correo debe ser una dirección de correo válida.' : ''" />

					<small v-else-if="errors.email && !v$.email.$invalid && submitted" class="p-error">{{ errors.email[0] }}</small>
				</div>
			</div>

			<div class="col-span-12 justify-center">
				<span class="p-input-icon-left p-input-icon-left-password">
					<i class="pi pi-lock" :class="[{'input-icon-error': errors.password || (v$.password.$invalid && submitted)}]" />
					<Password placeholder="Ingrese su contraseña" v-model="form.password" class="border-round" :class="[{'p-invalid input-error': errors.password || (v$.password.$invalid && submitted)}]" aria-describedby="password-error" toggleMask :feedback="false" />
				</span>
				<div class="flex justify-end">
					<small v-if="v$.password.$invalid && submitted" class="p-error" v-text="'El campo contraseña es obligatorio.'" />
					<small v-else-if="errors.password && !v$.password.$invalid && submitted" class="p-error">{{ errors.password[0] }}</small>
				</div>
			</div>

			<div class="col-span-12 flex justify-between items-center my-1">
				<div class="field-checkbox flex">
					<Checkbox v-model="remember" inputId="remember" name="remember" value="remember" />
					<label for="remember" class="ml-2 flex items-center text-sm text-bluegray-500 cursor-pointer"> Recordarme </label>
				</div>
				<NuxtLink class="text-base font-bold text-bluegray-500 hover:text-primary" to="/forgot">&nbsp; &nbsp; Olvidé mi clave!</NuxtLink>
			</div>

			<div class="col-span-12">
				<Button class="border-round" label="Iniciar sesión" type="submit" :disabled="processing" :loading="processing" />
			</div>

			<div class="col-span-12 flex flex-col md:flex-row items-center justify-center mt-3 md:px-0">
				<span class="text-bluegray-500 text-base">Nuevo en la plataforma?</span>
				<NuxtLink class="text-base font-bold text-bluegray-500 hover:text-primary" to="/register">&nbsp; &nbsp; Crea una cuenta</NuxtLink>
			</div>

			<div class="col-span-12">
				<Divider align="center" type="solid">
					<span class="text-bluegray-500 text-base mx-3">or</span>
				</Divider>
			</div>

			<div class="col-span-12 flex justify-center">
				<a href="#" class="mr-3"><i class="pi pi-facebook text-3xl p-2 border-circle text-blue-600" /></a>
				<a href="#" class="mr-3"><i class="pi pi-github text-3xl p-2 border-circle text-800" /></a>
				<a href="#"><i class="pi pi-google text-3xl p-2 border-circle text-red-600" /></a>
			</div>
		</div>
	</form>
</template>

<style scoped>
.text-3xl {
	font-size: 1.875rem !important;
	line-height: 2.25rem !important;
}

.p-divider.p-divider-horizontal {
	margin: 0.875rem 0;
	padding: 0 0.875rem;
}
</style>
