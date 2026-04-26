<template>
    <b-container
        class="py-4 bg-white border my-4 shadow-sm"
        style="max-width: 1000px; color: #000; font-family: Arial, sans-serif"
    >
        <b-alert
            v-model="mostrarAlerta"
            variant="danger"
            dismissible
            class="fixed-top m-3 shadow-lg"
            style="z-index: 2000"
        >
            <i class="bi bi-exclamation-triangle-fill mr-2"></i>
            {{ mensajeError }}
        </b-alert>

        <b-modal
            ref="modalFinal"
            id="modal-confirmar"
            title="Confirmar Envío"
            @ok="finalizarEncuesta"
            ok-title="Enviar Encuesta"
            cancel-title="Cancelar"
            ok-variant="success"
        >
            <p class="my-4">
                ¿Estás seguro de enviar la encuesta? No podrás modificarla
                después.
            </p>
        </b-modal>

        <div class="table-responsive">
            <table
                class="table table-bordered mb-0 text-center align-middle border-dark"
            >
                <tbody>
                    <tr>
                        <td
                            rowspan="4"
                            style="width: 20%; border: 2px solid black"
                        >
                            <img
                                src="/images/logo_pb.png"
                                alt="P&B LOGO"
                                style="max-height: 80px"
                            />
                        </td>
                        <td rowspan="4" style="border: 2px solid black">
                            <h5 class="font-weight-bold mb-0 text-dark">
                                PROCEDIMIENTOS RR.HH.
                            </h5>
                            <p class="small mb-0">
                                Sistema de Gestión de la Calidad<br />ISO
                                9001:2015
                            </p>
                        </td>
                        <td class="text-left small p-1 border-dark">
                            <strong>Código:</strong> —
                        </td>
                    </tr>
                    <tr>
                        <td class="text-left small p-1 border-dark">
                            <strong>Revisado Por:</strong> Jefa Área
                            Administración y RR.HH.
                        </td>
                    </tr>
                    <tr>
                        <td class="text-left small p-1 border-dark">
                            <strong>Revisión:</strong> 0
                        </td>
                    </tr>
                    <tr>
                        <td class="text-left small p-1 border-dark">
                            <strong>Emisión:</strong> 01/10/2025
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div
            class="border border-dark border-top-0 p-3 bg-light text-center mb-4"
        >
            <h4 class="font-weight-bold mb-0">ENCUESTA CLIMA LABORAL</h4>
            <p class="mb-0 font-weight-bold">
                EMPRESA P&B INGENIERIA Y CONSTRUCCION SPA
            </p>
        </div>

        <div v-if="!cargandoBorrador && form">
            <div v-if="paso === 0">
                <h5 class="font-weight-bold border-bottom pb-1">
                    Encuesta Clima Laboral
                </h5>
                <p class="font-weight-bold mb-1 mt-3">Concepto</p>
                <p class="text-justify small">
                    El clima laboral es crucial para el bienestar de los
                    trabajadores y el éxito de la empresa, cuando las empresas
                    comienzan a presentar un ambiente de trabajo no grato, una
                    mala comunicación y desmotivación entre los trabajadores
                    afecta rotundamente el nivel organizacional, lo que produce
                    una disminución en la productividad, un aumento en la
                    rotación de personal en la empresa, riesgos de posibles
                    accidentes, descontento y conflictos entre trabajadores,
                    además de afectar de manera negativa a la salud mental de
                    estos mismos.
                    <br /><br />
                    Es por ello, como Empresa surge la necesidad de implementar
                    en nuestros planes de trabajo encuestas de Clima Laboral que
                    permitan medir aspectos y realizar un buen diagnóstico
                    organizacional.
                    <br /><br />
                    Considerar, que para mantener un buen clima laboral es
                    necesario monitorearlo constantemente y organizar
                    actividades que fomenten el trabajo en equipo, la tolerancia
                    y el respeto.
                </p>

                <p class="font-weight-bold mb-1 mt-3">Objetivo General</p>
                <p class="small text-justify">
                    Generar una herramienta que permita medir el ambiente
                    laboral a nivel organizacional y conocer la percepción que
                    tienen los trabajadores sobre la relación que tienen con la
                    empresa y su entorno de trabajo.
                </p>

                <p class="font-weight-bold mb-1 mt-3">Objetivos Específicos</p>
                <ul class="small">
                    <li>
                        Aplicar una encuesta que permita evaluar y hacer un
                        diagnóstico sobre la organización y su clima laboral,
                        para contribuir al nivel de productividad y la calidad
                        de trabajo de los trabajadores.
                    </li>
                    <li>
                        Identificar las necesidades, expectativas y demandas de
                        los trabajadores.
                    </li>
                    <li>
                        Identificar los puntos de mejora que se deban trabajar
                        para mantener un buen clima laboral con un ambiente de
                        trabajo grato, mejorar la productividad y disminuir la
                        rotación de personal en la empresa.
                    </li>
                    <li>
                        Desarrollar planes de acción que permita mejorar el
                        ambiente laboral.
                    </li>
                </ul>

                <p class="font-weight-bold mb-1 mt-3">Resultados Esperados</p>
                <ul class="small">
                    <li>Mejorar la comunicación</li>
                    <li>Evaluar el compromiso</li>
                    <li>Identificar los puntos de mejora</li>
                    <li>Aumentar la productividad</li>
                    <li>Mejorar la retención de los trabajadores</li>
                </ul>

                <h5 class="font-weight-bold mt-4 border-bottom pb-1">
                    Criterios Evaluativos
                </h5>
                <b-row>
                    <b-col
                        md="6"
                        v-for="(tabla, i) in criteriosTablas"
                        :key="i"
                        class="mb-3"
                    >
                        <table
                            class="table table-sm table-bordered small text-center border-dark"
                        >
                            <thead class="bg-light">
                                <tr>
                                    <th
                                        style="
                                            width: 70%;
                                            background-color: #1a4479;
                                            color: white;
                                        "
                                    >
                                        Criterio Evaluativo
                                    </th>
                                    <th
                                        style="
                                            background-color: #1a4479;
                                            color: white;
                                        "
                                    >
                                        Puntaje
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="fila in tabla" :key="fila.c">
                                    <td>{{ fila.c }}</td>
                                    <td>{{ fila.p }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </b-col>
                </b-row>

                <b-row class="mt-4">
                    <b-col cols="12">
                        <h5 class="font-weight-bold border-bottom pb-2">
                            Guía de Interpretación de Resultados
                        </h5>
                        <p class="small text-muted">
                            Cada sección se evalúa sobre un máximo de 55 puntos:
                        </p>
                    </b-col>

                    <b-col
                        v-for="item in [
                            'Empresa',
                            'Jefaturas',
                            'Cargo',
                            'Equipo',
                            'Condiciones',
                        ]"
                        :key="item"
                        md="6"
                        lg="4"
                        class="mb-3"
                    >
                        <b-card no-body class="shadow-sm border-0 bg-light">
                            <b-card-body class="p-3">
                                <div
                                    class="d-flex justify-content-between align-items-center mb-2"
                                >
                                    <strong class="small text-uppercase">{{
                                        item
                                    }}</strong>
                                    <b-badge variant="dark"
                                        >11 Preguntas</b-badge
                                    >
                                </div>

                                <b-progress height="20px" class="border">
                                    <b-progress-bar
                                        :value="20"
                                        variant="danger"
                                        v-b-tooltip.hover
                                        title="Muy Mal (1-11)"
                                    />
                                    <b-progress-bar
                                        :value="20"
                                        style="background-color: #ffa500"
                                        v-b-tooltip.hover
                                        title="Mal (12-22)"
                                    />
                                    <b-progress-bar
                                        :value="20"
                                        variant="warning"
                                        v-b-tooltip.hover
                                        title="Neutro (23-33)"
                                    />
                                    <b-progress-bar
                                        :value="20"
                                        style="background-color: #92d050"
                                        v-b-tooltip.hover
                                        title="Bien (34-44)"
                                    />
                                    <b-progress-bar
                                        :value="20"
                                        variant="success"
                                        v-b-tooltip.hover
                                        title="Muy Bien (45-55)"
                                    />
                                </b-progress>

                                <div
                                    class="d-flex justify-content-between mt-1 text-muted"
                                    style="font-size: 0.7rem"
                                >
                                    <span>1 pt</span>
                                    <span>30 pts (Medio)</span>
                                    <span>55 pts</span>
                                </div>
                            </b-card-body>
                        </b-card>
                    </b-col>

                    <b-col cols="12" class="mt-2">
                        <b-card
                            bg-variant="dark"
                            text-variant="white"
                            class="shadow border-0"
                        >
                            <div
                                class="d-flex flex-column flex-md-row justify-content-between align-items-center"
                            >
                                <div class="mb-2 mb-md-0">
                                    <h6 class="mb-0 font-weight-bold">
                                        PUNTAJE TOTAL GENERAL
                                    </h6>
                                    <small class="text-light"
                                        >Suma de todas las secciones (Máx. 275
                                        pts)</small
                                    >
                                </div>
                                <div class="w-100 w-md-50">
                                    <b-progress
                                        height="30px"
                                        show-value
                                        class="bg-secondary border-0"
                                    >
                                        <b-progress-bar
                                            :value="20"
                                            variant="danger"
                                            >5-55</b-progress-bar
                                        >
                                        <b-progress-bar
                                            :value="20"
                                            style="background-color: #ffa500"
                                            >56-110</b-progress-bar
                                        >
                                        <b-progress-bar
                                            :value="20"
                                            variant="warning"
                                            class="text-dark"
                                            >111-165</b-progress-bar
                                        >
                                        <b-progress-bar
                                            :value="20"
                                            style="background-color: #92d050"
                                            class="text-dark"
                                            >166-220</b-progress-bar
                                        >
                                        <b-progress-bar
                                            :value="20"
                                            variant="success"
                                            >221-275</b-progress-bar
                                        >
                                    </b-progress>
                                </div>
                            </div>
                        </b-card>
                    </b-col>
                </b-row>

                <div
                    class="d-flex justify-content-end align-items-center mt-5 pb-5 border-top pt-4"
                >
                    <b-button
                        variant="warning"
                        style="margin-right: 15px"
                        size="md"
                        @click="confirmarGuardarYSalir"
                    >
                        <i class="bi bi-box-arrow-left"></i> Guardar y Salir
                    </b-button>

                    <b-button
                        variant="primary"
                        size="md"
                        class="px-4 shadow-sm font-weight-bold"
                        @click="intentarCambiarPaso(1)"
                    >
                        Siguiente: Datos de Identificación
                        <i class="bi bi-arrow-right-short ml-1"></i>
                    </b-button>
                </div>
            </div>

            <div v-else-if="paso === 1">
                <div
                    class="bg-light border-left border-primary p-4 mb-4 shadow-sm"
                >
                    <h5 class="font-weight-bold">Objetivo</h5>
                    <p class="mb-2">
                        El objetivo de esta encuesta es conocer tu percepción
                        sobre el ambiente de trabajo, las relaciones con tu
                        equipo y jefatura, y las condiciones laborales dentro de
                        la empresa.
                    </p>
                    <p class="mb-2">
                        Tu opinión es muy importante y ayudará a mejorar nuestro
                        entorno laboral.
                    </p>
                    <p class="font-weight-bold text-danger mb-0">
                        <i class="bi bi-shield-lock-fill"></i> La encuesta es
                        totalmente anónima.
                    </p>
                </div>
                <div class="p-4 border border-dark mb-4">
                    <h5 class="font-weight-bold mb-3">
                        Datos de Identificación
                    </h5>
                    <b-row>
                        <b-col md="6"
                            ><b-form-group label="Cargo:"
                                ><b-form-input
                                    v-model="form.cargo" /></b-form-group
                        ></b-col>
                        <b-col md="6"
                            ><b-form-group label="Jefe Directo:"
                                ><b-form-input
                                    v-model="form.jefeDirecto" /></b-form-group
                        ></b-col>
                        <b-col md="6"
                            ><b-form-group
                                label="Supervisor Directo (opcional):"
                                ><b-form-input
                                    v-model="form.supervisor" /></b-form-group
                        ></b-col>
                            <b-col md="6">
                              <b-form-group label="Turno:">
                                <b-form-select
                                  v-model="form.turno"
                                  :options="opcionesTurno"
                                  required
                                ></b-form-select>
                              </b-form-group>
                            </b-col>
                    </b-row>
                </div>
                <small
                    v-if="!identificacionValida"
                    class="text-danger d-block mt-2"
                >
                    * Por favor, complete todos los campos de identificación
                    para continuar.
                </small>
                <br></br>
                <div
                    class="d-flex flex-column flex-md-row justify-content-between align-items-center pb-5 border-top pt-4"
                >
                    <div class="mb-3 mb-md-0">
                        <b-button
                            variant="warning"
                            size="md"
                            @click="confirmarGuardarYSalir"
                        >
                            <i class="bi bi-box-arrow-left"></i> Guardar
                            progreso y salir
                        </b-button>
                    </div>

                    <div class="d-flex align-items-center">
                        <b-button
                            variant="secondary"
                            size="md"
                            style="margin-right: 15px"
                            class="mr-3 px-4"
                            @click="intentarCambiarPaso(0)"
                        >
                            Atrás
                        </b-button>

                        <b-button
                            variant="success"
                            size="md"
                            class="px-5 font-weight-bold shadow-sm"
                            :disabled="!identificacionValida"
                            @click="intentarCambiarPaso(2)"
                        >
                            Comenzar evaluación
                            <i class="bi bi-arrow-right-short"></i>
                        </b-button>
                    </div>
                </div>
            </div>

            <div v-else-if="paso >= 2 && paso <= 7">
                <h4 class="font-weight-bold border-bottom pb-2">
                    {{ metaSeccion.titulo }}
                </h4>
                <p class="small text-justify">{{ metaSeccion.descripcion }}</p>

                <div class="text-center my-4" v-if="metaSeccion.imagen">
                    <img
                        :src="metaSeccion.imagen"
                        class="img-fluid border p-1"
                        style="max-height: 250px"
                    />
                    <p class="font-italic small text-muted mt-2">
                        "{{ metaSeccion.frase }}"
                    </p>
                </div>

                <div class="alert alert-secondary py-2 small mb-4">
                    <strong>Escala de evaluación:</strong><br />
                    {{ metaSeccion.escalaTexto }}
                </div>

                <div
                    v-for="(p, i) in preguntasActuales"
                    :key="i"
                    class="border-bottom py-3"
                >
                    <p class="font-weight-bold small mb-2">
                        {{ i + 1 }}.- {{ p }}
                    </p>

                    <b-form-radio-group
                        v-model="form.respuestas[seccionKey][i]"
                        :options="
                            seccionKey === 'empresa' && i === 10
                                ? [
                                      { text: 'Si', value: 2 },
                                      { text: 'No', value: 1 },
                                  ]
                                : metaSeccion.opciones
                        "
                        buttons
                        button-variant="outline-primary"
                        size="sm"
                        @change="() => guardarProgresoBD()"
                        class="flex-wrap"
                    />
                </div>

                <div
                    class="d-flex flex-wrap justify-content-between align-items-center mt-5 pb-5 border-top pt-4"
                >
                    <b-button
                        size="md"
                        variant="secondary"
                        class="px-4 mb-2 mb-md-0"
                        @click="intentarCambiarPaso(paso - 1)"
                    >
                        <i class="bi bi-arrow-left"></i> Anterior
                    </b-button>

                    <b-button
                        variant="warning"
                        size="md"
                        @click="confirmarGuardarYSalir"
                    >
                        <i class="bi bi-save"></i> Guardar progreso y salir
                    </b-button>

                    <b-button
                        size="md"
                        :variant="seccionCompleta ? 'primary' : 'light'"
                        class="px-4 mb-2 mb-md-0 font-weight-bold shadow-sm"
                        :class="{ 'text-muted': !seccionCompleta }"
                        @click="intentarCambiarPaso(paso + 1)"
                        :disabled="!seccionCompleta"
                    >
                        <template v-if="seccionCompleta">
                            Siguiente <i class="bi bi-arrow-right"></i>
                        </template>
                        <template v-else>
                            <i class="bi bi-lock-fill mr-1"></i> Responde todo
                            para continuar
                        </template>
                    </b-button>
                </div>
            </div>

            <div v-else-if="paso === 8">
                <h4 class="font-weight-bold border-bottom pb-2">
                    7.- Respecto a sus emociones
                </h4>
                <p class="small">
                    Marque "Si" si la emoción ha estado presente de forma
                    habitual en su entorno laboral.
                </p>
                <table class="table table-bordered text-center small mt-4">
                    <thead class="bg-light">
                        <tr>
                            <th>N°</th>
                            <th>Emociones</th>
                            <th>SI</th>
                            <th>NO</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(emocion, index) in listaEmociones"
                            :key="index"
                        >
                            <td>{{ index + 1 }}</td>
                            <td class="text-left">{{ emocion }}</td>
                            <td colspan="2">
                                <b-form-radio-group
                                    buttons
                                    button-variant="outline-primary"
                                    v-model="form.emociones[emocion]"
                                    :options="[
                                        { text: 'SI', value: true },
                                        { text: 'NO', value: false },
                                    ]"
                                    @change="() => guardarProgresoBD()"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div
                    class="d-flex flex-wrap justify-content-between align-items-center mt-5 pb-5 border-top pt-4"
                >
                    <b-button
                        size="md"
                        variant="secondary"
                        class="px-4"
                        @click="intentarCambiarPaso(7)"
                    >
                        <i class="bi bi-chevron-left"></i> Anterior
                    </b-button>

                    <b-button
                        variant="warning"
                        size="md"
                        class="text-muted mx-auto mx-md-0"
                        @click="confirmarGuardarYSalir"
                    >
                        <i class="bi bi-save"></i> Guardar progreso y salir
                    </b-button>

                    <b-button
                        variant="primary"
                        size="md"
                        class="px-4 shadow-sm font-weight-bold"
                        @click="intentarCambiarPaso(9)"
                    >
                        Siguiente <i class="bi bi-chevron-right"></i>
                    </b-button>
                </div>
            </div>

            <div v-else-if="paso === 9">
                <h4 class="font-weight-bold border-bottom pb-2">
                    8. Recomendación Empresa
                </h4>
                <p class="small">
                    En esta sección se busca conocer el nivel de satisfacción
                    general con la empresa, evaluando la probabilidad de que
                    recomiendes trabajar aquí a otras personas. Marca el número
                    que mejor refleje tu experiencia.
                </p>

                <div class="alert alert-secondary py-2 small mb-4">
                    <strong>Escala de evaluación:</strong><br />
                    1 = No recomendaría, 7 = Lo recomendaría totalmente
                </div>

                <p class="small">
                    Considerando tu experiencia general en P&B Ingeniería y
                    Construcción, ¿en qué medida recomendarías a un amigo o
                    familiar trabajar en esta empresa?
                </p>

                <div class="text-center my-4">
                    <b-form-radio-group
                        v-model="form.recomendacion"
                        :options="[1, 2, 3, 4, 5, 6, 7]"
                        buttons
                        button-variant="outline-success"
                        @change="() => guardarProgresoBD()"
                    />
                </div>

                <b-form-group
                    label="Nombra dos cosas que más destacarías de la Empresa:"
                    class="small font-weight-bold mt-4"
                >
                    <b-form-textarea
                        v-model="form.destacados"
                        rows="3"
                        @blur="guardarProgresoBD"
                    />
                </b-form-group>

                <b-form-group
                    label="Nombra dos puntos que crees que se deban mejorar como Empresa:"
                    class="small font-weight-bold mt-4"
                >
                    <b-form-textarea
                        v-model="form.mejoras"
                        rows="3"
                        @blur="guardarProgresoBD"
                    />
                </b-form-group>

                <div
                    class="d-flex flex-wrap justify-content-between align-items-center mt-5 pb-5 border-top pt-4"
                >
                    <b-button
                        size="md"
                        variant="secondary"
                        class="px-4 mb-2 mb-md-0"
                        @click="intentarCambiarPaso(8)"
                    >
                        <i class="bi bi-arrow-left"></i> Regresar
                    </b-button>

                    <b-button
                        variant="warning"
                        size="md"
                        @click="confirmarGuardarYSalir"
                    >
                        <i class="bi bi-save"></i> Guardar progreso y salir
                    </b-button>

                    <b-button
                        variant="success"
                        size="md"
                        @click="intentarFinalizar"
                    >
                        <i class="bi bi-check2-circle mr-2"></i>
                        Finalizar y enviar
                    </b-button>
                </div>
            </div>
        </div>
    </b-container>
    <b-modal
        id="modal-salir"
        ref="modalSalirRef"
        title="Confirmar Salida"
        header-bg-variant="warning"
        header-text-variant="dark"
        centered
        ok-title="Sí, Guardar y Salir"
        cancel-title="Cancelar"
        ok-variant="warning"
        cancel-variant="outline-secondary"
        @ok="ejecutarSalidaLogica"
    >
        <div class="text-center p-3">
            <i
                class="bi bi-exclamation-triangle text-warning"
                style="font-size: 3rem"
            ></i>
            <p class="mt-3 font-weight-bold">
                ¿Deseas guardar tu progreso actual y salir?
            </p>
            <p class="small text-muted">
                Podrás retomar la encuesta más tarde ingresando nuevamente con
                tu RUT.
            </p>
        </div>
    </b-modal>

    <b-modal
        v-model="mostrarGracias"
        title="¡Encuesta Finalizada!"
        modal-class="modal-finalizar"
        :no-close-on-backdrop="true"
        :no-close-on-esc="true"
        centered
    >
        <template #header>
            <h5>¡Encuesta Finalizada!</h5>
        </template>
        <div class="text-center p-3">
            <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
            <h4 class="mt-3">¡Muchas gracias!</h4>
            <p>Tus respuestas han sido enviadas correctamente.</p>

            <b-button
                variant="primary"
                class="mt-3 px-4"
                @click="confirmarCierreFinal"
            >
                Cerrar y salir
            </b-button>
        </div>

        <template #footer>
          <div style="display: none;"></div>
        </template>
    </b-modal>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { surveyQuestions } from "../utils/surveyData";
