import { useAuthStore } from "~/stores/useAuthStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();

  const allowedRoutes = ["/login", "/register", "/verify", "forgot", "password-reset/:token"];

  if (auth.isLoggedIn && auth.user.auth_user.email_verified_at === null && to.path !== "/verify") {
    return navigateTo("/verify", { replace: true });
  } else if (auth.isLoggedIn && auth.user.auth_user.email_verified_at && to.path !== "/dashboard" && allowedRoutes.includes(to.path)) {
    return navigateTo("/dashboard", { replace: true });
  }
});
