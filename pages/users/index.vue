<script lang="ts" setup>
import auth from '~/middleware/auth';
import verify from '~/middleware/verify';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useApiFetch } from '~/composables/useApiFetch';
import Breadcrumb from '~/components/Breadcrumb.vue';
import {LoadingStore} from '~/stores/LoadingStore';
const loading = LoadingStore();

definePageMeta({
	layout: 'admin',
	middleware: [auth, verify],
});

const filters = ref({
	global: { value: null, matchMode: FilterMatchMode.CONTAINS },
	lastname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
	direction: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
	phone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
	email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
	'roles.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
	created_at: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
});

const users = ref([]);
const usersTotal = ref();
const lazyParams = ref({
	page: 0,
	first: 0,
	filters: filters.value,
	rows: 15,
	sortField: null,
	sortOrder: null,
});

const isLoadingTable = ref(false);

const loadTable = async () => {
	isLoadingTable.value = true;
	await useApiFetch('/api/users/list', {
		query: {
			page: lazyParams.value.page,
			lazyEvent: JSON.stringify(lazyParams.value),
		},
		onResponse({ request, response, options }) {
			loading.hide();
			users.value = response._data.data;
			usersTotal.value = response._data.total;
			isLoadingTable.value = false;
		},
	});
}

const onFilter = ($event: any) => {
	lazyParams.value.page = 1;
	lazyParams.value.first = 0;
	lazyParams.value.filters = filters.value;
	loadTable();
};

const onPage = (event: any) => {
	event.page = event.page + 1;
	lazyParams.value = event;
	loadTable();
};

const onSort = (event: any) => {
	lazyParams.value = event;
	loadTable();
};

const trace = [
  { description: 'Home', pathName: 'dashboard', isLink: true, current: false },
  { description: 'Seguridad', pathName: 'users', isLink: false, current: false },
  { description: 'Listado de usuarios', pathName: 'users', label: 'USUARIOS', isLink: false, current: true }
]

onBeforeMount(async () => {
	loading.show();
	filters.value['created_at'] = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] };
	await loadTable();

});
</script>

<template>
	<div v-show="!loading.state" class="card">
		<Breadcrumb :trace-route="trace" />

		<DataTable class="p-datatable-sm" breakpoint="652px" :value="users" :totalRecords="usersTotal"
			v-model:filters="filters" :rowHover="true" lazy removableSort :loading="isLoadingTable" filterDisplay="menu"
			:alwaysShow="true" dataKey="id" :paginator="true" :rows="15" :rowsPerPageOptions="[15, 30, 50, 100]"
			@filter="onFilter($event)" @page="onPage($event)" @sort="onSort($event)" responsiveLayout="stack"
			:pageLinkSize="5" :paginatorTemplate="{
			'640px': 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
			default: 'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
		}" :globalFilterFields="['lastname', 'phone', 'direction', 'email', 'roles.name', 'created_at']"
			currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords}">
			<template #header>
				<div class="card">
					<div class="flex card-container overflow-hidden">
						<div class="flex-none flex items-center justify-content-center m-2">
							<span class="font-semibold text-xl">Listado general</span>
						</div>
						<div class="grow m-2">
							<span class="p-input-icon-left w-full">
								<i class="pi pi-search" />
								<InputText v-model="filters['global'].value" class="w-full" @keydown.enter="onFilter($event)"
									placeholder="Buscar palabra..." />
							</span>
						</div>
						<div class="flex align-items-center justify-content-center m-2">
							<Button label="Nuevo" icon="pi pi-plus" class="p-button-success hidden sm:block" />
							<Button icon="pi pi-plus" class="p-button-success sm:hidden mr-2" v-tooltip.top="'Agregar Usuario'" />
							<Button label="Import" icon="pi pi-upload" class="p-button-info hidden sm:block ml-2 mr-1" />
							<a class="ml-1"><Button label="Export" icon="pi pi-download" class="p-button-help hidden sm:block" /></a>
							<a class="ml-1"><Button icon="pi pi-download" class="p-button-help sm:hidden" v-tooltip.top="'Exportar'" /></a>
						</div>
					</div>
				</div>
			</template>

			<template #empty> No se encontraron usuarios. </template>

			<Column field="lastname" header="Usuario" :showAddButton="false" :showFilterOperator="false" sortable>
				<template #body="slotProps">
					<span v-text="slotProps.data.lastname + ' ' + slotProps.data.name.split(' ', 1)"></span>
				</template>
				<template #filter="{ filterModel, filterCallback }">
					<InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter"
						placeholder="Search by name" />
				</template>
			</Column>
			<Column field="phone" header="Celular" :showAddButton="false" :showFilterOperator="false" sortable>
				<template #body="{ data }">
					{{ data.phone }}
				</template>
				<template #filter="{ filterModel, filterCallback }">
					<InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter"
						placeholder="Search by phone" />
				</template>
			</Column>
			<Column field="direction" header="Direction" :showAddButton="false" :showFilterOperator="false" sortable>
				<template #body="{ data }">
					{{ data.direction }}
				</template>
				<template #filter="{ filterModel, filterCallback }">
					<InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter"
						placeholder="Search by direction" />
				</template>
			</Column>
			<Column field="email" header="Email" :showAddButton="false" :showFilterOperator="false" sortable>
				<template #body="{ data }">
					{{ data.email }}
				</template>
				<template #filter="{ filterModel, filterCallback }">
					<InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter"
						placeholder="Search by email" />
				</template>
			</Column>
			<Column field="roles.name" header="Roles" :showAddButton="false" :showFilterOperator="false" sortable>
				<template #body="slotProps">
					<div class="flex flex-column">
						<span v-for="(role, index) in slotProps.data.roles" :key="index">
							{{ role.name }}
						</span>
					</div>
				</template>
				<template #filter="{ filterModel, filterCallback }">
					<InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter"
						placeholder="Search by roles" />
				</template>
			</Column>
			<Column field="created_at" header="Created at" dataType="date" :showAddButton="false" :showFilterOperator="false" sortable>
				<template #body="{ data }">
					{{ data.created_at }}
				</template>
				<template #filter="{ filterModel, filterCallback }">
					<Calendar v-model="filterModel.value" :manualInput="false" :hideOnDateTimeSelect="true" hourFormat="24"
						dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" />
				</template>
			</Column>
			<Column field="id" header="Acciones">
				<template #body="slotProps">
					<div class="flex flex-wrap">
						<i class="pi pi-eye text-md mr-2 text-blue-500"></i>
						<i class="pi pi-pencil text-md mr-2 text-yellow-500 cursor-pointer"
							@click.prevent="EditUser(slotProps.data)"></i>
						<i class="pi pi-trash text-md text-red-500 cursor-pointer"
							@click.prevent="DeleteUser(slotProps.data.id)"></i>
					</div>
				</template>
			</Column>
		</DataTable>
	</div>
</template>