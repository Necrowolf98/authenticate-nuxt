<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import {required, email, minLength, sameAs} from '@vuelidate/validators';
import {useAuthStore} from '~/stores/useAuthStore';
import guest from '~/middleware/guest';

definePageMeta({
	middleware: [guest],
});

const form = ref({
	name: '',
	lastname: '',
	direction: '',
	email: '',
	password: '',
	password_confirmation: '',
	phone: '',
});

const auth = useAuthStore();

const errors = ref<{
	[key in keyof typeof form]?: string[];
}>({});

const submitted = ref(false);

async function handleRegister(isFormValid: boolean) {
	console.log(isFormValid);
	
	submitted.value = true;
	if (!isFormValid) return;
	const {error} = await auth.register(form.value);
	if (error.value?.statusCode === 422) {
		errors.value = error.value.data?.errors;
	}
	if (!error.value) {
		navigateTo('/');
	}
}

const validations = {
	name: {required, minLength: minLength(4)},
	lastname: {required, minLength: minLength(4)},
	direction: {required, minLength: minLength(4)},
	email: {required, email},
	password: {required, minLength: minLength(6)},
	password_confirmation: {required, sameAsPassword: sameAs(computed(() => form.value.password))},
	phone: {required},
};

const v$ = useVuelidate(validations, form.value);
</script>