import { getCurrentInstance } from "vue";

const opcionesTurno = [
  { value: null, text: 'Seleccione su turno', disabled: true },
  { value: 'G1 DIA', text: 'G1 DIA' },
  { value: 'G2 NOCHE', text: 'G2 NOCHE' },
  { value: 'G3 DIA', text: 'G3 DIA' },
  { value: 'G4 NOCHE', text: 'G4 NOCHE' }
];

const instance = getCurrentInstance();

const auth = useCookie("auth_session");
const paso = ref(0);
const cargandoBorrador = ref(true);
const mensajeError = ref("");
const mostrarAlerta = ref(false);
const modalFinal = ref(null);

const form = ref({
    cargo: "",
    jefeDirecto: "",
    supervisor: "",
    turno: "",
    respuestas: {
        empresa: {},
        jefatura: {},
        puesto: {},
        equipo: {},
        condiciones: {},
        persona: {},
    },
    emociones: {},
    recomendacion: null,
    mejoras: "",
    destacados: "",
});
const mostrarGracias = ref(false);

const identificacionValida = computed(() => {
    const f = form.value;
    return (
        f.cargo?.trim() &&
        f.jefeDirecto?.trim() &&
        f.supervisor?.trim() &&
        f.turno?.trim()
    );
});

const criteriosTablas = [
    [
        { c: "Totalmente en Desacuerdo", p: 1 },
        { c: "En desacuerdo", p: 2 },
        { c: "Ni de acuerdo ni en desacuerdo", p: 3 },
        { c: "De acuerdo", p: 4 },
        { c: "Totalmente de Acuerdo", p: 5 },
    ],
    [
        { c: "Nunca", p: 1 },
        { c: "Casi nunca", p: 2 },
        { c: "A veces", p: 3 },
        { c: "Bastantes Veces", p: 4 },
        { c: "Siempre", p: 5 },
    ],
    [
        { c: "Si", p: 2 },
        { c: "No", p: 1 },
    ],
    [
        { c: "Muy Mal", p: 1 },
        { c: "Mal", p: 2 },
        { c: "Neutral", p: 3 },
        { c: "Bien", p: 4 },
        { c: "Muy Bien", p: 5 },
    ],
];

