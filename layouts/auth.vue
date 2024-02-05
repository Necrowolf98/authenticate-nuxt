<script lang="ts" setup>
import {useAuthStore} from '~/stores/useAuthStore';
import { useToast } from "primevue/usetoast";
const toast = useToast();

const auth = useAuthStore();

async function handleLogout() {
	await auth.logout();
}

const messages = ($event: String) => {	
    toast.add({ severity: 'success', summary: 'Correcto!', detail: $event, life: 5000 });
}

const messagesErrors = ($event: String) => {	
    toast.add({ severity: 'error', summary: 'Oops!', detail: $event, life: 5000 });
}
</script>

<template>
	<div>
		<Toast />
		<ConfirmDialog :draggable="false" style="width: 400px" :breakpoints="{'500px': '300px'}" />

		<div class="auth-container">
			<div :class="$route.name == 'login' || $route.name == 'verify' || $route.name == 'forgot'  ? 'form-login-container' : $route.name == 'register' ? 'form-register-container' : ''">
				<Card :class="$route.name == 'login' ? 'card-login-container' : $route.name == 'register' ? 'card-register-container' : ''">
					<template #title>
						<div class="flex justify-center align-center my-6">
							<img src="~/assets/images/prototipo-logo.png" width="37" height="37" />
							<span class="ml-2 text-3xl md:text-4xl">ANTHONY S.A</span>
						</div>
					</template>
					<template #subtitle v-if="$route.name == 'login' || $route.name == 'register' || $route.name == 'forgot' || $route.name == 'password-reset-token'">
						<div class="mx-3 mt-8">
							<span class="text-2xl md:text-4xl font-semibold" v-text="$route.name == 'login' || $route.name == 'register' ? 'Bienvenido a Laravel!' : $route.name == 'forgot' ? '¿Olvidaste tu contraseña?' : $route.name == 'password-reset-token' ? 'Restablecer la contraseña' : ''" /><br />
							<p class="my-3" v-text="$route.name == 'login' ? 'Inicie sesión en su cuenta y comience la aventura.' : $route.name == 'register' ? 'Registrese para comenzar la aventura.' : $route.name == 'forgot' ? 'Ingrese su correo electrónico y le enviaremos instrucciones para restablecer su contraseña.' : $route.name == 'password-reset-token' ? 'Estás a un paso de tu nueva contraseña, confirme su nueva contraseña.' : ''" />
						</div>
					</template>

					<template #content>
						<NuxtPage @messages="messages" @messagesErrors="messagesErrors" />
					</template>
				</Card>
			</div>
		</div>

		<img src="~/assets/images/log.svg" class="absolute bottom-0 left-0 pb-8 hidden md:block" width="300" />
		<img src="~/assets/images/register.svg" class="absolute bottom-0 right-0 pb-8 hidden md:block" width="300" />
	</div>
</template>

<style scoped></style>
