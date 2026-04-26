<template>
    <div
        class="login-page vh-100 d-flex align-items-center justify-content-center"
    >
        <b-container>
            <b-row justify="center">
                <b-col cols="12" sm="8" md="6" lg="4" class="mx-auto">
                    <b-card
                        no-body
                        class="shadow-lg border-0 overflow-hidden custom-card"
                    >
                        <div
                            class="card-header-accent text-center py-4 bg-white"
                        >
                            <img
                                src="/images/logo_pb.png"
                                alt="P&B Logo"
                                class="mb-3 logo-img"
                            />
                            <h4 class="font-weight-bold text-dark mb-0">
                                Portal de Encuestas
                            </h4>
                            <p class="text-muted small">
                                Bienvenido, por favor identifícate
                            </p>
                        </div>

                        <b-card-body class="px-4 py-4">
                            <b-alert
                                show
                                variant="info"
                                class="border-0 shadow-sm mb-4"
                            >
                                <div class="d-flex align-items-start">
                                    <i
                                        class="bi bi-shield-lock-fill mr-3"
                                        style="font-size: 1.5rem"
                                    ></i>
                                    <div>
                                        <h6
                                            class="alert-heading font-weight-bold mb-1"
                                        >
                                            Encuesta Confidencial
                                        </h6>
                                        <p class="mb-0 small text-dark">
                                            Esta encuesta es
                                            <strong>100% anónima</strong>.
                                            Solicitamos tu RUT exclusivamente
                                            para:
                                        </p>
                                        <ul
                                            class="pl-3 mb-0 mt-1 small text-dark"
                                        >
                                            <li>
                                                Validar que eres trabajador
                                                activo de <strong>P&B</strong>.
                                            </li>
                                            <li>
                                                Permitirte
                                                <strong
                                                    >guardar tu progreso</strong
                                                >
                                                y continuar después.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </b-alert>
                            <b-form @submit.prevent="login">
                                <b-form-group
                                    label="RUT del Trabajador"
                                    label-class="font-weight-bold small text-secondary"
                                >
                                    <b-form-input
                                        v-model="rut"
                                        placeholder="12.345.678-9"
                                        required
                                        :state="
                                            rut.length > 7
                                                ? validarRutChileno(rut)
                                                : null
                                        "
                                        class="bg-light border-0"
                                        style="
                                            height: 50px;
                                            border-radius: 8px !important;
                                        "
                                    />
                                    <small class="text-muted mt-2 d-block"
                                        >Ingrese su RUT con puntos y
                                        guion.</small
                                    >
                                </b-form-group>

                                <b-button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    class="w-100 mt-3 shadow-sm btn-ingresar"
                                    :disabled="loading"
                                >
                                    <template v-if="loading">
                                        <b-spinner
                                            small
                                            class="mr-2"
                                        ></b-spinner>
                                        Verificando...
                                    </template>
                                    <template v-else>
                                        Ingresar a la Encuesta
                                    </template>
                                </b-button>

                                <b-fade :show="!!error">
                                    <b-alert
                                        v-if="error"
                                        variant="danger"
                                        show
                                        class="mt-4 py-2 small border-0 shadow-sm"
                                    >
                                        <i
                                            class="bi bi-exclamation-circle-fill mr-2"
                                        ></i>
                                        {{ error }}
                                    </b-alert>
                                </b-fade>
                            </b-form>
                        </b-card-body>

                        <div
                            class="card-footer bg-white border-0 text-center pb-4"
                        >
                            <small class="text-muted"
                                >© 2026 P&B Ingeniería y Construcción SpA</small
                            >
                        </div>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<style scoped>
/* Fondo con un degradado profesional */
.login-page {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    background-attachment: fixed;
}

/* Tarjeta con bordes más redondeados */
.custom-card {
    border-radius: 15px !important;
}

/* Efecto de la imagen del logo */
.logo-img {
    max-height: 70px;
    width: auto;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
}

/* Estilo del botón */
.btn-ingresar {
    background-color: #004a99; /* Azul corporativo sugerido */
    border: none;
    border-radius: 8px;
    font-weight: 600;
    transition: transform 0.2s ease;
}

.btn-ingresar:hover {
    transform: translateY(-2px);
    background-color: #003366;
}

.btn-ingresar:active {
    transform: translateY(0);
}

/* Estilo de los inputs */
.form-control:focus {
    box-shadow: 0 0 0 0.2rem rgba(0, 74, 153, 0.15);
    border-color: #004a99;
}

.input-group-text {
    border-radius: 8px 0 0 8px !important;
}

.form-control {
    border-radius: 0 8px 8px 0 !important;
}
</style>

<script setup>
import { ref, watch } from "vue";

const rut = ref("");
const loading = ref(false);
const error = ref("");

watch(rut, (val) => {
    // 1. Limpiar el valor de puntos y guion, y dejar solo números y K
    let actual = val.replace(/[^0-9kK]/g, "");

    // 2. Si está vacío, no hacer nada
    if (!actual) {
        rut.value = "";
        return;
    }

    // 3. Formatear: Tomar el dígito verificador y el cuerpo
    let cuerpo = actual.slice(0, -1);
    let dv = actual.slice(-1).toUpperCase();

    // 4. Agregar puntos al cuerpo (formato miles)
    let cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // 5. Unir todo: Cuerpo + Guion + DV
    // Solo aplicamos el formato completo si hay más de 1 carácter
    if (actual.length > 1) {
        rut.value = `${cuerpoFormateado}-${dv}`;
    } else {
        rut.value = dv;
    }
});

const validarRutChileno = (rutCompleto) => {
    // 1. Limpiar el RUT de puntos y guion
    const rutLimpio = rutCompleto.replace(/[^0-9kK]/g, "");
    if (rutLimpio.length < 8) return false;

    // 2. Separar cuerpo y dígito verificador
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();

    // 3. Calcular el DV esperado
    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplo;
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    const dvEsperado = 11 - (suma % 11);
    let dvFinal;

    if (dvEsperado === 11) dvFinal = "0";
    else if (dvEsperado === 10) dvFinal = "K";
    else dvFinal = dvEsperado.toString();

    // 4. Comparar con el DV ingresado
    return dv === dvFinal;
};

const login = async () => {
    error.value = "";

    // 1. Validación de RUT (Frontend)
    if (!validarRutChileno(rut.value)) {
        error.value =
            "El RUT ingresado no es válido. Revisa los puntos y el dígito verificador.";
        return;
    }

    loading.value = true;
    const rutParaServidor = rut.value.replace(/[^0-9kK]/g, "");

    try {
        // 2. Llamada al Backend (Recibirá { id, rut, token })
        const data = await $fetch("http://localhost:3001/api/auth/login", {
            method: "POST",
            body: { rut: rutParaServidor },
        });

        // 3. Configuración de la Cookie
        // Usamos opciones para que la sesión sea persistente y segura
        const auth = useCookie("auth_session", {
            maxAge: 60 * 60 * 8, // 8 horas (tiempo de un turno laboral)
            path: "/", // Disponible en toda la app
            sameSite: "lax", // Protección básica CSRF
        });

        auth.value = data;

        // 4. Redirección
        await navigateTo("/encuesta");
    } catch (e) {
        // Captura el mensaje "Usted ya ha completado esta encuesta" o "Error de servidor"
        error.value =
            e.data?.message || "Error de acceso: Servicio no disponible";
    } finally {
        loading.value = false;
    }
};
</script>
