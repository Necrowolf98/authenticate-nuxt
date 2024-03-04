<template>
  <div class="breadcrumbs">
    <div v-for="(item, index) in traceRoute" :key="index" class="w-full sm:w-auto">
      <div v-if="!item.isLink && item.current && item.label" class="flex flex-col sm:flex-row">
        <span class="text-breadcrumbs text-lg font-semibold text-center sm:hidden">{{ item.label }}</span>
        <span class="text-breadcrumbs text-lg font-semibold hidden sm:block">{{ item.label }}</span>
        <Divider class="w-full sm:hidden" />
        <Divider class="hidden sm:block" layout="vertical"/>
      </div>
    </div>

    <i class="pi pi-home pr-1 link-breadcrumbs" />
    <div v-for="(item, index) in traceRoute" :key="index">
      <div v-if="index === 0">
        <NuxtLink  class="link-breadcrumbs text-base font-medium" :to="{ name: item.pathName }">{{ item.description }}</NuxtLink>
        <i class="pi pi-chevron-right icon-breadcrubms" />
      </div>
      <div v-else>
        <NuxtLink v-if="item.isLink" :to="{ name: item.pathName }" :aria-current="item.current ? 'page' : undefined" class="link-breadcrumbs text-base font-medium">{{ item.description }}</NuxtLink>
        <span v-else-if="!item.isLink && !item.current" class="link-breadcrumbs text-base font-medium">{{ item.description }}</span>
        <span v-else class="text-base font-semibold">{{ item.description }}</span>
        <i v-if="index !== traceRoute.length - 1" class="pi pi-chevron-right icon-breadcrubms" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  traceRoute: {
    type: Array,
    default: [{
      description: 'Home',
      pathName: 'dashboard',
      current: true,
      isLink: false,
      label: null
    }]
  }
});
</script>
