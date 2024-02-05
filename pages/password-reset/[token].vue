<script lang="ts" setup>
const route = useRoute()

import useVuelidate from '@vuelidate/core';
import {required, minLength, sameAs} from '@vuelidate/validators';
import {useAuthStore} from '~/stores/useAuthStore';
import guest from '~/middleware/guest';

definePageMeta({
	layout: 'auth',
	middleware: [guest],
});

const form = ref({
    email: route.query.email as string,
	password: '',
	password_confirmation: '',
    token: route.params.token as string
});

const auth = useAuthStore();

const errors = ref<{
	[key in keyof typeof form]?: string[];
}>({});

const submitted = ref(false);
const processing = computed(() => auth.processing);
const emit = defineEmits(['messages', 'messagesErrors']);

async function handlePasswordReset(isFormValid: boolean) {	
	submitted.value = true;
	if (!isFormValid) return;
	const {data, error} = await auth.passwordReset(form.value);
	
	if(data.value?.status) {		
		emit('messages', data.value.status)
	}

	if (error.value?.statusCode === 422) {		
		if(error.value?.data?.message){		
			console.log(error.value?.data.message);
	
			emit('messagesErrors', error.value?.data.message)
			navigateTo('/login');
		}

		errors.value = error.value.data?.errors;
	}
	if (!error.value) {
		navigateTo('/login');
	}
}

const validations = {
	password: {required, minLength: minLength(6)},
	password_confirmation: {required, sameAsPassword: sameAs(computed(() => form.value.password))}
};

const v$ = useVuelidate(validations, form.value);
</script>

<template>
	<form @submit.prevent="handlePasswordReset(!v$.$invalid)" class="p-fluid">
		<div class="grid grid-cols-2 mx-3 gap-3">
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

			<div class="col-span-2 mt-3">
                <Button class="border-round" label="Actualizar contraseña" type="submit" :disabled="processing" :loading="processing" />
                <NuxtLink to="/login">
                    <span class="flex justify-center text-base text-primary py-2"><i
                        class="pi pi-arrow-circle-left pr-2" style="font-size: 1.3rem"></i>Regresar al login
                    </span>
                </NuxtLink>
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
