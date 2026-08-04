# Changelog — MedTrack

## v4.4.1 — 04/08/2026 (patch)

- Pulido: transiciones CSS explícitas en vez de transition:all en 15 sitios (mejor rendimiento, menos repintados)
- Reducir movimiento del sistema ya no corta el feedback de color en tabs/pills, solo el movimiento
- Cierre de modales/panel/sidebar bajo reducir-movimiento ahora usa fade corto en vez de deslizamiento
- Los submenús flotantes del sidebar ahora nacen desde el botón que los abre, no desde el centro
- Toast y submenús flotantes ahora cierran con una transición de salida breve en vez de golpe seco
- Feedback táctil (:active) agregado a filas .tap que no lo tenían
- Curvas de animación duplicadas del splash consolidadas al token --spring existente
- Duraciones de animaciones de alta frecuencia (tarjetas, navegación, listas, ajustes) recortadas a <300ms
- Contraste de texto de advertencia (#b45309) corregido en modo oscuro en 8 pantallas
- Toast ahora respeta max-width en mensajes largos en vez de desbordar
- Cantidad y stock mínimo de repuestos ahora se clampean a >=0 al guardar, igual que al ajustar stock
- Crear una categoría con un grupo nuevo cuyo nombre ya existe reutiliza el grupo en vez de duplicarlo
- z-index de los submenús flotantes bajado por debajo del de los modales, evita solapamientos raros

## v4.4.0 — 04/08/2026 (patch)

- Fix medio: el Informe Gerencial en PDF ahora incluye garantía, contrato de servicio, seguro, R.U.GE.PRE.SA, parches/batería de desfibrilador y estado de chiller/helio de RM cuando están vencidos o próximos a vencer — antes podían faltar en el PDF pese a estar en rojo en la app
- Fix medio: una OT reabierta ya no muestra 'Cerrada: fecha vieja', y el editor genérico de OT ya no permite pasar a 'Cerrada' sin pasar por el flujo real de cierre (resolución + firma)
- Fix medio: mantenimiento mensual/trimestral registrado en día 29-31 ya no salta el próximo vencimiento a principios del mes siguiente cuando cruza un mes corto
- Fix medio: los grupos de categorías personalizadas (creados con + Crear nuevo grupo) ahora se pueden editar y borrar desde Ajustes → Categorías Personalizadas
- Fix medio: flecha 'Volver' invisible en modo claro en varias pantallas, botón + Nueva categoría no seguía el modo oscuro, nombre de categoría sin límite de caracteres, animaciones del Esquema UPS sin pausarse fuera de pantalla, buscador ⌘K con animación completa de modal, y contador animado del Panel sin respetar reducir movimiento

## v4.3.9 — 04/08/2026 (patch)

- Fix alto: timeout de resguardo en checkAccess() (podía trabar el login de toda la app), en el primer snapshot de Firestore tras el login, y de forma central en _storageGetUrl()/_storageSaveB64() (protege visor de PDF, galerías de fotos, subida de archivos y todos los demás llamadores)
- Fix alto: 28 usos de confirm()/prompt() nativo reemplazados por el modal de confirmación propio de la app en toda la app (equipos, OTs, repuestos, reclamos, mejoras, documentos, antenas, transductores, presupuestos, reportes, restaurar backup, etc.) — el diálogo nativo puede quedar bloqueado en silencio tras varios usos seguidos
- Fix alto: las migraciones (Bombas, mejoras) ya se re-ejecutan también cuando este dispositivo detecta que guardó con datos atrasados, no solo en la sincronización en tiempo real de otro dispositivo
- Fix alto: los vencimientos de mantenimiento comparaban fecha UTC contra hora local — en Argentina (UTC-3) podían marcar "vencido" hasta 3 horas antes de tiempo, en todas las categorías
- Fix alto: un equipo con mantenimiento requerido pero sin fecha de vencimiento configurada ya no queda mostrado como operativo (verde) para siempre

## v4.3.8 — 04/08/2026 (patch)

- Fix crítico: borrar un equipo o transductor "semilla" y recargar la app entera lo hacía reaparecer con datos de fábrica (las migraciones reinsertaban cualquier id faltante sin importar el motivo) — ahora solo siembran datos en una instalación realmente vacía, nunca reinsertan un ítem borrado a propósito
- Fix crítico: un guardado con datos locales atrasados (conflicto detectado al intentar guardar) aplicaba los datos del servidor sin volver a correr las migraciones — mismo bug de "Bombas desaparecen" ya arreglado en el otro camino de sincronización, ahora cubierto acá también
- Fix crítico: el historial de mantenimiento (shards) se escribía a la nube sin esperar a confirmar que el guardado principal no estaba atrasado — dos dispositivos guardando casi al mismo tiempo podían pisarse el historial
- Fix crítico: subir una foto/PDF podía quedar referenciado en la nube antes de garantizar que se guardó en el dispositivo — si la app se cerraba de golpe en el medio, el archivo se perdía para siempre sin aviso (10 puntos del código corregidos)

## v4.3.7 — 04/08/2026 (patch)

- Fix: la foto de categoría podía quedar 'cargando' para siempre sin terminar nunca (ni error ni éxito) — el método de respaldo (imagen+canvas) no tenía límite de tiempo y podía colgarse en ciertos WebViews; ahora la foto se muestra apenas se consigue el link (sin depender de ese paso) y la mejora a base64 corre en paralelo sin bloquear nada, con topes de tiempo en cada paso

## v4.3.6 — 03/08/2026 (patch)

- Fix: la foto de una categoría personalizada no llegaba a otros dispositivos con código 'network-error' — el fetch por XHR a Firebase Storage puede fallar por CORS/red en ciertos entornos (confirmado en la app nativa de iPhone) aunque el archivo exista; ahora cae a un método alternativo (imagen + canvas, o la URL directa como último recurso) en vez de perder la foto en silencio

## v4.3.5 — 03/08/2026 (patch)

- Fix: la foto de categoría se guardaba con un formato de ID distinto al resto de la app (IMG-CAT- en vez de IMG-<timestamp>-<random>), probablemente rechazado por las reglas de seguridad de Storage — ahora usa el mismo formato, y volver a subir la foto de una categoría ya creada genera un ID nuevo y correcto
- Diagnóstico: 'Categorías Personalizadas' en Ajustes ahora muestra si la foto de una categoría no pudo descargarse en este dispositivo (con el código de error) y un botón para reintentar

## v4.3.4 — 03/08/2026 (patch)

- Fix: la foto de una categoría personalizada no aparecía en otros dispositivos (ej. creada en Mac, no se veía en iPhone) — era una carrera de tiempos: el otro dispositivo la buscaba una sola vez apenas veía la categoría nueva, antes de que terminara de subirse a la nube; ahora reintenta durante un rato en vez de perderla en silencio

## v4.3.3 — 03/08/2026 (patch)

- Fix: el botón 'Eliminar categoría' no hacía nada — usaba el diálogo confirm() nativo del navegador, que puede quedar bloqueado en silencio tras varios clics seguidos (protección anti-spam del propio WebView); ahora usa el modal de confirmación propio de la app
- Fix: crear un grupo nuevo de subcategorías usaba prompt() nativo (mismo riesgo, nunca antes usado en la app) — ahora es un campo de texto normal dentro del formulario

## v4.3.2 — 03/08/2026 (patch)

- Fix: el botón 'Eliminar categoría' no avisaba de forma visible por qué no borraba (bloqueo por equipos/subcategorías solo se veía en un toast fácil de pasar por alto) — ahora el motivo se muestra directo en el formulario, antes de tocar nada

## v4.3.1 — 03/08/2026 (patch)

- Fix: guardado que quedaba trabado reintentando para siempre (timeout repetido — síntoma de caché offline de Firestore inconsistente) ahora se autorepara sola, y hay un botón 'Reparar conexión con la nube' en Ajustes para forzarlo al instante

## v4.3.0 — 03/08/2026 (minor)

- Categorías personalizadas: la foto ahora preserva transparencia (antes salía con fondo negro por la compresión a JPEG)
- Categorías personalizadas: las categorías nuevas aparecen en el Panel apenas se crean, sin esperar a cargar el primer equipo
- Categorías personalizadas: nueva sección en Ajustes para editar, borrar (solo si no tiene equipos) y configurar componentes de las categorías creadas

## v4.2.0 — 03/08/2026 (minor)

- Categorías personalizadas: crear categorías nuevas desde el Panel, con subcategorías agrupadas, foto propia (funciona también en el PDF exportado, no solo en pantalla), y control de vencimientos de mantenimiento igual que el resto de las categorías
- Catálogo de componentes sugeridos y configuración de mantenimiento ya funcionan automáticamente para las categorías nuevas, sin pasos extra

## v4.1.0 — 03/08/2026 (minor)

- Aires Acondicionados: ahora tienen frecuencia de service y fecha de próximo vencimiento (igual que el resto de los equipos) — antes no había forma de controlar cada cuánto tiempo correspondía el service
- Aires con service vencido/próximo a vencer o con falla ahora aparecen en Alertas, con navegación directa al detalle del aire
- La tarjeta de Aires en el Panel ahora refleja fallas Y vencimientos de service (antes solo fallas), y el anillo de alerta se activa cuando corresponde
- Detalle de un aire: muestra frecuencia configurada y próximo vencimiento, con aviso destacado si está vencido o próximo

## v4.0.3 — 03/08/2026 (patch)

- Rendimiento: el anillo animado de las tarjetas de categoría (Panel) ahora se pausa cuando la tarjeta no está visible en pantalla — antes todas animaban a la vez sin importar cuántas hubiera, sumando costo de GPU real en equipos con GPU más chica (mismo tipo de problema que ya se había corregido antes con el grano de ruido feTurbulence)

## v4.0.2 — 03/08/2026 (patch)

- Diagnóstico temporal (gateado por #debugperf, invisible en uso normal): overlay midiendo duración de render() y tiempo de carga inicial, para investigar el reporte de lentitud general en iPhone con datos reales en vez de adivinar

## v4.0.1 — 03/08/2026 (patch)

- iOS: el header ahora colapsa de verdad al hacer scroll (logo, avatar, badge de alertas se achican; el chip de % Operativos/versión se oculta) — antes solo se reducía un poco el padding y todo seguía mostrándose igual
- Chip de % Operativos/versión reducido de tamaño en iPhone incluso sin scrollear, para que el header no quede tan largo

## v4.0.0 — 03/08/2026 (patch)

- Panel: el anillo de alerta de categorías con equipos fuera de servicio ahora sí se distingue (giraba idéntico a una categoría sana pese a tener la clase .cring-alert aplicada) — ahora gira más rápido y en rojo de alerta
- Estado de RM: las animaciones del dibujo (ventiladores, burbujas de helio, LEDs) ahora respetan 'reducir movimiento' del sistema — antes solo las animaciones CSS lo respetaban, no las SMIL del SVG
- Esquema UPS: los equipos fuera de servicio colgados de una UPS ahora tienen un pulso de alerta sutil en el borde, para detectarlos sin tener que leer cada tarjeta

## v3.10.9 — 03/08/2026 (patch)

- Pantalla de arranque: el anillo del logo Gantry se arma arco por arco (mismos 3 tonos del ícono real), en vez del logo ancho de CIMA con fade simple — termina en el logo real de la marca, no en una versión genérica

## v3.10.8 — 03/08/2026 (patch)

- Ícono de la app reemplazado: nuevo diseño Gantry (anillo de gantry de resonador, sin la sobrecarga del ícono genérico anterior) — se ve en la instalación PWA de Android/Windows/Mac/iPhone

## v3.10.7 — 31/07/2026 (patch)

- Fix: Asistente IA y escáner con cámara no funcionaban en la app nativa instalada (Tauri) — el proxy de Cloudflare se guardaba en localStorage por dispositivo/app, que no se comparte entre Safari/PWA y la app instalada. Ahora la URL del Worker queda fija en el código como valor por defecto (Ajustes la puede seguir pisando si hiciera falta apuntar a otro Worker en el futuro).

## v3.10.6 — 31/07/2026 (patch)

- Ajustes de pulido Apple-style: el botón flotante del Asistente IA (80px) ya no queda tapando permanentemente el final del contenido en ninguna vista (padding-bottom del área scrolleable ahora cubre toda su zona de alcance)
- La fila de sedes (Todas/Pedernera/CRS/GN) ahora muestra un degradado sutil en el borde derecho en mobile, sugiriendo que hay más chips para deslizar

## v3.10.5 — 31/07/2026 (patch)

- Fix real: al calc() de safe-area-inset le faltaba un espacio antes del '+' (calc(var(...)+12px) en vez de calc(var(...) + 12px)) — WebKit invalida el calc() completo sin ese espacio, por eso el logo seguía tapado por el notch pese a que el valor del inset llegaba bien. Se saca también el overlay de diagnóstico temporal.

## v3.10.4 — 31/07/2026 (patch)

- Diagnóstico temporal (mejora): overlay de debug ahora apila resultados en vez de superponerlos, agrega padding-top computado del header

## v3.10.3 — 31/07/2026 (patch)

- Diagnóstico temporal (gateado por #debugsafearea, invisible en uso normal): overlay para depurar por qué tauri-plugin-safe-area-insets-css no está aplicando el inset del notch

## v3.10.2 — 31/07/2026 (patch)

- Fix: puente con tauri-plugin-safe-area-insets-css para que el logo/reloj no queden tapados por el notch en la app nativa de iOS — WKWebView embebido no siempre reporta bien env(safe-area-inset-top/bottom); ahora se usan variables CSS reales con fallback a env() para Safari/PWA/desktop (sin cambios ahí)

## v3.10.1 — 31/07/2026 (patch)

- Fix: en pantallas angostas (iPhone 13 mini, 375pt) el chip de % Operativos empujaba los botones de búsqueda/perfil fuera de la pantalla — ahora baja a su propia fila en mobile, sin recortar nada

## v3.10.0 — 30/07/2026 (patch)

- Fix: la vista previa del informe gerencial ahora usa el mismo filtro que el PDF (_pdfIsImg) para las fotos de antenas/transductores/fallas — antes se veían bien en la vista previa pero se descartaban en silencio del PDF exportado
- Cada foto que el PDF no puede incluir ahora muestra un recuadro de aviso visible con el motivo (no se pudo descargar / formato no compatible), directamente en la vista previa
- Toast de resumen al generar el informe si alguna foto quedó fuera del PDF
- Versionado: PATCH nunca supera 9 — al llegar a 10 se resetea a 0 y sube MINOR (ej. 3.9.9 -> 3.10.0), para que la numeración quede siempre correlativa

## v3.9.11 — 30/07/2026 (patch)

- Fix: fotos HEIC de iPhone no se incrustaban en el PDF del reporte (pdfMake solo soporta JPEG/PNG)

## v3.9.10 — 30/07/2026 (patch)

- Reporte Gerencial: tarjetas/fotos ya no se cortan entre páginas, compresión automática de imágenes pesadas

## v3.9.9 — 30/07/2026 (patch)

- Agrega manifest.json para instalar la app en Android/Windows (Mac/iPhone ya funcionaban)

## v3.9.8 — 30/07/2026 (patch)

- Fix: los checkboxes de la lista de equipos en Reporte Gerencial no registraban el clic (contenedor .gc con animación de tap pensada para tarjetas, no para listas)

## v3.9.7 — 30/07/2026 (patch)

- Animaciones de salida simétricas para modal, Ajustes y drawer mobile (antes cerraban de golpe sin animación)

## v3.9.6 — 30/07/2026 (patch)

- Agrega login alternativo por contraseña vinculada a la cuenta (para apps instaladas donde Google no completa el redirect)

## v3.9.5 — 29/07/2026 (patch)

- Fix: login con Google no funcionaba en PWA instalada (Mac/Safari) — usa signInWithRedirect en ese caso

## v3.9.4 — 29/07/2026 (patch)

- Fix: el Asistente IA (chat) no mandaba el token de autenticación al proxy

## v3.9.3 — 29/07/2026 (patch)

- Aviso al cargar notas de PM (se muestran en el QR público) y arregla fallback roto en eq-public.html

## v3.9.2 — 29/07/2026 (patch)

- Fix de seguridad: escapa comillas simples en onclick (inyección de código vía nombres de archivo)

## v3.9.1 — 29/07/2026 (patch)

- Fix de seguridad: control de acceso real en reglas de Firestore + autenticación en el proxy de IA

## v3.9.0 — 28/07/2026 (minor)

- Reporte Gerencial: las fotos de fallas ya no desaparecen del PDF exportado, se agrega el icono de categoria por equipo, y se elimina la generacion de dos documentos identicos

## v3.8.1 — 28/07/2026 (patch)

- Fix: el ícono de categoría del equipo (RM, TC, ECO, etc.) no aparecía en Ficha de Equipo/Antena porque catSvgIcon() devuelve una foto real en base64 para la mayoría de las categorías, no un SVG vectorial — el generador de PDF asumía siempre SVG

## v3.8.0 — 27/07/2026 (minor)

- Reportes PDF: fotos reales de fallas/roturas en Ficha de Equipo y Ficha de Antena (antes sin fotos o solo contador), y unifica Reporte General / Reporte de Antenas con el logo y diseño compartido del resto de los informes

## v3.7.0 — 27/07/2026 (minor)

- Vista pública de QR: se agrega el Calendario PM del equipo (fechas, horarios y alcance de los mantenimientos programados)

## v3.6.2 — 16/07/2026 (patch)

- Fix: la migración de Bombas también se re-aplica al recibir datos en tiempo real de otro dispositivo, no solo al cargar la página

## v3.6.1 — 16/07/2026 (patch)

- Fix: migración de Bombas a subcategorías ahora se autocorrige si un dispositivo desactualizado revierte la categoría, en vez de depender solo de un flag de 'ya migrado una vez'

## v3.6.0 — 16/07/2026 (minor)

- Panel: Bombas vuelve a ser una sola tarjeta con drill-down a las subcategorías

## v3.5.0 — 16/07/2026 (minor)

- Fotos reales de Bombas de Contraste/Infusión y migración de bombas existentes

## v3.4.0 — 16/07/2026 (minor)

- Agrega subcategorías Bombas de Contraste y Bombas de Infusión

## v3.3.2 — 16/07/2026 (patch)

- Oculta el menú Ejecutivo de la navegación

## v3.3.1 — 16/07/2026 (patch)

- Sync: más tolerancia al timeout inicial y mensaje que no alarma durante el reintento automático

## v3.3.0 — 16/07/2026 (minor)

- Dar de baja permite destildar transductores y trasladarlos a otro ecógrafo

## v3.2.0 — 16/07/2026 (minor)

- Baja de equipo en cascada a transductores + motivo entrega de pago + reporte gerencial

## v3.1.0 — 15/07/2026 (minor)

- Registrar rotura de transductor ahora actualiza el estado del transductor

## v3.0.0 — 15/07/2026 (major)

- Corrige backup horario roto (dependía de antenas) y falta de auditoría al crear equipos

## v2.0.0 — 15/07/2026 (major)

- Corrige causa raíz de pérdida de datos: guardado pendiente ya no se pisa con snapshots remotos

## v1.13.2 — 14/07/2026 (patch)

- Fallas: separa Historial de Roturas y Fallas (estaban anidados) y agrega anillo animado azul

## v1.13.1 — 14/07/2026 (patch)

- Informe de Marcas: corrige espaciado del título del equipo y borde de tabla

## v1.13.0 — 14/07/2026 (minor)

- Catálogo de componentes editable desde Ajustes por modalidad de equipo

## v1.12.0 — 14/07/2026 (minor)

- Permite cargar varios componentes afectados en una misma falla

## v1.11.0 — 14/07/2026 (minor)

- Informe de Marcas: espaciado corregido en PDF y selección de fallas a incluir

## v1.10.1 — 14/07/2026 (patch)

- Agrega RF Cable y DC Cable a componentes de RM

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
