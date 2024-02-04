import {defineStore} from "pinia";
import {useApiFetch} from "~/composables/useApiFetch";

type User = {
  id: number;
  name: string;
  email: string;
}

type Credentials = {
  email: string;
  password: string;
}

type RegistrationInfo = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

type ForgotInfo = {
  email: String
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)
  const processing = ref(false);

  async function logout() {
    await useApiFetch("/logout", {method: "POST"});
    user.value = null;
    navigateTo("/login");
  }

  async function fetchUser() {
    const {data, error} = await useApiFetch("/api/users");
    user.value = data.value as User;
  }

  async function login(credentials: Credentials) {
    processing.value = true;    
    await useApiFetch("/sanctum/csrf-cookie");

    const login = await useApiFetch("/login", {
      method: "POST",
      body: credentials,
    });

    await fetchUser();
    processing.value = false;    
    return login;
  }

  async function register(info: RegistrationInfo) {
    processing.value = true;
    await useApiFetch("/sanctum/csrf-cookie");

    const register = await useApiFetch("/register", {
      method: "POST",
      body: info,
    });

    await fetchUser();
    processing.value = false;
    return register;
  }

  async function forgot(email: ForgotInfo) {
    processing.value = true;
    const forgot = await useApiFetch("/forgot-password", {
      method: "POST",
      body: email,
    })
    processing.value = false;
    return forgot;
  }

  return {user, login, isLoggedIn, fetchUser, logout, register, forgot, processing }
})