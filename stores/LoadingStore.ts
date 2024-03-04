import {defineStore} from "pinia";

type state = Boolean;

export const LoadingStore = defineStore('loading', () => {
  const state = ref<state | false>(false)

  function show() {
    state.value = true;
    return show;
  }

  function hide() {
    state.value = false;
    return hide;
  }

  return { state, hide, show }
})