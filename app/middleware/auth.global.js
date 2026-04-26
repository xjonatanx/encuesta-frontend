export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useCookie("auth_session");
  const adminAuth = useCookie("admin_token"); // Nueva cookie para el admin

  // --- LÓGICA PARA RUTAS DE ADMIN ---
  if (to.path.startsWith("/admin")) {
    // Si quiere ir a estadísticas pero no está logueado como admin
    if (to.path !== "/admin/login" && !adminAuth.value) {
      return navigateTo("/admin/login");
    }
    // Si ya está logueado como admin y quiere ir al login de admin, mandarlo a estadisticas
    if (to.path === "/admin/login" && adminAuth.value) {
      return navigateTo("/admin/estadisticas");
    }
    return; // Detener aquí para que no ejecute la lógica de encuestados
  }

  // --- LÓGICA PARA ENCUESTADOS (Tu código original ajustado) ---
  // Si no hay sesión de encuesta y no está en la raíz
  if (!auth.value && to.path !== "/") {
    return navigateTo("/");
  }

  // Si ya tiene sesión de encuesta y está en la raíz, mandarlo a la encuesta
  if (auth.value && to.path === "/") {
    return navigateTo("/encuesta");
  }
});
