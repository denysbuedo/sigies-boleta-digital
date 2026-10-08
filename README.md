# Portal del Aspirante a la Educación Superior

**Proyecto propuesto | MES – MINED – DATYS – SIGIES | Octubre de 2026**

> Estado: **diseño / preimplementación**. Las API reales de DATYS y SIGIES, los acuerdos legales y los procedimientos oficiales están pendientes de validación. No afirmar interoperabilidad productiva hasta completar las pruebas correspondientes.

## Documentación del proyecto

- [Propuesta técnica integral](docs/propuesta-tecnica-portal-aspirante.pdf): documento de alcance para revisión institucional y técnica.
- [Backlog propuesto para GitHub Projects](docs/github-project-backlog.md): actividades, prioridades, dependencias y criterios de cierre iniciales.

## 1. Visión

Permitir que los estudiantes de preuniversitario en Cuba accedan a un portal web ligero, se autentiquen a través del proveedor de identidad digital de **DATYS** utilizado por la plataforma **Soberanía**, sean validados como aspirantes habilitados mediante **SIGIES** y completen, revisen y presenten su **boleta digital de hasta diez preferencias de carreras**, obteniendo comprobante verificable.

**Principio rector:** SIGIES mantiene la autoridad sobre la elegibilidad, el registro oficial de la boleta y el otorgamiento. Este proyecto desarrolla un **canal ciudadano**, no otro sistema de ingreso.

## 2. Objetivos

- Autenticación federada con identidad digital nacional.
- Verificación de la elegibilidad del estudiante para una convocatoria y vía específicas.
- Consulta de carreras y requisitos permitidos para cada aspirante.
- Borradores recuperables desde distintos dispositivos.
- Selección y ordenamiento de hasta diez preferencias, sin duplicados.
- Validación, confirmación y presentación transaccional ante SIGIES.
- Comprobante PDF con identificador y código de comprobación.
- Historial de estados y modificaciones autorizadas.
- Vía asistida, accesible y auditable para estudiantes sin acceso digital.
- Métricas agregadas sin exposición innecesaria de datos personales.

## 3. Stack tecnológico propuesto

| Componente | Tecnología | Criterio |
|---|---|---|
| Web | **Next.js + React + TypeScript** (App Router) | UX responsive, SSR donde aporte valor, páginas ligeras. |
| Estilos/UI | **Tailwind CSS** + componentes accesibles | Interfaz consistente, ligera y móvil. |
| Formularios | React Hook Form + **Zod** | Validación clara y compartible. |
| BFF/API | **NestJS + TypeScript** | Arquitectura modular; OpenAPI/Swagger; contratos. |
| Persistencia local | **PostgreSQL** | Borradores, sesiones y auditoría; sin duplicar datos maestros. |
| ORM | **Prisma** | Migraciones y tipado. Elegir Prisma o Drizzle, no ambos. |
| Caché | **Redis** | Rate limiting, estado efímero y colas cuando se requiera. |
| Autenticación | **OIDC Authorization Code + PKCE**, sujeto a soporte DATYS | Identidad federada; sesiones backend. |
| Integración SIGIES | Cliente HTTPS tipado, contrato OpenAPI acordado | Adaptador desacoplado de SIGIES. |
| Tareas asíncronas | BullMQ, **solo si** aparecen trabajos diferibles | Evitar complejidad prematura; nunca procesar envíos oficiales de manera ambigua. |
| Testing | Vitest/Jest, Supertest, Playwright | Unitarias, integración, contratos y E2E. |
| Observabilidad | OpenTelemetry, Grafana y Loki | Logs estructurados, métricas y trazabilidad. |
| Proxy / despliegue | Ubuntu 24.04 LTS, HAProxy/Nginx, **systemd** | Despliegue sin Docker/Kubernetes. |
| CI/CD | GitHub Actions o GitLab CI | Lint, tipos, pruebas, auditoría y despliegues controlados. |