const keysOrden = [
    "empresa",
    "jefatura",
    "puesto",
    "equipo",
    "condiciones",
    "persona",
];
const listaEmociones = [
    "Alegría",
    "Gratitud",
    "Motivación",
    "Entusiasmo",
    "Estrés",
    "Ansiedad",
    "Frustración",
];

const modalSalirRef = ref(null);

// Esta función solo abre el modal
const confirmarGuardarYSalir = () => {
    if (modalSalirRef.value) {
        modalSalirRef.value.show();
    } else {
        // Fallback por si la ref falla
        if (confirm("¿Guardar y salir?")) ejecutarSalidaLogica();
    }
};

// Esta función es la que realmente hace el trabajo (se llama al presionar OK)
const ejecutarSalidaLogica = async () => {
    try {
        // 1. Guardamos el estado actual
        await guardarProgresoBD("DRAFT");

        // 2. Limpiar la sesión
        const auth = useCookie("auth_session");
        auth.value = null;

        // 3. Redirigir al Login
        await navigateTo("/");
    } catch (error) {
        console.error("Error al salir:", error);
        // Aquí usa tu función de error que ya tienes configurada
        alert("No se pudo guardar el progreso. Inténtalo de nuevo.");
    }
};

const seccionCompleta = computed(() => {
    if (paso.value < 2) return true; // Paso 0 y 1 los manejamos con la validación al click
    if (paso.value >= 2 && paso.value <= 7) {
        const respondidas = Object.values(
            form.value.respuestas[seccionKey.value] || {},
        ).filter((v) => v != null).length;
        return respondidas === preguntasActuales.value.length;
    }
    if (paso.value === 8) {
        return (
            Object.keys(form.value.emociones).length === listaEmociones.length
        );
    }
    return true;
});

