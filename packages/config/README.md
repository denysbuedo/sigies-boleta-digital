# @sigies/config

Este paquete alojará configuraciones compartidas del monorepo (TypeScript, ESLint, reglas comunes).

**Decisión técnica:** Para asegurar estabilidad e independencia en el arranque, `apps/web` y `apps/api` inician con sus configuraciones desacopladas y se consolidarán aquí conforme crezca el sistema.