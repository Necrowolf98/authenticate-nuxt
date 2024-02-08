<script setup>
import {useAuthStore} from "~/stores/useAuthStore";
const auth = useAuthStore();

const props = defineProps(['nocturne', 'layoutMode', 'class']);
const instance = getCurrentInstance();

const date = ref('');
const time = ref('');
const scale = ref(14);
const scales = [12, 13, 14, 15, 16];
const d_layoutMode = ref();
d_layoutMode.value = props.layoutMode
onMounted(() => {
	actualizarTiempo();
	setInterval(actualizarTiempo, 1000);
});

const onMenuToggle = (event) => {
	instance.emit('menu-toggle', event);
};

const changeTheme = (event, theme, dark) => {
	instance.emit('change-theme', {theme, dark});
};

const onDropdownClick = (event) => {
	instance.emit('option-dropdown', event);
};

const onConfigurationClick = (event) => {
	instance.emit('option-configuration', event);
};

const changeLayout = (event, layoutMode) => {
	instance.emit('layout-change', layoutMode);
	event.preventDefault();
};

const logout = () => {
	instance.emit('change-theme');
	// auth.logout();
};

const actualizarTiempo = () => {
	const week = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
	const months = ['Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre'];

	const cd = new Date();

	time.value = ForWeekAndMonth(cd.getHours(), 2) + ' : ' + ForWeekAndMonth(cd.getMinutes(), 2) + ' : ' + ForWeekAndMonth(cd.getSeconds(), 2);
	date.value = week[cd.getDay()] + ', ' + ForWeekAndMonth(cd.getDate(), 2) + ' de ' + months[cd.getMonth() + 1] + ' del ' + ForWeekAndMonth(cd.getFullYear(), 4) + ' , ';
};

const ForWeekAndMonth = (num, digit) => {
	const zero = '0'.repeat(digit);
	return (zero + num).slice(-digit);
};

const decrementScale = () => {
	scale.value--;
	applyScale();
};

const incrementScale = () => {
	scale.value++;
	applyScale();
};

const applyScale = () => {
	document.documentElement.style.fontSize = scale.value + 'px';
};
</script>

<template>
	<section class="navbar">
		<nav>
			<i @click="onMenuToggle" class="pi pi-bars menu-btn"></i>
			<span class="text-base font-semibold navbar-clock hidden sm:block" v-text="date + time"></span>
			<div class="profile">
				<!-- <Avatar v-if="auth.social" :image="auth.social.social_avatar" shape="circle" class="avatar" @click="onDropdownClick" /> -->
				<!-- <Avatar v-else :label="auth.name.charAt(0) + auth.lastname.charAt(0)" shape="circle" class="avatar" @click="onDropdownClick" /> -->
				<Avatar :label="auth.user.auth_user.name.charAt(0)" shape="circle" class="avatar" @click="onDropdownClick" />
				<ul class="profile-link" :class="class" @click="onDropdownClick(true)">
					<div class="card flex flex-col justify-center items-center">
						<!-- <Avatar v-if="auth.social" :image="auth.social.social_avatar" shape="circle" class="avatar" /> -->
						<!-- <Avatar v-else :label="auth.name.charAt(0) + auth.lastname.charAt(0)" shape="circle" class="avatar" /> -->
						<Avatar :label="auth.user.auth_user.name.charAt(0)" shape="circle" class="avatar" />
						<p class="my-1 p_logout">
							<strong>{{ auth.user.auth_user.name.split(' ', 1) }}</strong>
						</p>
						<p class="text-center my-1 p_logout">
							<strong>Roles: </strong>
							<span v-for="(item, index) in auth.user.auth_user.roles" :key="index">{{ item+', ' }}</span>
						</p>
						<p class="text-center mx-3 my-1 p_logout">{{ auth.user.auth_user.email }}</p>
						<a class="mt-2">
							<Button label="Cerrar sesión" icon="pi pi-sign-out" class="p-button-sm p-button-outlined p-button-secondary boton_cerrar_sesion" @click="logout" />
						</a>
					</div>
				</ul>
				<i v-show="nocturne" class="pi pi-sun" @click="changeTheme($event, 'saga-blue', false)"></i>
				<i v-show="!nocturne" class="pi pi-moon" @click="changeTheme($event, 'vela-blue', true)"></i>
				<i class="pi pi-bell"></i>
				<i class="pi pi-cog" @click="onConfigurationClick"></i>

				<ul class="configuration" :class="class" @click="onConfigurationClick(true)">
					<div class="col-12 pt-2 pb-0">
						<span class="text-base font-bold flex justify-center">Tipo de Menú</span>
						<div class="flex flex-wrap items-center justify-start pt-2 px-4">
							<div class="p-formgroup-inline">
								<div class="field-radiobutton">
									<RadioButton id="static" name="layoutMode" value="static" v-model="d_layoutMode" @change="changeLayout($event, 'static')" />
									<label class="text-base font-semibold ml-2">Static</label>
								</div>
								<div class="field-radiobutton pt-2">
									<RadioButton id="overlay" name="layoutMode" value="overlay" v-model="d_layoutMode" @change="changeLayout($event, 'overlay')" />
									<label class="text-base font-semibold ml-2">Overlay</label>
								</div>
							</div>
						</div>
					</div>
					<div class="col-12">
						<div class="flex flex-col items-center">
							<span class="text-base font-bold py-2">Tamaño de Componentes</span>
							<div class="config-scale">
								<Button icon="pi pi-minus" @click="decrementScale()" class="p-button-text" :disabled="scale === scales[0]" />
								<i class="pi pi-circle-on scale-component-i" v-for="s of scales" :key="s" :class="{'scale-active': s === scale}" />
								<Button icon="pi pi-plus" @click="incrementScale()" class="p-button-text" :disabled="scale === scales[scales.length - 1]" />
							</div>
						</div>
					</div>
				</ul>
			</div>
		</nav>
	</section>
</template>