**Versiones:** fijar releases LTS/estables verificadas al momento de iniciar, con archivo lock y actualizaciones de seguridad; no asumir números de versión que cambian con el tiempo.

### Principios arquitectónicos

1. **API-first:** documentar OpenAPI y versionar contratos.
2. **BFF seguro:** tokens DATYS no expuestos a JavaScript del navegador; cookies `Secure`, `HttpOnly`, `SameSite`.
3. **Integraciones intercambiables:** puertos/adaptadores para DATYS y SIGIES, con implementaciones mock para desarrollo.
4. **Una fuente oficial:** SIGIES registra la boleta presentada; la base propia conserva borradores y referencias.
5. **Idempotencia:** una misma confirmación no puede crear dos boletas.
6. **Privacidad por diseño:** minimización, retención definida, auditoría y cifrado.
7. **Accesibilidad y bajo ancho de banda:** WCAG 2.2 AA como objetivo; probar móviles de gama baja y redes lentas.
8. **Sin dependencia obligatoria de Docker:** scripts de provisionamiento y unidades systemd.

## 4. Diagrama lógico

```mermaid
flowchart TD
  E[Estudiante / Navegador] --> P[Portal web Next.js / BFF]
  P --> ID[DATYS: Proveedor de identidad]
  P --> API[API de Ingreso NestJS]
  API --> DB[(PostgreSQL: borradores y auditoría)]
  API --> R[(Redis: controles efímeros)]
  API --> AD[Adaptador SIGIES]
  AD --> S[SIGIES - Registro oficial]
  S --> U[SIGENU / Sistemas universitarios]
```

> El diagrama es **propuesto**; no declara la existencia de APIs actuales de los sistemas externos.

## 5. Flujo de estudiante

1. Abre el portal y lee las condiciones de la convocatoria.
2. Pulsa «Acceder con identidad digital»; se redirige a DATYS.
3. DATYS autentica a la persona y devuelve la identidad certificada según el contrato.
4. El backend consulta a SIGIES para comprobar su elegibilidad en esa convocatoria.
5. Si no está habilitado, se ofrece un canal de corrección con MINED/CIP; no se permite presentación oficial.
6. Si está habilitado, se carga la oferta autorizada y los datos mínimos visibles.
7. El estudiante elige y ordena hasta diez opciones; puede guardar el borrador.
8. Revisa cada opción, confirma expresamente y solicita presentar la boleta.
9. La API registra la solicitud de forma idempotente en SIGIES y espera aceptación verificable.
10. Solo tras aceptación muestra folio, fecha/hora, estado y comprobante PDF con verificación.
11. Puede consultar historial y modificar preferencias solo mientras la normativa lo permita.

## 6. Módulos de aplicación

### `auth`

Federación DATYS, validación OIDC si se soporta, manejo de sesión, logout, renovación segura y niveles de identidad. No almacenar biometría, fotografías ni documentos de identidad.

### `aspirants`

Consulta de aspirante habilitado mediante SIGIES, conciliación con identificador certificado, vía de ingreso, territorio, centro y convocatoria. Solo lectura para datos maestros.

### `catalog`

Oferta autorizada y validada de carreras, plazas y requisitos si SIGIES lo facilita; cachear solo datos públicos y con fechas de expiración. No inventar carreras elegibles.

### `applications`

Boletas, diez preferencias ordenadas, reglas de negocio, borradores, versiones, confirmación, presentación idempotente y consulta del estado oficial.

### `receipts`

Generación y consulta de comprobantes a partir de aceptación oficial, con código de verificación firmado o resolución contra servidor. Nunca incluir más datos personales de los necesarios en un QR público.

### `support`

Incidencias de identidad y elegibilidad, soporte asistido con RBAC, razón documentada, doble control cuando proceda y trazabilidad.

### `audit`

Bitácora append-only de eventos sensibles, sin guardar tokens, secretos o datos biométricos. Correlación entre portal, adaptador y SIGIES.

## 7. Contratos API propuestos (no implementados)

Prefijo: `/api/v1`.

