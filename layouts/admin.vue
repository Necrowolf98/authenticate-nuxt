<script lang="ts" setup>
import {useAuthStore} from '~/stores/useAuthStore';

const auth = useAuthStore();

async function handleLogout() {
	await auth.logout();
}

const messages = ref('');
const messagesErrors = ref('');
</script>

<template>
	<div>
		<pre>{{ auth.user }}</pre>

		<Toast />
		<ConfirmDialog :draggable="false" style="width: 400px" :breakpoints="{'500px': '300px'}" />

		<div class="auth-container">
			<div :class="$route.name == 'auth-login' || $route.name == 'auth-verify' || $route.name == 'auth-forgot'  ? 'form-login-container' : $route.name == 'auth-register' ? 'form-register-container' : ''">
				<Card :class="$route.name == 'auth-login' ? 'card-login-container' : $route.name == 'auth-register' ? 'card-register-container' : ''">
					<template #title>
						<div class="flex justify-center align-center my-6">
							<img src="~/assets/images/prototipo-logo.png" width="37" height="37" />
							<span class="ml-2 text-3xl md:text-4xl">ANTHONY S.A</span>
						</div>
						<div v-if="messages">
							<div class="col-span-1">
								<InlineMessage severity="success" class="text-center font-semibold">{{ messages }}</InlineMessage>
							</div>
						</div>
						<div v-if="messagesErrors">
							<div class="col-span-1">
								<InlineMessage severity="error">{{ messagesErrors }}</InlineMessage>
							</div>
							<div class="col-span-1 flex justify-center">
								<router-link to="/auth-forgot">
									<Button class="border-round" label="¿Generar un nuevo enlace de cambio de contraseña?" />
								</router-link>
							</div>
						</div>
					</template>
					<template #subtitle v-if="$route.name == 'auth-login' || $route.name == 'auth-register' || $route.name == 'auth-forgot' || $route.name == 'passwordReset'">
						<div class="mx-3 mt-8">
							<span class="text-2xl md:text-4xl font-semibold" v-text="$route.name == 'auth-login' || $route.name == 'auth-register' ? 'Bienvenido a Laravel!' : $route.name == 'auth-forgot' ? '¿Olvidaste tu contraseña?' : $route.name == 'passwordReset' ? 'Restablecer la contraseña' : ''" /><br />
							<p class="my-3" v-text="$route.name == 'auth-login' ? 'Inicie sesión en su cuenta y comience la aventura.' : $route.name == 'auth-register' ? 'Registrese para comenzar la aventura.' : $route.name == 'auth-forgot' ? 'Ingrese su correo electrónico y le enviaremos instrucciones para restablecer su contraseña.' : $route.name == 'passwordReset' ? 'Estás a un paso de tu nueva contraseña, confirme su nueva contraseña.' : ''" />
						</div>
					</template>

					<template #content>
						<NuxtPage @messages="messages = $event" @messagesErrors="messagesErrors = $event" />
					</template>
				</Card>
			</div>
		</div>

		<img src="~/assets/images/log.svg" class="absolute bottom-0 left-0 pb-8 hidden md:block" width="300" />
		<img src="~/assets/images/register.svg" class="absolute bottom-0 right-0 pb-8 hidden md:block" width="300" />
	</div>
</template>

<style scoped></style>
