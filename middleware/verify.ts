import {useAuthStore} from "~/stores/useAuthStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();

  if (auth.isLoggedIn && auth.user.auth_user.email_verified_at === null && to.path !== "/verify") {
    return navigateTo("/verify", { replace: true });
  } else if (auth.isLoggedIn && auth.user.auth_user.email_verified_at && to.path !== "/dashboard") {
    return navigateTo("/dashboard", { replace: true });
  }
})