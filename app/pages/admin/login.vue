<template>
    <div class="login-wrapper">
        <div class="bg-blob"></div>
        <div class="bg-blob blob-2"></div>

        <b-container>
            <b-row class="justify-content-center">
                <b-col md="6" lg="4">
                    <div class="login-card-container">
                        <b-card class="login-card">
                            <div class="text-center mb-4">
                                <div class="icon-box">
                                    <i class="bi bi-shield-lock-fill"></i>
                                </div>
                                <h2 class="fw-bold mt-3 mb-1 text-dark">
                                    Bienvenido
                                </h2>
                                <p class="text-muted small">
                                    Panel de Gestión Administrativa
                                </p>
                            </div>

                            <b-form @submit.prevent="handleLogin">
                                <div class="mb-3 custom-input-group">
                                    <label class="form-label small fw-bold"
                                        >Usuario</label
                                    >
                                    <div class="input-with-icon">
                                        <i class="bi bi-person"></i>
                                        <b-form-input
                                            v-model="form.user"
                                            placeholder="Nombre de usuario"
                                            class="custom-input"
                                            required
                                        ></b-form-input>
                                    </div>
                                </div>

                                <div class="mb-4 custom-input-group">
                                    <label class="form-label small fw-bold"
                                        >Contraseña</label
                                    >
                                    <div class="input-with-icon">
                                        <i class="bi bi-key"></i>
                                        <b-form-input
                                            v-model="form.pass"
                                            type="password"
                                            placeholder="••••••••"
                                            class="custom-input"
                                            required
                                        ></b-form-input>
                                    </div>
                                </div>

                                <b-button
                                    type="submit"
                                    variant="primary"
                                    class="w-100 btn-login border-0"
                                    :disabled="loading"
                                >
                                    <span v-if="!loading"
                                        >Ingresar al Panel</span
                                    >
                                    <b-spinner v-else small></b-spinner>
                                </b-button>

                                <Transition name="fade">
                                    <div v-if="error" class="error-msg mt-3">
                                        <i
                                            class="bi bi-exclamation-circle me-2"
                                        ></i>
                                        {{ error }}
                                    </div>
                                </Transition>
                            </b-form>
                        </b-card>

                        <p class="text-center mt-4 text-secondary small">
                            P&B Ingeniería y Construcción &copy; 2026
                        </p>
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

// 1. Inicializamos el objeto con sus propiedades para evitar "Cannot read properties of undefined"
const form = ref({
    user: "",
    pass: "",
});

const loading = ref(false);
const error = ref("");
const router = useRouter();

// 2. Referencia a la cookie (debe coincidir con la de tu middleware)
const adminAuth = useCookie("admin_token", {
    maxAge: 60 * 60 * 8, // 8 horas de sesión
});

const handleLogin = async () => {
    loading.value = true;
    error.value = "";

    try {
        // LLAMADA REAL AL BACKEND
        // Ajusta la URL (https://pybingenieriachile.cl/api/encuestas) según donde corra tu encuesta-backend
        const response = await $fetch(
            "https://pybingenieriachile.cl/api/encuestas/api/admin/login",
            {
                method: "POST",
                body: {
                    user: form.value.user,
                    pass: form.value.pass,
                },
            },
        );

        // Si el backend responde con éxito:
        if (response.token) {
            // Guardamos el token REAL que nos envió el servidor
            adminAuth.value = response.token;

            setTimeout(() => {
                router.push("/admin/estadisticas");
            }, 500);
        }
    } catch (err) {
        // Si el backend devuelve 401 o 500, entrará aquí
        if (err.response && err.response.status === 401) {
            error.value = "Usuario o contraseña incorrectos.";
        } else {
            error.value =
                "No se pudo conectar con el servidor de autenticación.";
        }
        form.value.pass = "";
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
/* Contenedor Principal */
.login-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background-color: #f8faff;
    position: relative;
    overflow: hidden;
}

/* Decoraciones de fondo (Blobs) */
.bg-blob {
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(
        circle,
        rgba(146, 208, 80, 0.12) 0%,
        rgba(255, 255, 255, 0) 70%
    );
    top: -250px;
    right: -150px;
    z-index: 0;
}
.blob-2 {
    background: radial-gradient(
        circle,
        rgba(26, 68, 121, 0.08) 0%,
        rgba(255, 255, 255, 0) 70%
    );
    bottom: -250px;
    left: -150px;
}

/* Tarjeta */
.login-card-container {
    position: relative;
    z-index: 1;
}

.login-card {
    border: none;
    border-radius: 28px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
    padding: 1.2rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
}

/* Icono Superior */
.icon-box {
    width: 75px;
    height: 75px;
    background: #1a4479; /* Tu azul institucional */
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 22px;
    margin: 0 auto;
    font-size: 2.2rem;
    box-shadow: 0 10px 25px rgba(26, 68, 121, 0.25);
}

/* Inputs Personalizados */
.input-with-icon {
    position: relative;
}

.input-with-icon i {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: #adb5bd;
    transition: color 0.3s;
    z-index: 10;
}

.custom-input {
    padding-left: 50px !important;
    height: 58px;
    border-radius: 16px;
    border: 2px solid #edf2f7;
    background-color: #f8fafc;
    font-weight: 500;
    transition: all 0.3s ease;
}

.custom-input:focus {
    border-color: #1a4479;
    background-color: #fff;
    box-shadow: 0 0 0 4px rgba(26, 68, 121, 0.05);
}

.input-with-icon:focus-within i {
    color: #1a4479;
}

/* Botón */
.btn-login {
    height: 58px;
    border-radius: 16px;
    font-weight: 700;
    font-size: 1.05rem;
    background: #1a4479;
    transition: all 0.3s ease;
}

.btn-login:hover:not(:disabled) {
    background: #14355d;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(26, 68, 121, 0.2);
}

.btn-login:active {
    transform: translateY(0);
}

/* Mensaje Error */
.error-msg {
    background-color: #fff5f5;
    color: #c92a2a;
    padding: 14px;
    border-radius: 12px;
    font-size: 0.88rem;
    text-align: center;
    border: 1px solid #ffc9c9;
}

/* Animación de entrada de error */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