| Método | Endpoint | Finalidad |
|---|---|---|
| GET | `/me` | Sesión e identidad mínima. |
| GET | `/me/eligibility?callId=...` | Consultar habilitación y restricciones. |
| GET | `/calls/active` | Convocatorias visibles. |
| GET | `/calls/{id}/options` | Opciones permitidas para el aspirante. |
| GET | `/applications/current` | Boleta/borrador actual. |
| PUT | `/applications/current/draft` | Guardar borrador con control de versión. |
| POST | `/applications/current/submit` | Presentar boleta con `Idempotency-Key`. |
| GET | `/applications/{id}/status` | Consultar resultado de SIGIES. |
| GET | `/applications/{id}/receipt` | Descargar comprobante aceptado. |
| POST | `/support/cases` | Crear incidencia. |

Ejemplo de envío **ilustrativo**:

```json
{
  "callId": "convocatoria-2027",
  "expectedVersion": 3,
  "preferences": [
    {"position": 1, "offerOptionId": "opcion-a"},
    {"position": 2, "offerOptionId": "opcion-b"}
  ],
  "confirmed": true
}
```

El servidor obtiene la identidad de la **sesión autenticada**, nunca de un parámetro controlable por el cliente. El contrato de SIGIES se diseñará tras conocer su interfaz real. El ejemplo contiene dos opciones solo para explicar el esquema: el número exacto exigido debe ser parametrizable según normativa y convocatoria.

### Estados

`DRAFT`, `READY`, `SUBMITTING`, `SUBMITTED`, `REJECTED`, `AMENDED`, `CLOSED`.

`SUBMITTING` no equivale a éxito. Tras un timeout se debe **consultar** el estado en SIGIES antes de reintentar. La transición a `SUBMITTED` exige acuse persistido por el sistema oficial.

## 8. Modelo de datos mínimo propuesto

Entidades internas:

- `identity_links`: clave sustituta local, `provider`, `issuer`, `subject`, referencia al aspirante SIGIES, marca de verificación; nunca tokens de acceso persistentes sin necesidad.
- `application_drafts`: UUID, `aspirant_ref`, `call_ref`, `version`, `status`, timestamps y fecha límite.
- `draft_preferences`: ID de borrador, posición 1–10, `offer_option_ref`; unicidad por posición y opción dentro de cada borrador.
- `application_submissions`: idempotency key, request hash, correlación SIGIES, estado de sincronización, folio y fecha de aceptación.
- `application_versions`: instantánea protegida de modificaciones autorizadas y su motivo.
- `audit_events`: actor, acción, recurso, resultado, fecha/hora, correlation ID y origen minimizado.
- `support_cases`: incidencias, responsables, estados y resoluciones.

Índices: unicidad de `issuer + subject`; unicidad de `aspirant_ref + convocatoria` según reglas; `idempotency_key` única por operación; `draft_id + position`, `draft_id + offer_option_ref`.

No introducir registro maestro local de alumnos ni tabla editable de plazas oficiales.

## 9. Estructura sugerida del repositorio

```text
portal-aspirante/
├── README.md
├── LICENSE                     # definir con la institución
├── .editorconfig
├── .gitignore
├── .env.example
├── package.json                # workspaces + scripts
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── apps/
│   ├── web/                    # Next.js, interfaz estudiante y BFF
│   └── api/                    # NestJS API de ingreso
├── packages/
│   ├── contracts/              # OpenAPI, DTOs y Zod schemas
│   ├── ui/                     # componentes accesibles reutilizables
│   ├── config/                 # ESLint, TypeScript, convenciones
│   └── test-fixtures/          # datos sintéticos, nunca estudiantes reales
├── integrations/
│   ├── datys/                  # cliente/autenticación + simulador
│   └── sigies/                 # cliente + adaptador + simulador
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── infra/
│   ├── nginx/
│   ├── systemd/
│   ├── ansible/
│   └── observability/
├── docs/
│   ├── architecture/
│   ├── adr/
│   ├── api/
│   ├── security/
│   ├── operations/
│   └── legal/
├── tests/
│   ├── e2e/
│   ├── integration/
│   └── contracts/
└── scripts/
    ├── bootstrap.sh
    ├── deploy.sh
    └── backup.sh
```