const seccionKey = computed(() => keysOrden[paso.value - 2]);
const preguntasActuales = computed(
    () => surveyQuestions[seccionKey.value] || [],
);

const intentarFinalizar = () => {
    // Validamos el último paso (Recomendación y comentarios)
    if (validarSeccionActual()) {
        // Opción A: Si usas BootstrapVue con refs (Recomendado)
        if (modalFinal.value) {
            modalFinal.value.show();
        }
        // Opción B: Si las refs te dan problemas, usa el confirm nativo (Súper seguro)
        else if (
            confirm(
                "¿Estás seguro de enviar la encuesta? No podrás modificarla después.",
            )
        ) {
            finalizarEncuesta();
        }
    }
};

const metaSeccion = computed(() => {
    const metas = {
        empresa: {
            titulo: "1.- Respecto a la Empresa",
            descripcion: `En esta sección se evalúa el nivel de compromiso e identificación del trabajador con la empresa, así como su percepción sobre la comunicación, los valores y la gestión organizacional. Marca la opción que mejor refleje tu nivel de acuerdo con cada afirmación.`,
            escalaTexto:
                "1 = Totalmente en desacuerdo, 2 = En desacuerdo, 3 = Ni de acuerdo ni en desacuerdo, 4 = De acuerdo, 5 = Totalmente de acuerdo",
            opciones: [1, 2, 3, 4, 5],
        },
        jefatura: {
            titulo: "2.	En Relación con los jefes: liderazgo en la Empresa",
            descripcion: `Respecto al clima laboral, el rol de los lideres de cada área tiene una alta injerencia en el grado de motivación de los trabajadores para cumplir con sus objetivos en la empresa, por lo que conocer la opinión de toda la empresa respecto a este ítem será significante.
                En esta sección se evalúa la relación con la jefatura directa, considerando la comunicación, el liderazgo y el apoyo entregado al equipo.
                Evalúa cada afirmación según la frecuencia con que tú jefatura demuestra cada comportamiento.
`,
            escalaTexto:
                "1 = Nunca, 2 = Casi nunca, 3 = A veces, 4 = Bastantes veces, 5 = Siempre",
            opciones: [1, 2, 3, 4, 5],
            imagen: "/images/jefatura.jpg",
            frase: "La confianza y el respeto entre trabajador y jefatura son clave para lograr una comunicación efectiva y un ambiente laboral positivo.",
        },
        puesto: {
            titulo: "3.- Relación con el Puesto de Trabajo",
            descripcion: `En esta sección se evalúan los aspectos relacionados a la definición y adaptación al puesto de trabajo que incluye los conocimientos, responsabilidades, participación y conformidad con los objetivos individuales y del área, la satisfacción con el puesto de trabajo y en grado de autonomía.
            Marca la opción que mejor refleje tu nivel de acuerdo con cada afirmación.`,
            escalaTexto:
                "1 = Totalmente en desacuerdo, 2 = En desacuerdo, 3 = Ni de acuerdo ni en desacuerdo, 4 = De acuerdo, 5 = Totalmente de acuerdo",
            opciones: [1, 2, 3, 4, 5],
            imagen: "/images/puesto.jpg",
            frase: `La empresa y sus trabajadores avanzan juntos hacia objetivos comunes, promoviendo la comunicación, la colaboración y la seguridad como pilares fundamentales de nuestro compromiso laboral.`,
        },
        equipo: {
            titulo: "4.	En Relación al Trabajo en Equipo: Colaboración",
            descripcion: `En esta sección se evalúa el ambiente laboral y la colaboración entre compañeros de trabajo.
            Se busca conocer el nivel de apoyo, respeto y comunicación dentro de los equipos.
            Marca la opción que mejor refleje tu nivel de acuerdo con cada afirmación.`,
            escalaTexto:
                "1 = Totalmente en desacuerdo, 2 = En desacuerdo, 3 = Ni de acuerdo ni en desacuerdo, 4 = De acuerdo, 5 = Totalmente de acuerdo",
            opciones: [1, 2, 3, 4, 5],
            imagen: "/images/equipo.jpg",
            frase: `Cada trabajador aporta conocimientos y experiencias que fortalecen al grupo y hacen posible un ambiente laboral más sano y productivo.`,
        },
        condiciones: {
            titulo: "5.- Condiciones de Trabajo",
            descripcion:
                "En esta sección se evalúan las condiciones físicas, ambientales y de seguridad presentes en el lugar de trabajo. Marca la opción que mejor refleje tu nivel de acuerdo con cada afirmación.",
            escalaTexto:
                "1 = Totalmente en desacuerdo, 2 = En desacuerdo, 3 = Ni de acuerdo ni en desacuerdo, 4 = De acuerdo, 5 = Totalmente de acuerdo",
            opciones: [1, 2, 3, 4, 5],
            imagen: "/images/condiciones.jpg",
            frase: `Mantener en buen estado las instalaciones de P&B es clave para la seguridad y bienestar de todos.
            Las revisiones periódicas previenen accidentes y reflejan compromiso con un trabajo seguro y ordenado.`,
        },
        persona: {
            titulo: "VI. Respecto a su Persona",
            descripcion: `En esta sección se busca conocer cómo te sientes trabajando en la empresa, considerando tu bienestar general y satisfacción personal.
                Marca la opción que mejor refleje tu nivel de acuerdo con cada afirmación.`,
            escalaTexto: "1=Muy Mal, 2=Mal, 3=Neutral, 4=Bien, 5=Muy Bien",
            opciones: [
                { text: "Muy Mal", value: 1 },
                { text: "Mal", value: 2 },
                { text: "Neutral", value: 3 },
                { text: "Bien", value: 4 },
                { text: "Muy Bien", value: 5 },
            ],
        },
    };
    return (
        metas[seccionKey.value] || { titulo: "", escalaTexto: "", opciones: [] }
    );
});

