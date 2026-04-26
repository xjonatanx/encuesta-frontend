// nuxt.config.ts
export default defineNuxtConfig({
  // CONFIGURACIÓN DE RUTAS PARA SUBRUTAS
  app: {
    baseURL: "/encuestas/",
    buildAssetsDir: "assets", // Evita conflictos con la carpeta _nuxt por defecto
  },

  devServer: {
    port: 3003,
    host: "0.0.0.0",
  },

  // Habilitamos la estructura de Nuxt 4
  future: {
    compatibilityVersion: 4,
  },

  modules: ["@bootstrap-vue-next/nuxt"],

  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "bootstrap-icons/font/bootstrap-icons.css",
  ],

  build: {
    transpile: ["bootstrap-vue-next"],
  },

  runtimeConfig: {
    adminUser: process.env.ADMIN_USER,
    adminPass: process.env.ADMIN_PASS,
    jwtSecret: process.env.JWT_SECRET,
  },
});
