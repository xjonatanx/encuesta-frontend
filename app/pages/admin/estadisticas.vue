<template>
    <div class="dashboard-wrapper bg-light min-vh-100 pb-5">
        <nav
            class="navbar px-4 py-3 bg-white shadow-sm sticky-top border-bottom"
        >
            <div class="d-flex align-items-center">
                <div
                    class="bg-navy text-white p-2 rounded me-3 fw-bold shadow-sm"
                >
                    P&B
                </div>
                <div>
                    <h5 class="mb-0 fw-bold text-navy">
                        Control de Clima Organizacional
                    </h5>
                    <small class="text-muted"
                        >Panel Administrativo de Métricas Psicosociales</small
                    >
                </div>
            </div>
            <div class="ms-auto text-muted small me-3">
                <i class="bi bi-clock"></i> Última actualización:
                {{ fechaActual }}
            </div>
            <b-button
                variant="link"
                class="text-navy text-decoration-none fw-bold me-3 p-0"
                @click="cargarDashboard"
            >
                <i class="bi bi-arrow-repeat"></i> Sincronizar
            </b-button>
            <b-button
                variant="outline-danger"
                size="sm"
                class="fw-bold px-3"
                @click="logout"
            >
                <i class="bi bi-box-arrow-right me-1"></i> Salir
            </b-button>
        </nav>

        <b-container fluid class="p-4">
            <b-row class="mb-4" v-if="loaded">
                <b-col
                    md="2"
                    v-for="kpi in [
                        {
                            l: 'M1: NPS Global',
                            v: stats.nps,
                            c: 'primary',
                            i: 'star-fill',
                            u: '/10',
                            t: 'Net Promoter Score: Mide el nivel de lealtad y qué tan probable es que los colaboradores recomienden trabajar en la organización.',
                        },
                        {
                            l: 'M6: Tasa Estrés',
                            v: stats.tasaEstres,
                            c: 'danger',
                            i: 'lightning-charge-fill',
                            u: '%',
                            t: 'Índice de saturación: Porcentaje de la población que manifiesta sentimientos de frustración, agotamiento o estrés agudo.',
                        },
                        {
                            l: 'M10: Fidelidad',
                            v: stats.fidelizacion,
                            c: 'success',
                            i: 'heart-fill',
                            u: '%',
                            t: 'Sentido de pertenencia: Mide el compromiso emocional y el deseo de los empleados de permanecer a largo plazo en la empresa.',
                        },
                        {
                            l: 'M11: Seguridad',
                            v: stats.seguridad,
                            c: 'warning',
                            i: 'shield-shaded',
                            u: '/5',
                            t: 'Cuidado preventivo: Calificación otorgada por el personal a las condiciones físicas, implementos de seguridad y protocolos de riesgo.',
                        },
                        {
                            l: 'M8: Alertas',
                            v: stats.alertasCount,
                            c: 'dark',
                            i: 'bell-fill',
                            u: 'pax',
                            t: 'Casos Críticos: Número de personas que han reportado un estado de ánimo muy bajo. Requieren contacto directo por parte de Bienestar/RRHH.',
                        },
                        {
                            l: 'Encuestas',
                            v: stats.totalEncuestas,
                            c: 'info',
                            i: 'people-fill',
                            u: '',
                            t: 'Volumen de muestreo: Total de participaciones registradas. Una mayor muestra garantiza una mayor representatividad estadística del clima.',
                        },
                    ]"
                    :key="kpi.l"
                >
                    <div
                        class="bg-white p-3 rounded shadow-sm border-top border-4 h-100 position-relative"
                        :class="'border-' + kpi.c"
                        v-b-tooltip.hover
                        :title="kpi.t"
                    >
                        <small
                            class="text-muted fw-bold d-block text-uppercase mb-1"
                            style="font-size: 0.65rem"
                        >
                            {{ kpi.l }} <i class="bi bi-info-circle ms-1"></i>
                        </small>
                        <div
                            class="d-flex align-items-center justify-content-between"
                        >
                            <h4 class="mb-0 fw-bold text-navy">
                                {{ kpi.v
                                }}<small class="fs-6 fw-normal text-muted">{{
                                    kpi.u
                                }}</small>
                            </h4>
                            <i
                                :class="'bi bi-' + kpi.i + ' text-' + kpi.c"
                                style="font-size: 1.2rem"
                            ></i>
                        </div>
                    </div>
                </b-col>
            </b-row>

            <div v-else class="text-center py-5">
                <b-spinner variant="primary"></b-spinner>
                <p class="text-muted mt-2">Cargando métricas de clima...</p>
            </div>

            <b-row class="mb-4" v-if="loaded">
                <b-col lg="8">
                    <b-card border-0 shadow-sm rounded-xl>
                        <template #header>
                            <div
                                class="d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <h6 class="mb-0 fw-bold">
                                        M5: Mapa Emocional por Grupos (G1-G4)
                                    </h6>
                                    <small class="text-muted"
                                        >Balance de sentimientos detectados por
                                        turno</small
                                    >
                                </div>
                                <i
                                    class="bi bi-info-circle text-primary"
                                    v-b-tooltip.hover
                                    title="Cada barra representa el 100% de las emociones del grupo. Los colores permiten ver la composición anímica dominante en cada turno de trabajo."
                                >
                                </i>
                            </div>
                        </template>

                        <div class="chart-h">
                            <Bar :data="barData" :options="stackedOptions" />
                        </div>

                        <div class="mt-3 p-3 bg-light rounded border">
                            <div class="row align-items-center">
                                <div class="col-md-7 border-end">
                                    <small
                                        class="fw-bold d-block mb-2 text-navy"
                                        >Leyenda de Gestión:</small
                                    >
                                    <div class="d-flex flex-wrap gap-2">
                                        <span
                                            class="badge bg-success-soft text-success border border-success small px-2"
                                        >
                                            <i
                                                class="bi bi-emoji-smile-fill me-1"
                                            ></i>
                                            Positivas (Meta > 50%)
                                        </span>
                                        <span
                                            class="badge bg-danger-soft text-danger border border-danger small px-2"
                                        >
                                            <i
                                                class="bi bi-emoji-frown-fill me-1"
                                            ></i>
                                            Críticas (Vigilar)
                                        </span>
                                        <span
                                            class="badge bg-warning-soft text-warning border border-warning small px-2"
                                        >
                                            <i
                                                class="bi bi-exclamation-octagon-fill me-1"
                                            ></i>
                                            Ansiedad (Alerta Prevención)
                                        </span>
                                    </div>
                                </div>
                                <div class="col-md-5 ps-md-4 mt-2 mt-md-0">
                                    <small class="text-muted d-block smaller">
                                        <strong>Diagnóstico Rápido:</strong>
                                    </small>
                                    <small
                                        class="smaller text-muted d-block mt-1"
                                    >
                                        <i
                                            class="bi bi-lightbulb text-info me-1"
                                        ></i>
                                        Si la zona
                                        <strong>roja/naranja</strong> crece en
                                        un grupo específico, se recomienda
                                        revisar la carga laboral de esa semana
                                        en dicho turno.
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="mt-2 text-center pt-2">
                            <small class="text-muted fst-italic">
                                <i class="bi bi-target me-1"></i>
                                Meta Organizacional:
                                <strong>Alegría y Gratitud</strong> deben ser el
                                componente mayoritario.
                            </small>
                        </div>
                    </b-card>
                </b-col>
                <b-col lg="4">
                    <b-card border-0 shadow-sm rounded-xl>
                        <template #header>
                            <div
                                class="d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <h6 class="mb-0 fw-bold">
                                        M3: Radar de Dimensiones
                                    </h6>
                                    <small class="text-muted"
                                        >Equilibrio de los 5 pilares
                                        críticos</small
                                    >
                                </div>
                                <i
                                    class="bi bi-info-circle text-primary"
                                    v-b-tooltip.hover
                                    title="Representa el puntaje promedio (1-5) en las 5 dimensiones clave. Mientras más extendida y uniforme sea el área verde, mejor es el equilibrio organizacional."
                                >
                                </i>
                            </div>
                        </template>

                        <div class="chart-h">
                            <Radar :data="radarData" :options="radarOptions" />
                        </div>

                        <div class="mt-2 p-2 bg-light rounded border">
                            <div class="d-flex align-items-center mb-1">
                                <i class="bi bi-bullseye text-success me-2"></i>
                                <small class="fw-bold text-navy smaller"
                                    >Lectura de Equilibrio:</small
                                >
                            </div>
                            <ul class="mb-0 ps-3 list-unstyled">
                                <li class="smaller text-muted mb-1">
                                    <i
                                        class="bi bi-check2-circle text-success"
                                    ></i>
                                    <strong>Puntas externas:</strong> Fortalezas
                                    que debemos mantener.
                                </li>
                                <li class="smaller text-muted">
                                    <i
                                        class="bi bi-dash-circle text-danger"
                                    ></i>
                                    <strong>Hacia el centro:</strong> Debilidad
                                    crítica que afecta el clima.
                                </li>
                            </ul>
                            <hr class="my-2" />
                            <small
                                class="text-muted d-block smaller fst-italic"
                            >
                                <strong>Ejemplo:</strong> Si 'Jefatura' está
                                contraída, indica que el mal clima es por
                                liderazgo y no por el 'Puesto' de trabajo.
                            </small>
                        </div>
                    </b-card>
                </b-col>
            </b-row>

            <b-row class="mb-4" v-if="loaded">
                <b-col lg="7">
                    <b-card border-0 shadow-sm rounded-xl>
                        <template #header>
                            <div
                                class="d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <h6 class="mb-0 fw-bold">
                                        M7: Evaluación de Supervisores
                                    </h6>
                                    <small class="text-muted"
                                        >Liderazgo y apoyo percibido por el
                                        equipo</small
                                    >
                                </div>
                                <i
                                    class="bi bi-info-circle text-primary"
                                    v-b-tooltip.hover
                                    title="Métrica obtenida del promedio de valoración de los colaboradores directos sobre su jefatura inmediata."
                                >
                                </i>
                            </div>
                        </template>

                        <b-table
                            :items="stats.rankingJefes"
                            :fields="jefeFields"
                            striped
                            hover
                            small
                            responsive
                            class="mb-0"
                        >
                            <template #cell(avg)="data">
                                <div
                                    class="d-flex align-items-center"
                                    style="min-width: 120px"
                                >
                                    <b-progress
                                        :value="data.value"
                                        max="10"
                                        height="8px"
                                        class="flex-grow-1 me-2 shadow-sm"
                                        :variant="
                                            data.value < 5
                                                ? 'danger'
                                                : data.value < 7.5
                                                  ? 'warning'
                                                  : 'success'
                                        "
                                    ></b-progress>
                                    <span
                                        class="fw-bold small"
                                        :class="
                                            data.value < 5
                                                ? 'text-danger'
                                                : data.value < 7.5
                                                  ? 'text-warning'
                                                  : 'text-success'
                                        "
                                    >
                                        {{ data.value }}
                                    </span>
                                </div>
                            </template>
                        </b-table>

                        <div class="mt-3 p-2 bg-light rounded border">
                            <div class="row g-0 text-center">
                                <div class="col-4 border-end">
                                    <small class="d-block fw-bold text-danger"
                                        >Bajo ( < 5.0 )</small
                                    >
                                    <small class="smaller text-muted"
                                        >Intervención RRHH</small
                                    >
                                </div>
                                <div class="col-4 border-end">
                                    <small class="d-block fw-bold text-warning"
                                        >Medio ( 5 - 7.5 )</small
                                    >
                                    <small class="smaller text-muted"
                                        >Capacitación</small
                                    >
                                </div>
                                <div class="col-4">
                                    <small class="d-block fw-bold text-success"
                                        >Alto ( > 7.5 )</small
                                    >
                                    <small class="smaller text-muted"
                                        >Referente interno</small
                                    >
                                </div>
                            </div>
                            <div class="mt-2 pt-2 border-top">
                                <small class="text-muted smaller d-block">
                                    <strong>Acción sugerida:</strong> Los
                                    supervisores en rojo requieren una reunión
                                    de feedback para revisar el clima de su
                                    unidad específica.
                                </small>
                            </div>
                        </div>
                    </b-card>
                </b-col>
                <b-col lg="5">
                    <b-card border-0 shadow-sm rounded-xl>
                        <template #header>
                            <div
                                class="d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <h6 class="mb-0 fw-bold">
                                        M4: Comparativa de Turnos
                                    </h6>
                                    <small class="text-muted"
                                        >Diferencial de satisfacción Día vs
                                        Noche</small
                                    >
                                </div>
                                <i
                                    class="bi bi-info-circle text-primary"
                                    v-b-tooltip.hover
                                    title="Mide la distancia entre el promedio del turno día y noche. Una brecha mayor a 1.0 punto indica que un turno vive una realidad organizacional muy distinta al otro."
                                >
                                </i>
                            </div>
                        </template>

                        <div
                            class="d-flex justify-content-around align-items-center py-4"
                        >
                            <div class="text-center">
                                <i class="bi bi-sun text-warning fs-4"></i>
                                <h2 class="fw-bold text-primary mb-0">
                                    {{ stats.brecha?.dia }}
                                </h2>
                                <small class="text-muted fw-bold"
                                    >AVG. DÍA</small
                                >
                            </div>

                            <div
                                class="text-center border-start border-end px-4 position-relative"
                            >
                                <span
                                    class="badge rounded-pill position-absolute top-0 start-50 translate-middle-x"
                                    :class="
                                        stats.brecha?.diff > 1.0
                                            ? 'bg-danger'
                                            : 'bg-success'
                                    "
                                    style="font-size: 0.6rem"
                                >
                                    {{
                                        stats.brecha?.diff > 1.0
                                            ? "ALTA"
                                            : "ESTABLE"
                                    }}
                                </span>
                                <h5
                                    class="mb-0 fw-bold mt-4"
                                    :class="
                                        stats.brecha?.diff > 1.0
                                            ? 'text-danger'
                                            : 'text-success'
                                    "
                                >
                                    Δ {{ stats.brecha?.diff }}
                                </h5>
                                <small class="text-muted smaller">BRECHA</small>
                            </div>

                            <div class="text-center">
                                <i class="bi bi-moon-stars text-navy fs-4"></i>
                                <h2 class="fw-bold text-info mb-0">
                                    {{ stats.brecha?.noche }}
                                </h2>
                                <small class="text-muted fw-bold"
                                    >AVG. NOCHE</small
                                >
                            </div>
                        </div>

                        <div class="mt-2 border-top pt-3 text-center">
                            <div
                                v-if="stats.brecha?.diff > 1.0"
                                class="alert alert-warning py-1 px-2 mb-2"
                            >
                                <small class="smaller fw-bold">
                                    <i class="bi bi-exclamation-triangle"></i>
                                    Atención: Existe una diferencia crítica de
                                    percepción entre turnos.
                                </small>
                            </div>
                            <small class="text-muted d-block mb-1">
                                <strong>M12 Cobertura:</strong>
                                {{ stats.totalEncuestas }} participantes
                                activos.
                            </small>
                            <small class="smaller text-muted fst-italic">
                                * El objetivo es mantener la brecha (Δ) cercana
                                a 0.0.
                            </small>
                        </div>
                    </b-card>
                </b-col>
            </b-row>

            <b-row v-if="loaded">
                <b-col lg="4">
                    <b-card
                        border-0
                        shadow-sm
                        rounded-xl
                        class="bg-navy text-white h-100"
                    >
                        <template #header>
                            <div
                                class="d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <h6 class="text-white mb-0 fw-bold">
                                        M9: Focos Críticos de Acción
                                    </h6>
                                    <small class="text-light opacity-75"
                                        >Áreas con menor desempeño</small
                                    >
                                </div>
                                <i
                                    class="bi bi-question-circle text-warning"
                                    v-b-tooltip.hover
                                    title="Muestra las dimensiones que obtuvieron los promedios más bajos. Requieren intervención prioritaria."
                                >
                                </i>
                            </div>
                        </template>

                        <div
                            v-for="p in stats.prioridades"
                            :key="p.area"
                            class="border-bottom border-secondary py-3"
                        >
                            <div
                                class="d-flex justify-content-between align-items-center mb-1"
                            >
                                <span class="text-uppercase small fw-bold">
                                    <i
                                        class="bi bi-exclamation-triangle-fill text-warning me-2"
                                    ></i>
                                    {{ p.area }}
                                </span>
                                <span class="badge bg-warning text-dark"
                                    >{{ p.avg }} / 5.0</span
                                >
                            </div>

                            <div
                                class="bg-white bg-opacity-10 p-2 rounded mt-1"
                            >
                                <small
                                    class="smaller d-block text-info fw-bold"
                                >
                                    <i class="bi bi-lightbulb me-1"></i> Acción
                                    sugerida:
                                </small>
                                <small class="smaller text-light opacity-75">
                                    {{
                                        p.area.includes("Condiciones")
                                            ? "Revisar infraestructura o dotación de EPP."
                                            : p.area.includes("Jefatura")
                                              ? "Reforzar habilidades blandas en supervisores."
                                              : p.area.includes("Equipo")
                                                ? "Realizar jornada de integración grupal."
                                                : "Evaluar causas raíz en el próximo comité."
                                    }}
                                </small>
                            </div>
                        </div>

                        <template #footer>
                            <div class="text-center pt-2">
                                <small class="text-warning smaller fw-bold">
                                    <i class="bi bi-info-circle"></i> Prioridad
                                    1: Puntajes < 3.5
                                </small>
                            </div>
                        </template>
                    </b-card>
                </b-col>
                <b-col lg="4">
                    <b-card border-0 shadow-sm rounded-xl>
                        <template #header>
                            <div
                                class="d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <h6 class="mb-0 fw-bold">
                                        M2: Histograma de Ánimo
                                    </h6>
                                    <small class="text-muted"
                                        >Frecuencia de respuestas por escala
                                        (1-10)</small
                                    >
                                </div>
                                <i
                                    class="bi bi-info-circle text-primary"
                                    v-b-tooltip.hover
                                    title="Muestra cuántas personas eligieron cada nota. Notas 1-6 son Detractores, 7-8 Pasivos, 9-10 Promotores."
                                >
                                </i>
                            </div>
                        </template>

                        <div class="chart-h-sm">
                            <Bar :data="distData" :options="distOptions" />
                        </div>

                        <div class="mt-3 p-2 bg-light rounded border">
                            <div class="d-flex justify-content-between mb-1">
                                <small class="fw-bold text-danger"
                                    >1-6: Riesgo</small
                                >
                                <small class="fw-bold text-warning"
                                    >7-8: Neutro</small
                                >
                                <small class="fw-bold text-success"
                                    >9-10: Óptimo</small
                                >
                            </div>
                            <div class="progress" style="height: 6px">
                                <div
                                    class="progress-bar bg-danger"
                                    style="width: 33%"
                                ></div>
                                <div
                                    class="progress-bar bg-warning"
                                    style="width: 33%"
                                ></div>
                                <div
                                    class="progress-bar bg-success"
                                    style="width: 34%"
                                ></div>
                            </div>
                            <small class="text-muted d-block mt-2 smaller">
                                <strong>Ejemplo:</strong> Si las barras más
                                altas están arriba (9-10), el clima es de alta
                                motivación. Si están abajo, hay descontento
                                generalizado.
                            </small>
                        </div>
                    </b-card>
                </b-col>
                <b-col lg="4">
                    <b-card border-0 shadow-sm rounded-xl>
                        <template #header>
                            <div
                                class="d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <h6 class="mb-0 fw-bold">
                                        M8: Monitoreo en Vivo
                                    </h6>
                                    <small class="text-muted"
                                        >Últimas 10 respuestas recibidas</small
                                    >
                                </div>
                                <i
                                    class="bi bi-broadcast text-danger pulse-icon"
                                    v-b-tooltip.hover
                                    title="Flujo de datos en tiempo real. Permite detectar cambios bruscos en el ánimo del personal durante el turno."
                                >
                                </i>
                            </div>
                        </template>

                        <div class="list-scroll custom-scroll px-1">
                            <div
                                v-for="(u, i) in stats.ultimas"
                                :key="i"
                                class="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded border-start border-3 shadow-xs"
                                :class="
                                    u.rec <= 4
                                        ? 'border-danger'
                                        : u.rec <= 7
                                          ? 'border-warning'
                                          : 'border-success'
                                "
                            >
                                <div>
                                    <small class="fw-bold d-block text-navy">{{
                                        u.rut
                                    }}</small>
                                    <small class="text-muted smaller">
                                        <i class="bi bi-clock-history"></i>
                                        {{ u.turno }}
                                    </small>
                                </div>

                                <div class="text-end">
                                    <b-badge
                                        :variant="
                                            u.rec <= 4
                                                ? 'danger'
                                                : u.rec <= 7
                                                  ? 'warning text-dark'
                                                  : 'success'
                                        "
                                        pill
                                        class="px-3"
                                    >
                                        {{ u.rec }}
                                    </b-badge>
                                    <small
                                        class="d-block text-muted mt-1 fw-bold"
                                        style="font-size: 0.6rem"
                                        >REC.</small
                                    >
                                </div>
                            </div>
                        </div>

                        <div
                            class="mt-3 p-2 bg-navy text-white rounded shadow-sm"
                        >
                            <div class="d-flex align-items-center mb-1">
                                <i
                                    class="bi bi-shield-exclamation text-warning me-2"
                                ></i>
                                <small class="fw-bold smaller"
                                    >Protocolo de Reacción:</small
                                >
                            </div>
                            <div
                                class="smaller opacity-75 lh-sm"
                                style="font-size: 0.7rem"
                            >
                                <strong>Ejemplo:</strong> Si aparece un RUT con
                                nota
                                <span class="text-warning fw-bold"
                                    >4 o menos</span
                                >, el sistema lo contabiliza automáticamente
                                como <strong>Alerta Crítica</strong> (KPI M8)
                                para revisión de bienestar.
                            </div>
                        </div>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Bar, Radar } from "vue-chartjs";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

