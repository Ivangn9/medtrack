# Changelog — MedTrack

## v1.3.0 — 10/07/2026 (minor)

- Amplía el catálogo de partes de RM: GPA, PDU, Host Computer, RSP, Digital Receiver, Gradient Driver/Interface, interfaces de mesa y bobinas, UPS, filtros de línea, interconexión con chiller y módulo ICE

## v1.2.3 — 09/07/2026 (patch)

- Previene pérdida de PDFs: solicita almacenamiento persistente al SO, avisa si la subida a la nube falla, y reintenta también al ocultar la app

## v1.2.2 — 08/07/2026 (patch)

- Botón para forzar la sincronización de archivos pendientes de este dispositivo y mensaje de error más claro cuando un PDF no llegó a la nube

## v1.2.1 — 08/07/2026 (patch)

- Informe de Antenas: emoji semáforo junto al nombre para antenas con fallas/fuera de servicio — más robusto que solo color de texto en PDFs exportados desde iOS

## v1.2.0 — 08/07/2026 (minor)

- Contador de reparaciones editable para antenas (previas al sistema + automáticas) y color de estado visible en el Informe de Antenas

## v1.1.2 — 08/07/2026 (patch)

- Corrige pérdida silenciosa de datos: un dispositivo con copia vieja en memoria ya no sobrescribe cambios más recientes guardados desde otro dispositivo

## v1.1.1 — 07/07/2026 (patch)

- Informe de Antenas: parser de fechas robusto (corrige antenas >8 años no contadas), diferencia origen de compra vs resonador actual, y antenas sin equipo vinculado separadas + herramienta de limpieza en Ajustes

## v1.1.0 — 07/07/2026 (minor)

- Nuevo Informe de Antenas: estado, origen y antigüedad de cada antena RF con estadísticas de vida útil

## v1.0.0 — 06/07/2026 (major)

- Reset de versionado a SemVer — punto de partida comercial (versión interna previa: 8.19.2)
- Historiales en documentos separados (sharding) con backup automático pre-migración
- Vista pública QR segura: solo datos no sensibles + contador de días sin incidentes
- Modo offline con sincronización automática al reconectar
- Búsqueda global (⌘K), deshacer al eliminar y panel Mi día
- Rediseño Liquid Glass: fondo con grano, tintes por sección, header colapsable, parallax de modales
- Estado RM integrado al design system (modo claro/oscuro)
- Íconos SVG en acciones y Ajustes, 2 columnas en iPad, pull-to-refresh
- Tests de humo y monitoreo de tamaño de base de datos
