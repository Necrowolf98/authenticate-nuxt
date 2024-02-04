<script lang="ts" setup>
import {useAuthStore} from '~/stores/useAuthStore';
import useVuelidate from '@vuelidate/core';
import {required, email} from '@vuelidate/validators';

import guest from '~/middleware/guest';

const form = ref({
	email: '',
});

const auth = useAuthStore();
const errors = ref<{
	[key in keyof typeof form]?: string[];
}>({});

const messages = ref()
const submitted = ref(false);
const processing = computed(() => auth.processing);

async function handleForgot(isFormValid: Boolean) {
	submitted.value = true;
	if (!isFormValid) return;

	if (auth.isLoggedIn) {
		return navigateTo('/');
	}

	const {data, error} = await auth.forgot(form.value);	
	
	if(data.value?.status) {
		messages.value
	}

	if (error.value?.statusCode === 422) {
		errors.value = error.value.data?.errors;
	}

	if (!error.value) {
		console.log('1');
		
		return navigateTo('/');
	}
}

const validations = {
	email: {required, email},
};

const v$ = useVuelidate(validations, form.value);

definePageMeta({
	middleware: [guest],
});
</script>

<template>
	<form @submit.prevent="handleForgot(!v$.$invalid)" class="p-fluid ml-3">
		<!-- {{ messages }} -->

		<div class="grid grid-flow-row mx-3 gap-3">
			<div class="col-span-12">
				<span class="p-input-icon-left">
					<i class="pi pi-at" :class="[{'input-icon-error': errors.email || (v$.email.$invalid && submitted)}]" />
					<InputText placeholder="Ingrese su correo electrónico" v-model="form.email" class="border-round" :class="[{'p-invalid input-error': errors.email || (v$.email.$invalid && submitted)}]" aria-describedby="email-error" />
				</span>

				<div class="flex justify-end">
					<small v-if="v$.email.$invalid && submitted" class="p-error" v-text="v$.email.$invalid && v$.email.required.$invalid ? 'El campo correo es obligatorio.' : v$.email.$invalid && v$.email.email.$invalid ? 'El campo correo debe ser una dirección de correo válida.' : ''"></small>
					<small v-else-if="errors.email && !v$.email.$invalid && submitted" class="p-error">{{ errors.email[0] }}</small>
				</div>
			</div>
			<div class="col-span-12">
				<Button class="border-round" label="Solicitar una nueva contraseña" type="submit" :disabled="processing" :loading="processing" />
				<NuxtLink to="/auth/login">
					<span class="flex justify-center text-base text-primary py-2"><i class="pi pi-arrow-circle-left pr-2" style="font-size: 1.3rem"></i>Regresar al login </span>
				</NuxtLink>
			</div>
		</div>
	</form>
</template>

<style scoped></style>
