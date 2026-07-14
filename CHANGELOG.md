# Changelog — MedTrack

## v1.10.0 — 14/07/2026 (minor)

- Buscador global encuentra fallas y reparaciones históricas; fin del freezing al tipear

## v1.9.1 — 14/07/2026 (patch)

- Corrige falso conflicto de guardado entre ediciones rápidas del mismo dispositivo

## v1.9.0 — 14/07/2026 (minor)

- Sistema de guardado autorregenerativo: nunca más queda trabado en Error

## v1.8.5 — 14/07/2026 (patch)

- Corrige ruta del logo Medrad tras recorte y renombre en GitHub

## v1.8.4 — 14/07/2026 (patch)

- Agrega Medrad a la lista de marcas del formulario de equipo

## v1.8.3 — 14/07/2026 (patch)

- Agrega logo de marca MEDRAD

## v1.8.2 — 13/07/2026 (patch)

- Calendario de PM: celdas más legibles con auto-scroll para días con muchos eventos

## v1.8.1 — 13/07/2026 (patch)

- Blower Box de RM dividido en enfriamiento de túnel y enfriamiento electrónico (PEN/SPW)

## v1.8.0 — 13/07/2026 (minor)

- Monitoreo de Sala de Máquinas en Refrigeración: carga manual de temperatura/humedad de sala, agua de chiller y helio, con timeline independiente por variable y filtro de rango. Amplía catálogo de partes de RM con gradientes internos, refrigeración líquida y ventilación del túnel

## v1.7.0 — 13/07/2026 (minor)

- Nueva función 'Mover a otro equipo' en el detalle de antena — mueve la antena entre resonadores preservando 100% del historial (roturas, reparaciones, PDFs)

## v1.6.2 — 10/07/2026 (patch)

- Informe de Marcas: ahora incluye roturas activas de transductores y antenas vinculados, no solo fallas directas del equipo

## v1.6.1 — 10/07/2026 (patch)

- Fix crítico: FS2 rompía la subida de PDFs — la base IndexedDB compartida subió de versión sin coordinar con el store viejo, causando VersionError en cada guardado

## v1.6.0 — 10/07/2026 (minor)

- Nueva capa de almacenamiento de archivos con Blob nativo en IndexedDB (FS2), en paralelo al store existente — migración no destructiva con backup automático y verificación de integridad

## v1.5.3 — 10/07/2026 (patch)

- Calendario de PM: la semana empieza en lunes

## v1.5.2 — 10/07/2026 (patch)

- Reemplaza runTransaction por get()+set() simple: las transacciones de Firestore pueden colgarse reintentando internamente por contención, mucho más allá de cualquier timeout externo

## v1.5.1 — 10/07/2026 (patch)

- Corrige indicador 'Guardando...' colgado indefinidamente: timeout de seguridad de 15s si la transacción de Firestore no responde

## v1.5.0 — 10/07/2026 (minor)

- Datos de red por equipo (MAC Address para todas las categorías) + importador masivo desde Excel/TSV con matching por SystemID o nombre

## v1.4.7 — 10/07/2026 (patch)

- Rediseño Liquid Glass de botones táctiles (lote 8, final): empresas representantes, control de acceso, restablecer fuente

## v1.4.6 — 10/07/2026 (patch)

- Rediseño Liquid Glass de botones táctiles (lote 7): historial de mantenimiento, limpiar firma, imágenes de OT, filtro de panel, empresas representantes

## v1.4.5 — 10/07/2026 (patch)

- Rediseño Liquid Glass de botones táctiles (lote 6): estado antena/transductor, refrigeración, gráfico helio, seguimiento de reparación

## v1.4.4 — 10/07/2026 (patch)

- Rediseño Liquid Glass de botones táctiles (lote 5): cerrar OT, auditoría, alertas

## v1.4.3 — 10/07/2026 (patch)

- Rediseño Liquid Glass de botones táctiles (lote 4): panel de reporte PDF, imprimir QR, formulario de falla/rotura

## v1.4.2 — 10/07/2026 (patch)

- Rediseño Liquid Glass de botones táctiles (lote 3): reclamos, mejoras

## v1.4.1 — 10/07/2026 (patch)

- Rediseño Liquid Glass de botones táctiles (lote 2, parcial): transductor, aire acondicionado, calendario PM, órdenes de trabajo, repuestos

## v1.4.0 — 10/07/2026 (minor)

- Rediseño Liquid Glass de botones táctiles (lote 1/2): detalle de antena, detalle de equipo, fallas, componentes

## v1.3.2 — 10/07/2026 (patch)

- Botones Ver/Editar/Eliminar del historial de reparaciones: más grandes (44px+), estilo Liquid Glass, con más espacio entre ellos para evitar clics accidentales

## v1.3.1 — 10/07/2026 (patch)

- El % de equipos operativos (header, Panel y Ejecutivo) ya no cuenta UPS ni Desfibriladores

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
