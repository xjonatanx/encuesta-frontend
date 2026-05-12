<template>
    <b-container
        v-if="encuesta"
        class="bg-white my-3"
        style="color: #000; font-family: Arial, sans-serif"
    >
        <div class="border border-dark text-center shadow-sm bg-white">
            <div class="row g-0 align-items-stretch">
                <div
                    class="col-4 col-md-3 border-end border-dark d-flex align-items-center justify-content-center p-2"
                >
                    <img
                        src="https://pybingenieriachile.cl/encuestas/images/logo_pb.png"
                        alt="P&B LOGO"
                        class="img-fluid"
                        style="max-height: 70px; width: auto"
                    />
                </div>

                <div
                    class="col-8 col-md-6 border-end border-dark d-flex flex-column justify-content-center p-2 bg-light"
                >
                    <h6 class="fw-bold mb-0 text-dark" style="font-size: 1rem">
                        PROCEDIMIENTOS RR.HH.
                    </h6>
                    <p
                        class="small mb-0 text-muted d-none d-sm-block"
                        style="font-size: 0.75rem"
                    >
                        Sistema de Gestión de la Calidad<br />ISO 9001:2015
                    </p>
                </div>

                <div class="col-12 col-md-3 text-start small">
                    <div
                        class="p-1 px-2 border-bottom border-dark d-flex justify-content-between d-md-block"
                    >
                        <span class="fw-bold">Código:</span> <span>—</span>
                    </div>
                    <div
                        class="p-1 px-2 border-bottom border-dark d-flex justify-content-between d-md-block text-truncate"
                    >
                        <span class="fw-bold">Revisado Por:</span>
                        <span class="d-md-block" style="font-size: 0.7rem"
                            >Jefa Área Admin y RR.HH.</span
                        >
                    </div>
                    <div
                        class="p-1 px-2 border-bottom border-dark d-flex justify-content-between d-md-block"
                    >
                        <span class="fw-bold">Revisión:</span> <span>0</span>
                    </div>
                    <div
                        class="p-1 px-2 d-flex justify-content-between d-md-block"
                    >
                        <span class="fw-bold">Emisión:</span>
                        <span
                            >&nbsp;{{
                                formatearFecha(encuesta.createdAt)
                            }}</span
                        >
                    </div>
                </div>
            </div>
        </div>

        <div
            class="border border-dark border-top-0 p-3 bg-light text-center mb-4"
        >
            <h4 class="font-weight-bold mb-0 text-dark">
                ENCUESTA CLIMA LABORAL
            </h4>
            <p class="mb-0 font-weight-bold">EXPEDIENTE DE AUDITORÍA INTERNA</p>
        </div>

        <div class="p-3 border border-dark mb-4 bg-white shadow-sm">
            <b-row class="small">
                <b-col md="4"
                    ><strong>Cargo:</strong>
                    {{ encuesta.cargo || "N/A" }}</b-col
                >
                <b-col md="4"
                    ><strong>Jefe Directo:</strong>
                    {{ encuesta.jefeDirecto || "N/A" }}</b-col
                >
                <b-col md="4"
                    ><strong>Turno:</strong>
                    {{ encuesta.turno || "N/A" }}</b-col
                >
            </b-row>
        </div>

        <div
            v-for="(preguntas, seccion) in seccionesPreguntas"
            :key="seccion"
            class="mb-5"
        >
            <h5
                class="font-weight-bold border-bottom pb-1 text-primary text-uppercase"
            >
                {{ seccion }}
            </h5>

            <div
                v-for="(p, i) in preguntas"
                :key="i"
                class="border-bottom py-3"
            >
                <p class="font-weight-bold small mb-2 text-dark">
                    {{ i + 1 }}.- {{ p }}
                </p>

                <div
                    v-if="
                        encuesta.respuestas &&
                        encuesta.respuestas[seccion] &&
                        encuesta.respuestas[seccion][i] !== undefined
                    "
                >
                    <b-form-radio-group
                        :model-value="encuesta.respuestas[seccion][i]"
                        :options="
                            seccion === 'empresa' && i === 10
                                ? [
                                      { text: 'Si', value: 2 },
                                      { text: 'No', value: 1 },
                                  ]
                                : [1, 2, 3, 4, 5]
                        "
                        buttons
                        disabled
                        button-variant="outline-primary"
                        size="sm"
                    />
                </div>
                <div v-else class="text-muted small italic">
                    <i class="bi bi-info-circle"></i> Pregunta no respondida
                </div>
            </div>
        </div>

        <h5
            class="font-weight-bold border-bottom pb-1 text-primary text-uppercase"
        >
            Respecto a sus emociones
        </h5>
        <p class="small text-muted mb-3">
            Emociones marcadas como habituales en su entorno laboral:
        </p>

        <table class="table table-bordered text-center small border-dark">
            <thead class="bg-light">
                <tr>
                    <th style="width: 50px">N°</th>
                    <th>Emoción</th>
                    <th>PRESENTE</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(emocion, index) in listaEmocionesFixed"
                    :key="emocion"
                >
                    <td>{{ index + 1 }}</td>
                    <td class="text-left font-weight-bold">{{ emocion }}</td>
                    <td>
                        <template
                            v-if="
                                encuesta.emociones &&
                                encuesta.emociones[emocion] !== undefined
                            "
                        >
                            <b-badge
                                :variant="
                                    encuesta.emociones[emocion]
                                        ? 'success'
                                        : 'light'
                                "
                                class="border px-4"
                            >
                                {{ encuesta.emociones[emocion] ? "SÍ" : "NO" }}
                            </b-badge>
                        </template>
                        <span v-else class="text-muted italic">Sin datos</span>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="mt-4 p-3 bg-light border border-dark rounded">
            <p class="font-weight-bold mb-1">
                Recomendación Empresa (1-7):
                <span class="text-primary h4 ms-2">{{
                    encuesta.recomendacion || "S/N"
                }}</span>
            </p>
            <b-row class="mt-3">
                <b-col md="6">
                    <strong class="small text-uppercase"
                        >Lo que más destaca:</strong
                    >
                    <div
                        class="p-2 border bg-white rounded small mt-1"
                        style="min-height: 60px; white-space: pre-wrap"
                    >
                        {{ encuesta.destacados || "Sin comentarios" }}
                    </div>
                </b-col>
                <b-col md="6">
                    <strong class="small text-uppercase"
                        >Puntos a mejorar:</strong
                    >
                    <div
                        class="p-2 border bg-white rounded small mt-1"
                        style="min-height: 60px; white-space: pre-wrap"
                    >
                        {{ encuesta.mejoras || "Sin comentarios" }}
                    </div>
                </b-col>
            </b-row>
        </div>
    </b-container>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    encuesta: Object,
    dictionary: Object,
});

// 1. Lista fija de emociones para asegurar el orden
const listaEmocionesFixed = [
    "Alegría",
    "Gratitud",
    "Motivación",
    "Entusiasmo",
    "Estrés",
    "Ansiedad",
    "Frustración",
];

// 2. Filtramos el diccionario para que el bucle de arriba SOLO procese las secciones de preguntas
const seccionesPreguntas = computed(() => {
    if (!props.dictionary) return {};
    const copia = { ...props.dictionary };
    // Eliminamos 'emociones' o cualquier llave que no sea una sección de preguntas 1-6
    delete copia.emociones;
    return copia;
});

const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "—";
    const date = new Date(fechaISO);

    // Usamos el formato de Chile: DD/MM/AAAA
    return new Intl.DateTimeFormat("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
};
</script>
