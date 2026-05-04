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
            <b-row v-if="loaded">
                <b-col
                    class="mb-4"
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
                        :class="[
                            'border-' + kpi.c,
                            kpi.l.includes('M8') ? 'cursor-pointer' : '',
                        ]"
                        v-b-tooltip.hover
                        :title="kpi.t"
                        @click="
                            kpi.l.includes('M8') ? abrirModalAlertas() : null
                        "
                    >
                        <!-- El resto de tu contenido interno se mantiene igual -->
                        <small
                            class="text-muted fw-bold d-block text-uppercase mb-1"
                            style="font-size: 0.65rem"
                        >
                            {{ kpi.l }}
                            <!-- Icono de click solo para alertas -->
                            <i
                                v-if="kpi.l.includes('M8')"
                                class="bi bi-box-arrow-in-up-right ms-1 text-primary"
                            ></i>
                            <i v-else class="bi bi-info-circle ms-1"></i>
                        </small>

                        <div
                            v-if="kpi.l.includes('M8')"
                            class="text-primary mb-2"
                            style="font-size: 0.7rem"
                        >
                            <i class="bi bi-hand-index-thumb"></i> Haz clic para
                            ver detalles
                        </div>

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
                                :class="[
                                    'bi bi-' + kpi.i,
                                    'text-' + kpi.c,
                                    kpi.l.includes('M8') ? 'pulse-icon' : '',
                                ]"
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

            <b-modal
                v-model="mostrarDetalleAlertas"
                title="Gestión Integral de Alertas Críticas"
                size="lg"
                ok-only
                ok-title="Cancelar"
                ok-variant="secondary"
            >
                <!-- Spinner de carga -->
                <div v-if="cargandoAlertas" class="text-center py-5">
                    <b-spinner variant="danger"></b-spinner>
                    <p>Cargando todos los registros...</p>
                </div>

                <div v-else>
                    <b-table
                        :items="alertasPaginadas"
                        :fields="camposAlertas"
                        striped
                        hover
                        responsive
                        small
                    >
                        <!-- Slot personalizado para formatear el RUT -->
                        <template #cell(rut)="data">
                            <span class="font-monospace fw-bold">
                                {{ formatearRut(data.value) }}
                            </span>
                        </template>
                        <template #cell(rec)="data">
                            <b-badge
                                :variant="
                                    data.value <= 3 ? 'danger' : 'warning'
                                "
                            >
                                {{ data.value }} / 10
                            </b-badge>
                        </template>
                    </b-table>

                    <!-- Componente de Paginación -->
                    <div
                        class="d-flex justify-content-between align-items-center mt-3"
                    >
                        <small class="text-muted">
                            Mostrando página {{ paginaActual }} de
                            {{ Math.ceil(totalAlertas / porPagina) }} ({{
                                totalAlertas
                            }}
                            registros totales)
                        </small>

                        <b-pagination
                            v-model="paginaActual"
                            :total-rows="totalAlertas"
                            :per-page="porPagina"
                            @change="obtenerAlertasPaginadas"
                            size="sm"
                            pills
                        ></b-pagination>
                    </div>
                </div>
            </b-modal>

            <b-row v-if="loaded">
                <b-col lg="8" class="mb-4">
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

                        <div
                            class="d-flex align-items-center justify-content-center bg-primary-soft rounded-pill py-1 px-3 mb-3"
                            style="border: 1px dashed #0d6efd"
                        >
                            <i
                                class="bi bi-cursor-fill text-primary me-2 pulse-icon"
                            ></i>
                            <span class="text-primary fw-bold small">
                                Exploración activa: Haz clic en cualquier color
                                de las barras para ver la lista de personas.
                            </span>
                        </div>

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
                <b-col lg="4" class="mb-4">
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

            <b-row v-if="loaded">
                <b-col class="mb-4" lg="7">
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

                        <div
                            v-for="jefe in stats.rankingJefes"
                            :key="jefe.name"
                            class="mb-4"
                        >
                            <!-- Nombre del Jefe y su Nota -->
                            <div
                                class="d-flex justify-content-between align-items-center mb-1"
                            >
                                <span class="font-weight-bold">{{
                                    jefe.name
                                }}</span>
                                <b-badge
                                    :variant="getJefeVariant(jefe.avg)"
                                    pill
                                >
                                    {{ jefe.avg }} / 10
                                </b-badge>
                            </div>

                            <!-- Barra Horizontal de Promedio -->
                            <b-progress
                                :value="jefe.avg"
                                :max="10"
                                :variant="getJefeVariant(jefe.avg)"
                                height="20px"
                                show-progress
                                class="shadow-sm"
                            ></b-progress>
                        </div>

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
                <b-col class="mb-4" lg="5">
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
                <b-col lg="4" class="mb-4">
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
                <b-col class="mb-4" lg="4">
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
                <b-col class="mb-4" lg="4">
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

        <!-- Modal para detalle de encuestados por gráfico M5 -->
        <b-modal
            v-model="mostrarDetalleGrafico"
            :title="'Detalle: ' + detalleGraficoTitulo"
            size="lg"
            hide-footer
            ok-only
            ok-title="Cancelar"
            ok-variant="secondary"
        >
            <b-table
                :items="datosDetalleGrafico"
                :fields="camposDetalleGrafico"
                striped
                hover
                responsive
                small
            >
                <template #cell(rut)="data">
                    <span class="font-monospace fw-bold">{{
                        formatearRut(data.value)
                    }}</span>
                </template>
            </b-table>
            <div class="d-flex justify-content-between align-items-center mt-3">
                <small class="text-muted">
                    Total: {{ totalRegistrosDetalle }} registros
                </small>

                <b-pagination
                    v-model="paginaActualDetalle"
                    :total-rows="totalRegistrosDetalle"
                    :per-page="limitePorPagina"
                    @update:model-value="cargarPaginaDetalle"
                    size="sm"
                    pills
                ></b-pagination>
            </div>
            <div v-if="cargandoDetalleGrafico" class="text-center py-3">
                <b-spinner small variant="primary"></b-spinner>
            </div>
        </b-modal>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Bar, Radar } from "vue-chartjs";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

