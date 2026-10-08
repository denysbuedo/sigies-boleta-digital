# Backlog propuesto para GitHub Projects

Este documento convierte el alcance inicial del Portal del Aspirante en actividades gestionables. Las tareas de implementación dependen de validar primero la interoperabilidad y las reglas institucionales.

## Configuración recomendada del Project

Vista principal: **Roadmap + tablero Kanban**.

Campos:

- `Estado`: Backlog, Ready, In progress, In review, Blocked, Done.
- `Prioridad`: P0 crítica, P1 alta, P2 media, P3 baja.
- `Fase`: Validación, PoC, MVP, Piloto, Producción.
- `Área`: Producto, DATYS, SIGIES, Web, API, Datos, Seguridad, Infraestructura, QA, Operaciones.
- `Tamaño`: XS, S, M, L, XL.
- `Responsable` y `Fecha objetivo`.

Etiquetas del repositorio:

- Tipos: `epic`, `feature`, `task`, `spike`, `bug`, `decision`, `documentation`.
- Áreas: `area:datys`, `area:sigies`, `area:web`, `area:api`, `area:data`, `area:security`, `area:infra`, `area:qa`.
- Gestión: `blocked`, `needs-institutional-input`, `good-first-issue`.

Cada issue debe contener objetivo, alcance, dependencias, criterios de aceptación y evidencia de cierre. Los epics agrupan los issues mediante subtareas.

## Hitos y actividades

### Hito 0 — Definición y validación institucional

Objetivo: eliminar las incógnitas que pueden invalidar el diseño antes de construir el formulario.

| ID | Actividad | Tipo | Prioridad | Dependencias | Criterio de cierre |
|---|---|---|---|---|---|
| GOV-01 | Designar propietarios de producto, datos, seguridad e integraciones | task | P0 | — | Responsables y mecanismo de aprobación documentados |
| GOV-02 | Acordar alcance del MVP y fuera de alcance | decision | P0 | GOV-01 | Alcance aprobado por las partes |
| GOV-03 | Validar normativa, tratamiento de datos y atención a menores | spike | P0 | GOV-01 | Informe jurídico con requisitos y retención aprobados |
| GOV-04 | Definir cuándo una boleta adquiere validez administrativa | decision | P0 | GOV-03 | Regla de confirmación, comprobante y rectificación aprobada |
| GOV-05 | Definir vía asistida, reclamaciones y subsanación de datos | task | P1 | GOV-02, GOV-03 | Flujo, responsables y SLA documentados |
| DATYS-01 | Confirmar protocolo, atributos, sandbox y SLA de DATYS | spike | P0 | GOV-01 | Contrato técnico o minuta aceptada; incógnitas registradas |
| SIGIES-01 | Inventariar API, modelo, ambientes y capacidades de SIGIES | spike | P0 | GOV-01 | Endpoints, capacidades y brechas documentados |
| SIGIES-02 | Acordar fuente de elegibilidad, catálogo y reglas de convocatoria | decision | P0 | SIGIES-01 | Fuente oficial y reglas aprobadas |
| ARCH-01 | Registrar arquitectura y límites de responsabilidad en ADR | decision | P1 | DATYS-01, SIGIES-01 | ADR revisado y aceptado |

### Hito 1 — Fundaciones y pruebas de concepto

Objetivo: demostrar los dos riesgos técnicos principales con datos sintéticos.

| ID | Actividad | Tipo | Prioridad | Dependencias | Criterio de cierre |
|---|---|---|---|---|---|
| DEV-01 | Inicializar monorepo, herramientas, convenciones y scripts | task | P1 | ARCH-01 | Build, lint, tipos y pruebas ejecutan localmente |
| DEV-02 | Configurar CI y protección esperada de `main` | task | P1 | DEV-01 | Una PR ejecuta controles obligatorios |
| SEC-01 | Crear gestión de configuración y secretos por ambiente | task | P0 | DEV-01 | No hay secretos en Git; variables están documentadas |
| OBS-01 | Definir logs estructurados, correlación y datos prohibidos | task | P1 | DEV-01, GOV-03 | Eventos trazables sin datos sensibles innecesarios |
| DATYS-02 | Implementar simulador del proveedor de identidad | feature | P1 | DATYS-01, DEV-01 | Permite éxito, rechazo, cancelación y expiración |
| DATYS-03 | Ejecutar PoC de autenticación con DATYS | spike | P0 | DATYS-01, SEC-01 | Login y logout reales demostrados en sandbox |
| SIGIES-03 | Especificar contrato OpenAPI mínimo del adaptador | task | P0 | SIGIES-01, SIGIES-02 | Contrato revisado y versionado |
| SIGIES-04 | Implementar simulador SIGIES | feature | P1 | SIGIES-03 | Simula elegibilidad, catálogo, envío y consulta |
| SIGIES-05 | Ejecutar PoC de consulta y registro sintético | spike | P0 | SIGIES-03, SEC-01 | Acuse recuperable e idempotencia demostrados |

### Hito 2 — MVP funcional

Objetivo: completar el flujo de una boleta con integraciones simuladas y luego conectarlo al sandbox.

