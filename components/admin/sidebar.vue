<script setup>
const props = defineProps(['menuinactive', 'resizewindow']);

import {onBeforeRouteUpdate, useRoute} from 'vue-router';
const route = useRoute();

const upHere = ref(false);

const dropdown_routes_security = computed(() => [
  '/user',
  '/usershow',
  '/userpermissions',
  '/userip',
  '/rolesindex',
  '/rolescreate',
  '/rolesedit',
  '/permissionindex',
  '/profileindex'
].includes(route.path));

const dropdown_security = ref(dropdown_routes_security.value);

// onBeforeRouteUpdate((to, from, next) => {
// 	dropdown_security.value = !dropdown_routes_security.value;
// 	next();
// });
</script>

<template>
	<section class="sidebar" @mouseover="upHere = true" @mouseleave="upHere = false">
		<div class="logo flex items-center">
			<img src="~/assets/images/prototipo-logo.png" alt="" />
			<span class="text-2xl font-bold my-5">Anthony</span>
		</div>

		<ul class="items">
			<li>
				<NuxtLink to="/login">
					<i class="pi pi-desktop icon"></i>
					Página inicio
				</NuxtLink>

				<NuxtLink to="/dashboard" :class="$route.name == 'dashboard' ? 'active' : ''">
					<i class="pi pi-chart-pie icon"></i>
					Dashboard
				</NuxtLink>
			</li>

			<li class="divider" data-text="Configuración">
				{{ resizewindow == false ? 'Configuración' : menuinactive == true && upHere == false ? '-' : 'Configuración' }}
			</li>

			<li>
				<a href="#" @click.prevent="dropdown_security = !dropdown_security" class="submenu" :class="dropdown_security == true ? 'active' : ''">
					<i class="pi pi-lock icon"></i>
					Seguridad
					<i class="pi pi-angle-right icon-right"></i>
				</a>

				<ul class="items-dropdown" :class="[{show: menuinactive == true && dropdown_security == true && upHere == true}, {show: menuinactive == false && dropdown_security == true}]">
					<!-- <li>
						<router-link to="/user">
							<i class="pi pi-users icon"></i>
							Usuarios
						</router-link>
					</li> -->

					<!-- <li v-if="auth.permission.includes('roles.index')">
                        <router-link :href="route('roles.index')" :class="route().current('roles.index') || route().current('roles.create') || route().current('roles.edit')? 'active' : ''">
                            <i class="pi pi-lock icon"></i> 
                            Roles
                        </router-link>
                    </li>

                    <li v-if="auth.permission.includes('permissions.index')">
                        <router-link :href="route('permissions.index')" :class="route().current('permissions.index') ? 'active' : ''">
                            <i class="pi pi-key icon"></i> 
                            Permisos
                        </router-link>
                    </li>

                    <li v-if="auth.permission.includes('users.index')">
                        <router-link :href="route('users.ip')" :class="route().current('users.ip') ? 'active' : ''">
                            <i class="pi pi-sign-in icon"></i> 
                            Logins
                        </router-link>
                    </li>

                    <li v-if="auth.permission.includes('profile.index')">
                        <router-link :href="route('profile.index')" :class="route().current('profile.index') ? 'active' : ''">
                            <i class="pi pi-user icon"></i> 
                            Profile
                        </router-link>
                    </li> -->
				</ul>
			</li>
		</ul>
	</section>
</template>