const loaded = ref(false);
const fechaActual = ref(new Date().toLocaleString());

const mostrarDetalleAlertas = ref(false);
const alertasPaginadas = ref([]);
const totalAlertas = ref(0);
const paginaActual = ref(1);
const porPagina = ref(10); // Cantidad de registros por página
const cargandoAlertas = ref(false);

const totalRegistrosDetalle = ref(0);
const paginaActualDetalle = ref(1);
const limitePorPagina = ref(10);

// Guardamos estos para cuando el usuario cambie de página
const ultimoGrupoSeleccionado = ref("");
const ultimaEmocionSeleccionada = ref("");

const camposAlertas = [
    { key: "rut", label: "RUT Colaborador", sortable: true },
    { key: "rec", label: "Puntaje", sortable: true },
    { key: "turno", label: "Turno", sortable: true },
];

const mostrarDetalleGrafico = ref(false);
const detalleGraficoTitulo = ref("");
const datosDetalleGrafico = ref([]);
const cargandoDetalleGrafico = ref(false);

const camposDetalleGrafico = [
    { key: "rut", label: "RUT" },
    { key: "nombre", label: "Nombre" }, // Si tu API lo provee
    { key: "rec", label: "Nota" },
    { key: "fecha", label: "Fecha" },
];

const formatearRut = (rut) => {
    if (!rut) return "N/A";

    // 1. Limpiar el RUT de puntos y guiones existentes
    let valor = rut.replace(/\./g, "").replace(/-/g, "").trim();

    if (valor.length < 2) return valor;

    // 2. Separar el cuerpo del dígito verificador
    let cuerpo = valor.slice(0, -1);
    let dv = valor.slice(-1).toUpperCase();

    // 3. Formatear el cuerpo con puntos usando una expresión regular
    cuerpo = cuerpo
        .toString()
        .split("")
        .reverse()
        .join("")
        .replace(/(?=\d)\d{3}(?=\d)/g, "$&.")
        .split("")
        .reverse()
        .join("");

    return `${cuerpo}-${dv}`;
};

const obtenerAlertasPaginadas = async (page = 1) => {
    const token = useCookie("admin_token").value;
    cargandoAlertas.ref = true;

    try {
        // Asumiendo que tu API permite filtrar por puntaje <= 5 y paginar
        const response = await $fetch(
            "https://pybingenieriachile.cl/api/encuestas/api/admin/alertas-full",
            {
                params: {
                    page: page,
                    limit: porPagina.value,
                    max_score: 5, // Filtro para traer solo críticos/bajos
                },
                headers: { Authorization: `Bearer ${token}` },
            },
        );

        alertasPaginadas.value = response.data; // Los registros de esta página
        totalAlertas.value = response.total; // El total de registros en la BD
        paginaActual.value = page;
    } catch (error) {
        console.error("Error al cargar alertas completas:", error);
    } finally {
        cargandoAlertas.value = false;
    }
};

const abrirModalAlertas = () => {
    mostrarDetalleAlertas.value = true;
    obtenerAlertasPaginadas(1); // Carga la primera página al abrir
};

const trabajadoresEnAlerta = computed(() => {
    if (!stats.value.ultimas) return [];

    return stats.value.ultimas
        .filter((t) => t.rec <= 5) // El backend dice que < 6 es Bajo/Crítico
        .map((t) => ({
            ...t,
            estado: t.rec <= 3 ? "Crítico" : "Bajo",
        }));
});

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
    statsTurnos: [], // Inicializar como array vacío evita el error de .map()
    distribucion: [],
    radar: [],
});

const barData = ref({ labels: [], datasets: [] });
const radarData = ref({ labels: [], datasets: [] });
const distData = ref({ labels: [], datasets: [] });