// Función para mostrar alertas de error y subir la pantalla
const dispararError = (msg) => {
    mensajeError.value = msg;
    mostrarAlerta.value = true;

    // Hace que la pantalla suba automáticamente para que el usuario vea el mensaje
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });

    // Oculta la alerta automáticamente después de 5 segundos
    setTimeout(() => {
        mostrarAlerta.value = false;
    }, 5000);
};

const intentarCambiarPaso = async (n) => {
    // Si el usuario intenta ir hacia ADELANTE, validamos.
    // Si va hacia ATRÁS (n < paso.value), lo dejamos pasar sin validar.
    if (n > paso.value) {
        const esValido = validarSeccionActual();
        if (!esValido) {
            // Si no es válido, detenemos la ejecución aquí
            return;
        }
    }

    // Si pasó la validación o va hacia atrás, cambiamos el paso
    paso.value = n;
    window.scrollTo(0, 0);
    await guardarProgresoBD();
};

const validarSeccionActual = () => {
    // Validación Paso 1: Datos iniciales
    if (paso.value === 1) {
        if (!form.value.cargo.trim() || !form.value.jefeDirecto.trim()) {
            dispararError(
                "Por favor, complete el Cargo y el Jefe Directo antes de continuar.",
            );
            return false;
        }
    }

    // Validación Pasos 2 al 7: Secciones de preguntas (Empresa, Jefes, Persona, etc.)
    if (paso.value >= 2 && paso.value <= 7) {
        const respuestasDeEstaSeccion =
            form.value.respuestas[seccionKey.value] || {};
        const totalPreguntas = preguntasActuales.value.length;

        // Contamos cuántas respuestas tienen un valor asignado
        const respondidas = Object.values(respuestasDeEstaSeccion).filter(
            (v) => v !== undefined && v !== null,
        ).length;

        if (respondidas < totalPreguntas) {
            dispararError(
                `Faltan preguntas por responder. Has respondido ${respondidas} de ${totalPreguntas}.`,
            );
            return false;
        }
    }

    // Validación Paso 8: Emociones
    if (paso.value === 8) {
        const totalEmociones = listaEmociones.length;
        const respondidas = Object.keys(form.value.emociones).length;

        if (respondidas < totalEmociones) {
            dispararError("Por favor, marque una opción para cada emoción.");
            return false;
        }
    }

    if (paso.value === 9) {
        if (!form.value.recomendacion) {
            dispararError(
                "Por favor, califica en qué medida recomendarías la empresa (1 al 7).",
            );
            return false;
        }

        // Validamos que los textos no estén vacíos o solo tengan espacios
        if (!form.value.destacados || form.value.destacados.trim().length < 5) {
            dispararError(
                "Por favor, menciona al menos dos cosas que destacarías de la empresa.",
            );
            return false;
        }

        if (!form.value.mejoras || form.value.mejoras.trim().length < 5) {
            dispararError(
                "Por favor, menciona al menos dos puntos que crees que se deban mejorar.",
            );
            return false;
        }
    }

    // Si llega aquí, todo está OK
    return true;
};

