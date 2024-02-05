import {defineStore} from "pinia";
import {useApiFetch} from "~/composables/useApiFetch";

type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: Date;
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
  email: string
}

type ResetPasswordInfo = {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
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
    await useApiFetch("/sanctum/csrf-cookie");
    const forgot = await useApiFetch("/forgot-password", {
      method: "POST",
      body: email,
    });

    processing.value = false;
    return forgot;
  }

  async function passwordReset(info: ResetPasswordInfo) {
    processing.value = true;
    await useApiFetch("/sanctum/csrf-cookie");
    const passwordReset = await useApiFetch("/reset-password", {
      method: "POST",
      body: info,
    });

    processing.value = false;
    return passwordReset;
  }

  async function sendVerify() {
    processing.value = true;
    await useApiFetch("/sanctum/csrf-cookie");
    const sendVerify = await useApiFetch("/email/verification-notification", {
      method: "POST"
    });
    processing.value = false;
    return sendVerify;
  }

  return {user, login, isLoggedIn, fetchUser, logout, register, forgot, processing, passwordReset, sendVerify }
})