function getJefeVariant(avg) {
    const nota = parseFloat(avg);
    if (nota >= 8.5) return "success"; // Excelente gestión (Verde)
    if (nota >= 7.0) return "info"; // Buena gestión (Azul)
    if (nota >= 5.0) return "warning"; // Alerta / Necesita capacitación (Amarillo)
    return "danger"; // Crítico / Intervención RRHH (Rojo)
}

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

        // 1. VALIDACIÓN CRÍTICA: Verificar que data y statsTurnos existan
        if (!data || !data.statsTurnos) {
            console.warn("La API respondió pero falta 'statsTurnos':", data);
            // Inicializamos con un array vacío para que los .map() no fallen
            data.statsTurnos = [];
        }

        // Asignar datos al objeto stats
        stats.value = data;
        fechaActual.value = new Date().toLocaleString();

        // 2. Configurar Gráfico Radar (M3)
        // Usamos un fallback (data.radar || []) para evitar fallos
        radarData.value = {
            labels: ["Equipo", "Puesto", "Empresa", "Jefatura", "Condiciones"],
            datasets: [
                {
                    label: "Promedio",
                    data: data.radar || [0, 0, 0, 0, 0],
                    backgroundColor: "rgba(146, 208, 80, 0.2)",
                    borderColor: "#92d050",
                    pointBackgroundColor: "#1a4479",
                },
            ],
        };

        // 3. Configurar Gráfico de Barras Emocional (M5)
        const emos = [
            "Estrés",
            "Alegría",
            "Ansiedad",
            "Gratitud",
            "Frustración",
        ];
        const colors = ["#dc3545", "#198754", "#ffc107", "#0dcaf0", "#fd7e14"];

        barData.value = {
            // Verificamos t.nombre con un fallback
            labels: data.statsTurnos.map((t) => t.nombre || "Sin nombre"),
            datasets: emos.map((e, i) => ({
                label: e,
                // Verificamos que t.emociones exista antes de acceder a la emoción
                data: data.statsTurnos.map(
                    (t) => (t.emociones ? t.emociones[e] : 0) || 0,
                ),
                backgroundColor: colors[i],
            })),
        };

        // 4. Configurar Histograma de Ánimo (M2)
        if (data.distribucion) {
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
        }

        // Finalmente marcamos como cargado
        loaded.value = true;
    } catch (e) {
        // Captura errores de red o de código
        console.error("Error crítico cargando dashboard:", e);
        // Opcional: podrías poner un estado de error para mostrar un mensaje al usuario
    }
};

const handleChartClick = async (event, elements) => {
    if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const datasetIndex = elements[0].datasetIndex;

        const grupoNombre = barData.value.labels[elementIndex];
        const emocionNombre = barData.value.datasets[datasetIndex].label;

        // Guardamos los filtros para la paginación futura
        ultimoGrupoSeleccionado.value = grupoNombre;
        ultimaEmocionSeleccionada.value = emocionNombre;
        paginaActualDetalle.value = 1; // Resetear a la primera página al hacer nuevo click

        detalleGraficoTitulo.value = `${emocionNombre} en ${grupoNombre}`;
        mostrarDetalleGrafico.value = true;

        // Llamamos a la función de carga (factorizada para reutilizarla)
        await cargarPaginaDetalle(1);
    }
};

const cargarPaginaDetalle = async (pagina) => {
    cargandoDetalleGrafico.value = true;
    paginaActualDetalle.value = pagina;

    try {
        const token = useCookie("admin_token").value;
        const response = await $fetch(
            "https://pybingenieriachile.cl/api/encuestas/api/admin/detalle-emocion",
            {
                params: {
                    turno: ultimoGrupoSeleccionado.value,
                    emocion: ultimaEmocionSeleccionada.value,
                    page: pagina,
                    limit: limitePorPagina.value,
                },
                headers: { Authorization: `Bearer ${token}` },
            },
        );

        // IMPORTANTE: Según tu backend, la data real está en response.data
        datosDetalleGrafico.value = response.data;
        // Según tu backend: res.json({ data, total, ... })
        totalRegistrosDetalle.value = response.total;
    } catch (error) {
        console.error("Error al obtener detalle del gráfico:", error);
    } finally {
        cargandoDetalleGrafico.value = false;
    }
};

const jefeFields = [
    { key: "name", label: "Supervisor" },
    { key: "avg", label: "Puntaje" },
];
const stackedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: handleChartClick, // <-- Añade esto
    plugins: {
        tooltip: { enabled: true },
    },
    scales: {
        x: { stacked: true },
        y: { stacked: true },
    },
    // Opcional: Cambiar cursor al pasar sobre las barras
    onHover: (event, chartElement) => {
        event.native.target.style.cursor = chartElement.length
            ? "pointer"
            : "default";
    },
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
.cursor-pointer {
    cursor: pointer;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.cursor-pointer:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

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

/* Clase para la tarjeta de alertas */
.cursor-pointer.border-pulse:hover {
    border-top-color: #dc3545 !important; /* Rojo alerta */
    box-shadow: 0 0 10px rgba(220, 53, 69, 0.3) !important;
    transform: scale(1.02);
    transition: all 0.3s ease;
}

/* Animación opcional para el icono de la mano */
@keyframes finger-move {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-2px);
    }
}
.bi-hand-index-thumb {
    display: inline-block;
    animation: finger-move 1.5s infinite;
}
</style>