## 10. Preparación del repositorio

Nombre sugerido: **`portal-aspirante-mes`**. Descripción: *Portal web de solicitud digital de carreras para el ingreso a la Educación Superior cubana, integrado con DATYS y SIGIES*.

Requisitos del equipo: Git; Node.js LTS fijado en `.nvmrc`; pnpm con Corepack; PostgreSQL; Redis opcional en desarrollo; acceso a un ambiente de pruebas de DATYS/SIGIES o simuladores. No subir credenciales reales.

```bash
mkdir portal-aspirante-mes && cd portal-aspirante-mes
git init
corepack enable
# Crear monorepo y apps siguiendo la estructura acordada.
# Los comandos de scaffolding y versiones deben fijarse al iniciar el proyecto.
```

### Scripts estándar esperados

`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm db:migrate`.

### Variables de entorno ilustrativas

```dotenv
NODE_ENV=development
WEB_BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:4000
DATABASE_URL=postgresql://portal:CHANGE_ME@localhost:5432/portal_aspirante
REDIS_URL=redis://localhost:6379
SESSION_SECRET=CHANGE_ME_LONG_RANDOM_SECRET
DATYS_MODE=mock
DATYS_ISSUER_URL=
DATYS_CLIENT_ID=
DATYS_CLIENT_SECRET=
DATYS_REDIRECT_URI=http://localhost:3000/auth/callback
SIGIES_MODE=mock
SIGIES_BASE_URL=
SIGIES_CLIENT_ID=
SIGIES_CLIENT_SECRET=
```

El equipo debe ajustar estas variables al contrato real de los servicios externos. Usar almacén institucional de secretos en producción; no usar `.env` versionado.

## 11. Seguridad obligatoria

- Autenticación siguiendo **RFC 9700**, y especificación OIDC verificada si DATYS la ofrece.
- Validar JWT y tokens en el servidor, claves JWKS, issuer, audience, nonce, expiración y reloj.
- Cookies `Secure`, `HttpOnly`, `SameSite`; rotación y revocación de sesión; CSRF.
- Prohibir enumeración de aspirantes mediante endpoints públicos.
- Revalidar elegibilidad y catálogo **al confirmar**, no solo al iniciar sesión.
- Rate limiting por cuenta/sesión y controles antiabuso sin bloquear indiscriminadamente redes compartidas.
- Autorización por recurso: un estudiante jamás debe leer boletas ajenas.
- Idempotencia, firma/hash del comprobante, registro auditable y marca temporal.
- HTTPS/TLS, encabezados seguros y mitigación OWASP Top 10/ASVS.
- Gestión formal de incidentes y canales alternativos ante indisponibilidad.
- Minimización y retención de datos: políticas aprobadas por área jurídica y propietarios de datos.
- Pruebas de seguridad antes del piloto; pentest antes de despliegue nacional.

## 12. Despliegue recomendado sin contenedores

- Ubuntu Server 24.04 LTS sobre VM institucional.
- Node.js LTS, Nginx frontal, HAProxy si ya está en la capa de publicación.
- PostgreSQL en instancia administrada o VM con backup y restauración probada.
- Redis cuando se justifique; protegido en red privada.
- Procesos `portal-web.service` y `portal-api.service` con systemd, usuario sin privilegios, sandboxing y reinicio controlado.
- `certbot`/PKI institucional y TLS actualizado; separar ambientes `dev`, `stage`, `prod`.
- Logs centralizados (Loki), paneles Grafana, alarmas, comprobación de salud y métricas de errores.
- Copias de seguridad cifradas y pruebas de restauración; mantenimiento con plan de rollback.

## 13. Plan de ejecución