<template>
	<form @submit.prevent="handleRegister(!v$.$invalid)" class="p-fluid">
		<div class="grid grid-cols-2 mx-3 gap-3">
			<div class="col-span-2 sm:col-span-1">
				<span class="p-input-icon-left">
					<i class="pi pi-user" :class="[{'input-icon-error': errors.name || (v$.name.$invalid && submitted)}]" />
					<InputText placeholder="Nombres" v-model="form.name" class="p-inputtext-sm border-round" :class="[{'p-invalid input-error': errors.name || (v$.name.$invalid && submitted)}]" aria-describedby="name-error" />
				</span>

				<div class="flex justify-end">
					<small v-if="v$.name.$invalid && submitted" class="p-error" v-text="v$.name.$invalid && v$.name.required.$invalid ? 'El campo nombre es obligatorio.' : v$.name.$invalid && v$.name.minLength.$invalid ? 'El campo nombre requiere almenos 4 caracteres.' : ''" />
					<small v-else-if="errors.name && !v$.name.$invalid && submitted" class="p-error">{{ errors.name[0] }}</small>
				</div>
			</div>

			<div class="col-span-2 sm:col-span-1">
				<span class="p-input-icon-left">
					<i class="pi pi-user" :class="[{'input-icon-error': errors.lastname || (v$.lastname.$invalid && submitted)}]" />
					<InputText placeholder="Apellidos" v-model="form.lastname" class="p-inputtext-sm border-round" :class="[{'p-invalid input-error': errors.lastname || (v$.lastname.$invalid && submitted)}]" aria-describedby="lastname-error" />
				</span>

				<div class="flex justify-end">
					<small v-if="v$.lastname.$invalid && submitted" class="p-error" v-text="v$.lastname.$invalid && v$.lastname.required.$invalid ? 'El campo apellido es obligatorio.' : v$.lastname.$invalid && v$.lastname.minLength.$invalid ? 'El campo apellido requiere almenos 4 caracteres.' : ''" />
					<small v-else-if="errors.lastname && !v$.lastname.$invalid && submitted" class="p-error">{{ errors.lastname[0] }}</small>
				</div>
			</div>

			<div class="col-span-2 sm:col-span-1">
				<span class="p-input-icon-left">
					<i class="pi pi-home" :class="[{'input-icon-error': errors.direction || (v$.direction.$invalid && submitted)}]" />
					<InputText placeholder="Dirección" v-model="form.direction" class="p-inputtext-sm border-round" :class="[{'p-invalid input-error': errors.direction || (v$.direction.$invalid && submitted)}]" aria-describedby="direction-error" />
				</span>

				<div class="flex justify-end">
					<small v-if="v$.direction.$invalid && submitted" class="p-error" v-text="v$.direction.$invalid && v$.direction.required.$invalid ? 'El campo dirección es obligatorio.' : v$.direction.$invalid && v$.direction.minLength.$invalid ? 'El campo apellido requiere almenos 3 caracteres.' : ''"></small>
					<small v-else-if="errors.direction && !v$.direction.$invalid && submitted" class="p-error">{{ errors.direction[0] }}</small>
				</div>
			</div>

			<div class="col-span-2 sm:col-span-1">
				<span class="p-input-icon-left">
					<i class="pi pi-at" :class="[{'input-icon-error': errors.email || (v$.email.$invalid && submitted)}]" />
					<InputText placeholder="Correo electrónico" v-model="form.email" class="p-inputtext-sm border-round" :class="[{'p-invalid input-error': errors.email || (v$.email.$invalid && submitted)}]" aria-describedby="email-error" />
				</span>
				<div class="flex justify-end">
					<small v-if="v$.email.$invalid && submitted" class="p-error" v-text="v$.email.$invalid && v$.email.required.$invalid ? 'El campo correo es obligatorio.' : v$.email.$invalid && v$.email.email.$invalid ? 'El campo correo debe ser una dirección de correo válida.' : ''" />
					<small v-else-if="errors.email" class="p-error">{{ errors.email[0] }}</small>
				</div>
			</div>

			<div class="col-span-2 sm:col-span-1">
				<span class="p-input-icon-left p-input-icon-left-password">
					<i class="pi pi-lock" :class="[{'input-icon-error': errors.password || (v$.password.$invalid && submitted)}]" />
					<Password placeholder="Contraseña" v-model="form.password" class="p-inputtext-sm border-round" :class="[{'p-invalid input-error': errors.password || (v$.password.$invalid && submitted)}]" aria-describedby="password-error" toggleMask :feedback="false" />
				</span>

				<div class="flex justify-end">
					<small v-if="v$.password.$invalid && submitted" class="p-error" v-text="v$.password.$invalid && v$.password.required.$invalid ? 'El campo contraseña es requerido' : v$.password.$invalid && v$.password.minLength.$invalid ? 'El campo contraseña requiere almenos 6 caracteres' : ''" />
					<small v-else-if="errors.password && !v$.password.$invalid && submitted" class="p-error">{{ errors.password[0] }}</small>
				</div>
			</div>

			<div class="col-span-2 sm:col-span-1">
				<span class="p-input-icon-left p-input-icon-left-password">
					<i class="pi pi-lock" :class="[{'input-icon-error': errors.password || (v$.password_confirmation.$invalid && submitted)}]" />
					<Password placeholder="Confirmación de la contraseña" v-model="form.password_confirmation" class="p-inputtext-sm border-round" :class="[{'p-invalid input-error': errors.password_confirmation || (v$.password_confirmation.$invalid && submitted)}]" aria-describedby="password-error" toggleMask :feedback="false" />
				</span>

				<div class="flex justify-end">
					<small v-if="v$.password_confirmation.$invalid && submitted" class="p-error" v-text="v$.password_confirmation.$invalid && v$.password_confirmation.required.$invalid ? 'El campo confirmación de contraseña es requerido.' : v$.password_confirmation.$invalid && v$.password_confirmation.sameAsPassword.$invalid ? 'Las contraseñas no coinciden' : ''" />
					<small v-else-if="errors.password && !v$.password.$invalid && submitted" class="p-error">{{ errors.password[0] }}</small>
				</div>
			</div>

			<div class="col-span-2 sm:col-span-1">
				<span class="p-input-icon-left">
					<i class="pi pi-phone" :class="[{'input-icon-error': errors.phone || (v$.phone.$invalid && submitted)}]" />
					<InputMask placeholder="Celular" v-model="form.phone" mask="(999) 999-9999" class="p-inputtext-sm border-round" :class="[{'p-invalid input-error': errors.phone || (v$.phone.$invalid && submitted)}]" aria-describedby="phone-error" />
				</span>

				<div class="flex justify-end">
					<small v-if="v$.phone.$invalid && submitted" class="p-error" v-text="'El campo celular es obligatorio.'"></small>
					<small v-else-if="errors.phone && !v$.phone.$invalid && submitted" class="p-error">{{ errors.phone[0] }}</small>
				</div>
			</div>

			<div class="col-span-2 sm:col-span-1 mt-3 sm:mt-0">
				<Button class="border-round" label="Registrarse" type="submit" />
			</div>

			<div class="col-span-2 flex justify-center mt-3 md:px-0">
				<span class="text-bluegray-500 text-base">Ya tienes una cuenta?</span>
				<router-link class="text-base font-bold text-bluegray-500 hover:text-primary" to="/auth/login">&nbsp; &nbsp; Inicia sesión</router-link>
			</div>

			<div class="col-span-2">
				<Divider align="center" type="solid">
					<span class="text-bluegray-500 text-base mx-3">or</span>
				</Divider>
			</div>
			<div class="col-span-2 flex justify-center">
				<a href="#" class="text-bluegray-500 font-bold mr-3">
					<i class="pi pi-facebook text-3xl p-2 border-circle text-blue-600" />
				</a>

				<a href="#" class="text-bluegray-500 font-bold mr-3">
					<i class="pi pi-github text-3xl p-2 border-circle text-800" />
				</a>

				<a href="#" class="text-bluegray-500 font-bold">
					<i class="pi pi-google text-3xl p-2 border-circle text-red-600" />
				</a>
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