const loaded = ref(false);
const fechaActual = ref(new Date().toLocaleString());

// INICIALIZACIÓN DE STATS CON VALORES POR DEFECTO PARA EVITAR ERROR 'UNDEFINED'
const stats = ref({
    nps: "0",
    tasaEstres: "0",
    fidelizacion: "0",
    seguridad: "0",
    alertasCount: 0,
    totalEncuestas: 0,
    brecha: { dia: "0.0", noche: "0.0", diff: "0.0" },
    cobertura: [],
    prioridades: [],
    ultimas: [],
    rankingJefes: [],
});

const barData = ref({ labels: [], datasets: [] });
const radarData = ref({ labels: [], datasets: [] });
const distData = ref({ labels: [], datasets: [] });

const logout = () => {
    // 1. Obtenemos la cookie del token
    const token = useCookie("admin_token");

    // 2. Eliminamos el valor (la cookie se borra al setearla en null/undefined)
    token.value = null;

    // 3. (Opcional) Limpiar otros datos de sesión si los usas
    // localStorage.removeItem('user_data');

    // 4. Redirigir al login
    navigateTo("/admin/login");
};

const cargarDashboard = async () => {
    const token = useCookie("admin_token").value;
    if (!token) return navigateTo("/admin/login");

    try {
        const data = await $fetch(
            "https://pybingenieriachile.cl/api/encuestas/api/admin/stats-full",
            {
                headers: { Authorization: `Bearer ${token}` },
            },
        );

        // Asignar datos al objeto stats
        stats.value = data;
        fechaActual.value = new Date().toLocaleString();

        // Configurar Gráficos
        radarData.value = {
            labels: ["Equipo", "Puesto", "Empresa", "Jefatura", "Condiciones"],
            datasets: [
                {
                    label: "Promedio",
                    data: data.radar,
                    backgroundColor: "rgba(146, 208, 80, 0.2)",
                    borderColor: "#92d050",
                    pointBackgroundColor: "#1a4479",
                },
            ],
        };

        const emos = [
            "Estrés",
            "Alegría",
            "Ansiedad",
            "Gratitud",
            "Frustración",
        ];
        const colors = ["#dc3545", "#198754", "#ffc107", "#0dcaf0", "#fd7e14"];
        barData.value = {
            labels: data.statsTurnos.map((t) => t.nombre),
            datasets: emos.map((e, i) => ({
                label: e,
                data: data.statsTurnos.map((t) => t.emociones[e] || 0),
                backgroundColor: colors[i],
            })),
        };

        distData.value = {
            labels: data.distribucion.map((d) => d.label),
            datasets: [
                {
                    data: data.distribucion.map((d) => d.value),
                    backgroundColor: "#1a4479",
                    borderRadius: 5,
                },
            ],
        };

        loaded.value = true;
    } catch (e) {
        console.error("Error cargando dashboard:", e);
    }
};

const jefeFields = [
    { key: "name", label: "Supervisor" },
    { key: "avg", label: "Puntaje" },
];
const stackedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { stacked: true }, y: { stacked: true } },
};
const radarOptions = {
    scales: { r: { beginAtZero: true, max: 5 } },
    maintainAspectRatio: false,
};
const distOptions = {
    indexAxis: "y",
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
};

onMounted(cargarDashboard);
</script>

<style scoped>
.bg-navy {
    background-color: #1a4479 !important;
}
.text-navy {
    color: #1a4479;
}
.rounded-xl {
    border-radius: 1rem !important;
}
.chart-h {
    height: 320px;
}
.chart-h-sm {
    height: 220px;
}
.list-scroll {
    max-height: 250px;
    overflow-y: auto;
}
.custom-scroll::-webkit-scrollbar {
    width: 4px;
}
.custom-scroll::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}
.card-header {
    background: transparent;
    border-bottom: none;
    padding-top: 1.25rem;
}
@keyframes pulse-red {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.4;
    }
    100% {
        opacity: 1;
    }
}
.pulse-icon {
    animation: pulse-red 2s infinite;
}
</style>
