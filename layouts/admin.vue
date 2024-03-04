<script setup>
import {LoadingStore} from '~/stores/LoadingStore';
const loading = LoadingStore();

import LoadingContent from '~/components/LoadingContent.vue';

const animate = ref(false);
const layoutMode = ref();

const clickSidebar = ref(false);
const staticMenuInactive = ref();

if (process.client) {
	layoutMode.value = localStorage.getItem('layoutMode') ? localStorage.getItem('layoutMode') : 'static';
	staticMenuInactive.value = JSON.parse(localStorage.getItem('staticMenuInactive') ? localStorage.getItem('staticMenuInactive')  : false);
}

const overlayMenuActive = ref(false);
const mobileMenuActive = ref(false);
const clickNavbarDropdown = ref(false);
const menudropdown = ref(false);
const clickNavbarConfiguration = ref(false);
const menuconfiguration = ref(false);
const nocturne = ref(false);

const onWrapperClick = () => {
	if (!clickSidebar.value) {
		overlayMenuActive.value = false;
		mobileMenuActive.value = false;
	}
	clickSidebar.value = false;

	if (!clickNavbarDropdown.value) {
		menudropdown.value = false;
	}
	clickNavbarDropdown.value = false;

	if (!clickNavbarConfiguration.value) {
		menuconfiguration.value = false;
	}
	clickNavbarConfiguration.value = false;
};

const onMenuToggle = () => {
	clickSidebar.value = true;
	switch (isDesktop()) {
		case true:
			switch (layoutMode.value) {
				case 'static':
					staticMenuInactive.value = !staticMenuInactive.value;
					localStorage.setItem('staticMenuInactive', staticMenuInactive.value);
					break;

				case 'overlay':
					staticMenuInactive.value = false;
					localStorage.setItem('staticMenuInactive', staticMenuInactive.value);
					if (mobileMenuActive.value === true) overlayMenuActive.value = true;
					overlayMenuActive.value = !overlayMenuActive.value;
					mobileMenuActive.value = false;
					break;

				default:
					break;
			}
			break;

		case false:
			mobileMenuActive.value = !mobileMenuActive.value;
			break;

		default:
			break;
	}
};

const onSidebarClick = () => {
	clickSidebar.value = true;
};

const onDropdownClick = (event) => {
	menudropdown.value = event == true ? event : !menudropdown.value;
	clickNavbarDropdown.value = true;
};

const onConfigurationClick = (event) => {
	menuconfiguration.value = event == true ? event : !menuconfiguration.value;
	clickNavbarConfiguration.value = true;
};

const onLayoutChange = (mode) => {
	layoutMode.value = mode;
	localStorage.setItem('layoutMode', mode);
};

const changeTheme = (event) => {
    const elementId = 'theme-css';
    const linkElement = document.getElementById(elementId);
    const cloneLinkElement = linkElement.cloneNode(true);
	cloneLinkElement.setAttribute('id', elementId + '-clone');

	if (event === undefined) {
		if (localStorage.getItem('nocturne') && localStorage.getItem('theme')) {
			nocturne.value = JSON.parse(localStorage.getItem('nocturne'));

			cloneLinkElement.setAttribute('href', `/themes/${localStorage.getItem('theme')}/theme.css`);
			cloneLinkElement.addEventListener('load', () => {
				linkElement.remove();
				cloneLinkElement.setAttribute('id', elementId);
    		});
			linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
		}
	} else {
		if(event.logout){
			nocturne.value = false;
		}else{
			nocturne.value = !nocturne.value;
		}
		localStorage.setItem('nocturne', nocturne.value);
		localStorage.setItem('theme', event.theme);

		cloneLinkElement.setAttribute('href', `/themes/${event.theme}/theme.css`);
		cloneLinkElement.addEventListener('load', () => {
			linkElement.remove();
			cloneLinkElement.setAttribute('id', elementId);
    	});
		linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
	}
};

const isDesktop = () => {
if (process.client) {
    return window.innerWidth >= 992;
  }
  return false; 
};

const sidebarClass = computed(() => {
	return [
		'layout-wrapper',
		{
			'layout-overlay': layoutMode.value == 'overlay',
			'layout-static': layoutMode.value == 'static',
			'layout-static-sidebar-inactive': staticMenuInactive.value && layoutMode.value == 'static',
			'layout-overlay-sidebar-active': overlayMenuActive.value && layoutMode.value == 'overlay',
			'layout-mobile-sidebar-active': mobileMenuActive.value,
			'theme--light': !nocturne.value,
			'theme--dark': nocturne.value,
		},
	];
});

const navbarClass = computed(() => {
	return {
		'show-menudropdown': menudropdown.value,
		'show-configuration': menuconfiguration.value,
	};
});

onBeforeMount(() => {
	animate.value = true;
	changeTheme();
})

</script>

<template>
    <ClientOnly>
		<div :class="sidebarClass" @click="onWrapperClick">
			<AdminSidebar @click="onSidebarClick" :resizewindow="isDesktop()" :menuinactive="staticMenuInactive" />

			<AdminNavbar :class="navbarClass" :layoutMode="layoutMode" @layout-change="onLayoutChange" @menu-toggle="onMenuToggle" @option-dropdown="onDropdownClick" @option-configuration="onConfigurationClick" @change-theme="changeTheme" :nocturne="nocturne" />

			<div class="main">
				<Toast />
				<ConfirmDialog :draggable="false" style="width: 400px" :breakpoints="{'500px': '300px'}"></ConfirmDialog>

				<main>
					<loading-content :is-loading="loading.state"/>
					<slot />
					<ScrollTop target="window" :threshold="100" class="custom-scrolltop" icon="pi pi-chevron-up" />
				</main>
			</div>

			<AdminFooter />
		</div>
	</ClientOnly>
</template>

<style scoped></style>