**Fase 0 — Validación:** acuerdos MES/MINED/DATYS/UCI; requisitos legales y de menores; disponibilidad de API/SDK, esquema de datos y plazos oficiales. **Entregables:** contratos y decisiones de arquitectura (ADR).

**Fase 1 — Integraciones PoC:** login DATYS en sandbox, consulta de elegibilidad SIGIES, catálogos; mocks cuando no exista ambiente. **Entregables:** pruebas de contrato y riesgos resueltos.

**Fase 2 — MVP:** pantalla móvil, borradores, diez preferencias, confirmación, registro idempotente, PDF y auditoría. **Entregables:** flujo E2E demostrado.

**Fase 3 — Piloto territorial:** pruebas en una muestra de preuniversitarios, conectividad real, asistencia a estudiantes sin identidad digital, soporte y métricas. **Entregables:** informe de piloto y ajustes.

**Fase 4 — Producción:** hardening, pruebas de carga, penetración, DR, formación, monitoreo y despliegue gradual.

## 14. Criterios de aceptación del MVP

- [ ] Identidad autenticada con DATYS (o simulador solo en desarrollo), sin datos biométricos en portal.
- [ ] Elegibilidad confirmada por SIGIES; errores tratados sin autorizar acceso indebido.
- [ ] Catálogo filtrado por aspirante y convocatoria.
- [ ] Hasta diez opciones válidas, priorizadas y sin duplicados.
- [ ] Borrador persistente y seguro.
- [ ] Confirmación expresa, revalidación y `Idempotency-Key`.
- [ ] El portal no muestra «presentada» sin acuse oficial de SIGIES.
- [ ] Comprobante PDF verificable con mínimo de datos.
- [ ] Historial de cambios y control de cierres de convocatoria.
- [ ] Vía asistida, proceso de reclamación y soporte definidos.
- [ ] Pruebas unitarias, de integración, E2E, carga y seguridad.
- [ ] Funcionamiento comprobado con conectividad limitada.

## 15. Cuestiones abiertas

**DATYS:** ¿OIDC? ¿atributos certificados? ¿estudiantes menores? ¿autorización de terceros? ¿sandbox? ¿SLA? ¿recuperación de identidad? ¿acceso gratuito de datos móviles?

**SIGIES:** ¿API existente? ¿registro actual de boletas? ¿escalafones? ¿reglas de validación, plazos, vías especiales y reconciliación? ¿modo transaccional? ¿identificadores y comprobantes? ¿replicación provincial?

**MINED/MES:** ¿fuente oficial del estudiante? ¿quién autoriza rectificaciones? ¿cuántas preferencias exige cada convocatoria? ¿normativa de confirmación? ¿validez jurídica, plazos y soporte?

## 16. Referencias

- Contexto SIGIES/funcionalidades: [Granma, 16 de mayo de 2023](https://www.granma.cu/doble-click/2023-05-16/la-informatizacion-del-ingreso-a-la-educacion-superior-aporta-mayor-transparencia-16-05-2023-21-05-11).
- Seguridad OAuth: [RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html).
- [Next.js](https://nextjs.org/docs), [NestJS](https://docs.nestjs.com/), [PostgreSQL](https://www.postgresql.org/docs/), [Prisma](https://www.prisma.io/docs/).
- El marco normativo cubano y contratos de integración deben verificarse con los órganos competentes antes de producción.

## 17. Gobierno del repositorio

- Rama principal protegida (`main`); ramas por funcionalidad y PR obligatoria.
- `CODEOWNERS` por módulos críticos (`auth`, `sigies`, `security`).
- No permitir merges sin CI y revisión técnica.
- Commits convencionales y ADR para decisiones de seguridad/arquitectura.
- Datos de prueba 100 % sintéticos; secretos y credenciales gestionados fuera del repositorio.
- Licencia y visibilidad pública/privada definidas por el MES antes de publicar.

---

**Próximo hito:** ejecutar dos pruebas de concepto *antes* de desarrollar el formulario definitivo: (1) autenticación de un aspirante con DATYS y (2) consulta/registro de una boleta sintética en SIGIES.
