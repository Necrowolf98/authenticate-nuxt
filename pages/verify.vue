<script lang="ts" setup>
import {useAuthStore} from '~/stores/useAuthStore';
import auth from '~/middleware/auth';
import verify from '~/middleware/verify';

definePageMeta({
	layout: 'auth',
	middleware: [auth, verify],
});

const authenticate = useAuthStore();

const processing = computed(() => authenticate.processing);
const emit = defineEmits(['messages']);

async function handleSendVerify() {
	const {data, error} = await authenticate.sendVerify();
	
	if (data.value?.status) {
		let messages = data.value.status;
		if (data.value.status === 'verification-link-sent') {
			messages = 'Se ha enviado un correo con la verificación de la cuenta.';
		}
		emit('messages', messages);
	}

	if (!error.value) {
		return navigateTo('/login');
	}
}
</script>

<template>
	<div>
		<div class="mx-3">
			<p class="mt-0 mb-5 text-justify">Gracias por registrarte! Antes de comenzar, ¿podría verificar su dirección de correo electrónico haciendo clic en el enlace que le acabamos de enviar? Si no recibiste el correo electrónico, con gusto te enviaremos otro.</p>
		</div>

		<form @submit.prevent="handleSendVerify" class="p-fluid">
			<Button class="border-round" label="Solicitar nuevo enlace de verificación" type="submit" :disabled="processing" :loading="processing" />
		</form>
	</div>
</template>

<style scoped></style>
