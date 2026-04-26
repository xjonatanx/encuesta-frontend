// nuxt.config.ts
export default defineNuxtConfig({
  // Habilitamos la estructura de Nuxt 4
  future: {
    compatibilityVersion: 4,
  },

  // Agregamos el módulo de BootstrapVueNext
  modules: ["@bootstrap-vue-next/nuxt"],

  // Cargamos los estilos de Bootstrap
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "bootstrap/dist/css/bootstrap.min.css", // Tu bootstrap actual
    "bootstrap-icons/font/bootstrap-icons.css", // Nueva línea
  ],

  // Esto ayuda a resolver problemas de compilación con componentes específicos
  build: {
    transpile: ["bootstrap-vue-next"],
  },
  runtimeConfig: {
    // Estas variables solo están disponibles en el servidor
    adminUser: process.env.ADMIN_USER,
    adminPass: process.env.ADMIN_PASS,
    jwtSecret: process.env.JWT_SECRET,
  },
});