const guardarProgresoBD = async (statusArg = "DRAFT") => {
    if (!auth.value?.token) return;
    // Si statusArg es un objeto (el evento), lo forzamos a "DRAFT"
    const finalStatus = typeof statusArg === "object" ? "DRAFT" : statusArg;

    if (!auth.value?.id) return;

    try {
        await $fetch("https://pybingenieriachile.cl/api/encuestas/api/survey/save", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${auth.value.token}`,
            },
            body: {
                userId: auth.value.id,
                data: form.value,
                status: finalStatus, // Usamos el string limpio
                lastStep: paso.value,
            },
        });
    } catch (e) {
        console.error(e);
    }
};

const finalizarEncuesta = async () => {
    try {
        // 1. Guardamos el estado final como FINISHED
        await guardarProgresoBD("COMPLETED");

        // 2. En lugar de redirigir de inmediato, mostramos el diálogo
        mostrarGracias.value = true;
    } catch (error) {
        console.error("Error al finalizar:", error);
        alert("Hubo un error al guardar tus respuestas.");
    }
};

// Esta función se llama desde el botón "Cerrar y salir" del Modal
const confirmarCierreFinal = () => {
    // 3. Eliminamos la cookie de sesión
    auth.value = null;

    // 4. Redirigimos al inicio (el middleware hará el resto)
    // O a una página de "gracias" estática si la tienes
    navigateTo("/", { replace: true });
};
onMounted(async () => {
    if (!auth.value) return navigateTo("/");
    try {
        const s = await $fetch(
            `https://pybingenieriachile.cl/api/encuestas/api/survey/${auth.value.id}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${auth.value.token}`,
                },
            },
        );

        if (s) {
            // 1. Restaurar el paso donde quedó
            paso.value = s.lastStep || 0;

            // 2. Si s.data existe (porque lo guardaste como un objeto JSON), lo extraemos
            // Si s es directamente el objeto con cargo, respuestas, etc, usamos s
            const savedData = s.data || s;

            // 3. Asignación campo por campo para asegurar reactividad
            form.value.cargo = savedData.cargo || "";
            form.value.jefeDirecto = savedData.jefeDirecto || "";
            form.value.supervisor = savedData.supervisor || "";
            form.value.turno = savedData.turno || "";
            form.value.recomendacion = savedData.recomendacion || null;
            form.value.destacados = savedData.destacados || "";
            form.value.mejoras = savedData.mejoras || "";

            // 4. Procesar respuestas (asegurando que sean objetos)
            if (savedData.respuestas) {
                const resp =
                    typeof savedData.respuestas === "string"
                        ? JSON.parse(savedData.respuestas)
                        : savedData.respuestas;
                form.value.respuestas = { ...form.value.respuestas, ...resp };
            }

            // 5. Procesar emociones
            if (savedData.emociones) {
                const emoc =
                    typeof savedData.emociones === "string"
                        ? JSON.parse(savedData.emociones)
                        : savedData.emociones;
                form.value.emociones = { ...emoc };
            }
        }
    } catch (error) {
        console.error("Error cargando borrador:", error);
    } finally {
        cargandoBorrador.value = false;
    }
});
</script>