| ID | Actividad | Tipo | Prioridad | Dependencias | Criterio de cierre |
|---|---|---|---|---|---|
| UX-01 | Diseñar flujo móvil, estados, errores y accesibilidad | feature | P1 | GOV-02, GOV-05 | Prototipo revisado con escenarios críticos |
| API-01 | Implementar sesión backend y autorización por recurso | feature | P0 | DATYS-02, SEC-01 | Una sesión no accede a recursos ajenos |
| API-02 | Implementar consulta de elegibilidad y convocatoria | feature | P0 | SIGIES-04, API-01 | Aspirante no elegible queda bloqueado con orientación |
| API-03 | Implementar catálogo filtrado de opciones | feature | P0 | API-02 | Solo devuelve opciones autorizadas y vigentes |
| APP-01 | Implementar creación y recuperación de borradores | feature | P1 | API-02, DEV-01 | Borrador versionado recuperable entre sesiones |
| APP-02 | Implementar selección y orden de hasta diez preferencias | feature | P0 | APP-01, API-03, UX-01 | Evita duplicados y opciones inválidas |
| APP-03 | Implementar revisión, confirmación y revalidación | feature | P0 | APP-02 | La confirmación muestra contenido final y revalida reglas |
| APP-04 | Implementar envío idempotente y recuperación tras timeout | feature | P0 | APP-03, SIGIES-04 | Reintentos no duplican; estado incierto se consulta |
| APP-05 | Implementar estados, historial y rectificación autorizada | feature | P1 | APP-04, GOV-04 | Transiciones y versiones quedan auditadas |
| REC-01 | Generar comprobante PDF verificable | feature | P1 | APP-04, GOV-04 | Solo se emite tras acuse oficial y minimiza datos |
| SUP-01 | Implementar creación y seguimiento básico de incidencias | feature | P1 | GOV-05, API-01 | Casos trazables con acceso restringido |
| AUD-01 | Implementar auditoría append-only de eventos sensibles | feature | P0 | OBS-01, API-01 | Acciones críticas tienen actor, resultado y correlación |

### Hito 3 — Calidad, seguridad y piloto

Objetivo: obtener evidencia de que el servicio es seguro y usable en condiciones reales.

| ID | Actividad | Tipo | Prioridad | Dependencias | Criterio de cierre |
|---|---|---|---|---|---|
| QA-01 | Automatizar pruebas unitarias y de integración | task | P1 | MVP funcional | Reglas críticas y adaptadores tienen cobertura acordada |
| QA-02 | Automatizar flujo E2E del aspirante | task | P0 | APP-04, REC-01 | Casos feliz, rechazo, timeout y reintento pasan en CI |
| QA-03 | Ejecutar pruebas de contrato con DATYS y SIGIES | task | P0 | DATYS-03, SIGIES-05 | No existen incompatibilidades abiertas P0/P1 |
| QA-04 | Probar móviles, accesibilidad WCAG 2.2 AA y red lenta | task | P1 | UX-01, MVP funcional | Hallazgos críticos resueltos y evidencia archivada |
| SEC-02 | Ejecutar modelado de amenazas y revisión OWASP ASVS | task | P0 | MVP funcional | Riesgos P0/P1 mitigados o formalmente aceptados |
| PERF-01 | Probar carga, picos de cierre y degradación de dependencias | task | P1 | QA-02 | SLO y capacidad objetivo cumplidos |
| OPS-01 | Preparar monitoreo, alertas, runbooks y soporte | task | P1 | OBS-01, MVP funcional | Incidentes principales tienen alerta y procedimiento |
| OPS-02 | Probar backup, restauración y rollback | task | P0 | Infraestructura de piloto | Restauración y rollback ejecutados con evidencia |
| PILOT-01 | Definir muestra, métricas y consentimiento del piloto | task | P0 | GOV-03, QA-04 | Plan de piloto aprobado |
| PILOT-02 | Ejecutar piloto territorial y registrar resultados | epic | P0 | Todas las actividades P0 anteriores | Informe, incidencias y decisión de continuidad aprobados |

### Hito 4 — Preparación para producción

| ID | Actividad | Tipo | Prioridad | Dependencias | Criterio de cierre |
|---|---|---|---|---|---|
| PROD-01 | Resolver hallazgos y deuda priorizada del piloto | epic | P0 | PILOT-02 | No quedan hallazgos críticos abiertos |
| SEC-03 | Realizar pentest independiente y remediación | task | P0 | PROD-01 | Informe cerrado o riesgos aceptados formalmente |
| OPS-03 | Definir SLO, capacidad, continuidad y recuperación ante desastre | task | P0 | PERF-01, OPS-02 | Plan aprobado y probado |
| OPS-04 | Formar soporte y operadores; ejecutar simulacro | task | P1 | OPS-01, GOV-05 | Personal completa escenarios de operación |
| PROD-02 | Ejecutar despliegue gradual con criterios de avance y reversión | epic | P0 | SEC-03, OPS-03, OPS-04 | Cada etapa tiene aprobación y evidencia operativa |

## Primer ciclo recomendado

Mover inicialmente a `Ready` solo estas actividades:

1. `GOV-01` — responsables y gobierno.
2. `GOV-02` — alcance del MVP.
3. `DATYS-01` — capacidades reales de identidad.
4. `SIGIES-01` — capacidades reales de integración.
5. `GOV-03` — requisitos jurídicos y de privacidad.

`DATYS-03` y `SIGIES-05` son los primeros hitos técnicos. El desarrollo completo del formulario debe permanecer en `Backlog` hasta que los contratos y las pruebas de concepto reduzcan esos riesgos.

## Definición de terminado común

Una actividad se considera `Done` cuando:

- cumple todos sus criterios de aceptación;
- tiene revisión técnica o institucional según corresponda;
- incluye pruebas y documentación necesarias;
- no introduce secretos ni datos personales reales;
- deja evidencia enlazada en el issue (PR, acta, informe o resultado de prueba);
- sus riesgos o tareas posteriores están registrados como nuevos issues.
