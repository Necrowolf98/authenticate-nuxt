<template>
	<div class="grid md:grid-cols-6 md:mx-3 pb-3">
    <label v-show="showLabel"  class="flex md:mt-2 text-sm font-bold sm:w-10rem"
      :class="[error_backend || error_invalid && submitted ? 'p-error' : 'text-500']">{{ label }}:</label>

    <div class="col-span-6 md:col-span-5">
      <span class="p-input-icon-left">
        <i class="pi pi-user" :class="[{ 'input-icon-error': error_backend || (error_invalid && submitted) }]" />
        <InputText 
          v-bind="$attrs" 
          :value="modelValue" 
          @input="$emit('update:modelValue', $event.target.value)" 
          :autocomplete="autocomplete" 
          :placeholder="placeholder" class="p-inputtext-sm border-round"
          v-bind:disabled="isDisabled || disabledIf" 
          :class="[{ 'p-invalid input-error': error_backend || (error_invalid && submitted) }]"/>
      </span>
    </div>

    <div class="col-span-6 flex justify-end">
      <small v-if="error_invalid && submitted"
        v-text="error_invalid && error_required_invalid 
        ? `El campo ${label_error} es obligatorio.` 
        : error_invalid && error_minLength_invalid 
        ? `El campo ${label_error} requiere almenos ${character_length} caracteres.` : ''" class="p-error" />

      <small v-else-if="error_backend && !error_invalid && submitted" class="p-error">{{ error_backend[0] }}</small>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  autocomplete: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  disabledIf: {
    type: Boolean,
    default: false
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  label_error: {
    type: String,
    default: ''
  },
  character_length: {
    type: Number,
    default: 0
  },
  error_backend: {
    type: Array,
    default: null
  },
  error_invalid: {
    type: Boolean,
    default: false
  },
  error_required_invalid: {
    type: Boolean,
    default: false
  },
  error_minLength_invalid: {
    type: Boolean,
    default: false
  },
  submitted: {
    type: Boolean,
    default: false
  }
})
</script>