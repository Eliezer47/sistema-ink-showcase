# Plan de presentación y publicación de la demo

Estado: fases 1 a 4 completadas el 13/09/2026. Fase 5 en curso: demo publicada y verificada en Hostinger; enlace desde WordPress pendiente por la autenticación adicional de su editor. Fase 6 pendiente. La revisión de límites públicos de la fase 0 se mantiene como condición de cada cambio y publicación.

## Objetivo

Publicar la demo de InkGestión en el hosting Business existente, con información mínima y acceso inmediato al sistema. WordPress conserva la presentación comercial y dirige al visitante a la demo mediante un enlace.

El diseño debe reducir el contenido exterior a la aplicación, preservando las pantallas, controles y datos necesarios para comprender el sistema. La simplificación de la página no debe eliminar módulos ni alterar los comportamientos ya contrastados con la versión 1.10.3.

## Condición transversal — Proteger la implementación comercial

La fidelidad se refiere a lo que el prospecto ve y experimenta. El código de la demo debe ser una implementación independiente, limitada a presentación, datos sintéticos y cambios de estado ilustrativos. No debe traducir, portar ni reproducir la organización interna del sistema comercial.

| Se puede mostrar | Debe permanecer fuera de la web pública |
| --- | --- |
| Pantallas, nombres de módulos y acciones comprensibles para el usuario | Arquitectura de servicios, nombres internos de clases, contratos o procedimientos |
| Registros ficticios y estados visibles de un pedido de ejemplo | Entidades, esquemas, relaciones de base de datos, modelos de persistencia o cargas reales de API |
| Totales y cambios ilustrativos necesarios para entender el recorrido | Algoritmos propietarios de costeo, asignación, conciliación, autorización o transacciones |
| Resultados preparados y aritmética sencilla creada para la demo | Una traducción a JavaScript del motor comercial, aunque cambien los nombres o los datos |
| Ejemplos de documentos y perfiles de impresión | Controladores, protocolos internos, secretos, rutas privadas o configuraciones de instalaciones reales |

Cuando una función necesite reglas complejas para representarse, usar escenarios ficticios acotados o resultados preparados. No ampliar el simulador hasta convertirlo en una versión funcional del motor comercial. Evitar en los textos explicaciones sobre cómo se implementan las funciones; describir la acción y el resultado que reconoce el usuario.

Todo código enviado al navegador es inspeccionable. Minificar, ofuscar o quitar mapas de código fuente no vuelve secreta una implementación incluida en la página. Además, el repositorio es público: sus archivos, pruebas, documentos y commits también deben respetar este límite. Una interfaz pública puede ser imitada; no se promete impedir la copia de su apariencia o la inferencia de sus comportamientos visibles.

## Fase 0 — Revisar los límites de la demo pública

Antes del rediseño y de cada publicación, revisar el código del simulador, datos de muestra, textos, comentarios, pruebas, documentación y paquete compilado. Confirmar que su estructura fue creada para la demostración y no corresponde a la implementación del producto, incluso si no contiene archivos comerciales originales.

Usar los controles automáticos para detectar conexiones, persistencia, artefactos comerciales y mapas de código fuente, acompañados de revisión manual de procedencia y contenido. Una búsqueda de palabras o extensiones no demuestra por sí sola la ausencia de lógica propietaria.

Entregable: revisión de contenido publicable y corrección de cualquier detalle que exponga implementación privada.

Criterio de cierre: el visitante puede conocer el uso del sistema, pero ni el repositorio ni los archivos descargados entregan su arquitectura, contratos, modelos de datos o algoritmos privados. Cualquier hallazgo se resuelve antes de publicar.

## Presentación acordada

- Encabezado compacto: identidad de InkGestión, distintivo «Demo» y un acceso de contacto.
- La aplicación aparece inmediatamente después del encabezado, sin una portada de gran altura.
- Controles principales: «Explorar pantallas», «Seguir un pedido» y selector de modo. Reinicio disponible durante el recorrido.
- Ayuda contextual bajo demanda. Un único aviso breve y visible: «Datos ficticios · Operaciones simuladas».
- Información ampliada sobre versión y alcance disponible en «Acerca de esta demo».
- Vistas de acceso, impresión y continuidad accesibles desde «Más vistas», sin un carrusel automático que compita con el sistema.
- Los párrafos de beneficios, explicaciones repetidas y bloques comerciales extensos se retiran de la página principal de la demo. La información comercial corresponde a WordPress.
- Se conserva el estilo reconocible del escritorio; se mejora el espacio disponible para usarlo.

Estructura propuesta: encabezado breve → controles del recorrido → sistema → pie discreto. En escritorio, el visitante debe ver los controles y el comienzo de la aplicación sin desplazarse primero por una presentación comercial.

## Fase 1 — Simplificar la página alrededor del sistema

Trabajar sobre la composición principal y sus estilos: sustituir la portada extensa por el encabezado compacto, eliminar la repetición de avisos y reorganizar los bloques complementarios como información bajo demanda.

Entregable: nueva presentación local con el sistema como elemento principal.

Criterio de cierre: el visitante reconoce que es una demo y empieza a explorar desde la primera pantalla; el contenido explicativo no ocupa más espacio que la interfaz que presenta.

### Cierre de la fase 1 — 13/09/2026

- Encabezado compacto con identidad, distintivo Demo, aviso «Datos ficticios · Operaciones simuladas» y contacto. Retirados de la composición principal la portada extensa y los bloques comerciales.
- Sistema y controles del recorrido visibles desde el inicio. En la revisión de escritorio de 1280 × 720, la ventana pasa de comenzar a 749 px a 165 px; la altura total de la página baja de 3689 px a 934 px.
- Versión, alcance y explicación del perfil reunidos en «Acerca de esta demo». Las seis vistas complementarias están en «Más vistas», con pestañas manuales sin avance automático.
- El pedido permanece montado al abrir información. Las ventanas cierran con Escape o su botón y devuelven el foco al acceso de origen. La guía contextual y las vistas previas existentes siguen disponibles.
- Encabezado y controles comprobados también a 390 × 844, sin desbordamiento horizontal de la página. La ventana del sistema conserva su desplazamiento independiente; la adaptación detallada de la exploración corresponde a la fase 2.
- Compilación TypeScript/Vite y 23 pruebas aprobadas. Revisión en navegador de las seis vistas, navegación de pestañas con teclado, cierre y recuperación del foco, guía y comprobante. Abrir y cerrar información conserva un abono ficticio de C$600 y su saldo de C$2,400. Sin errores ni avisos en la consola capturada.

Esta fase modifica la presentación y sus controles de ayuda. No incorpora implementación comercial ni amplía los cálculos o estados del simulador. Se conservan las barreras automáticas de conexiones, persistencia y contenido publicable, junto con la compilación sin mapas de código fuente. El cierre es local; la revisión general previa a publicar de la fase 3 sigue pendiente.

## Fase 2 — Ajustar la experiencia de exploración

Mantener el pedido compartido y los módulos existentes. Afinar la navegación, el tamaño del área de trabajo y la ubicación de Guía, Reiniciar y Más vistas. Habilitar una vista ampliada del sistema si mejora su uso sin perder navegación o acceso al cierre.

Conservar únicamente la lógica mínima e independiente necesaria para mostrar los estados visibles del ejemplo. No utilizar contratos ni modelos del producto como base del estado de la interfaz web.

En pantallas pequeñas, conservar el acceso a los controles y permitir desplazarse por la interfaz de escritorio de forma clara. Presentar esta adaptación como visualización de la demo, sin atribuir al producto una aplicación móvil.

Entregable: navegación coherente entre exploración libre, pedido interactivo y vistas complementarias.

Criterio de cierre: cambiar de módulo o de modo conserva correctamente el pedido; ayudas y ventanas se pueden cerrar con teclado; los controles principales son accesibles en móvil y escritorio.

### Cierre de la fase 2 — 13/09/2026

- Ventana ajustada al espacio disponible, con desplazamiento propio del menú y del contenido. En 1280 × 720 la página cabe en la altura del navegador; «Ampliar vista» aumenta el área del sistema de 508 a 605 px y conserva el pedido, el módulo y los controles.
- Guía, Más vistas, Ampliar y Reiniciar se agrupan junto a los controles del recorrido, fuera de la ventana que se desplaza horizontalmente. La barra permanece accesible al desplazar una vista con poca altura.
- Cuando el sistema no cabe a lo ancho, aparecen un selector de pantalla y flechas con límites de desplazamiento. Elegir un módulo acerca su área de trabajo; el selector respeta el modo Simple. Se conserva el escritorio del producto como referencia visual.
- La guía acerca su objetivo, recibe el foco al abrirse y permanece visible en pantallas pequeñas. Su botón de cierre queda por encima de la barra de controles. Escape cierra primero un diálogo abierto, después la guía y finalmente la vista ampliada. F3 no abre otra ventana sobre un diálogo existente.
- Volver de Explorar pantallas a Seguir un pedido retoma el módulo del recorrido cuando corresponde. Cambiar de Producción o Entregas a Simple lleva a Ventas sin modificar el pedido. Los pasos de preparación solicitados dentro del recorrido siguen disponibles.
- Comprobados escritorio 1280 × 720, móvil 390 × 844 y horizontal 844 × 390; acceso a los submenús de Administración y Catálogo, guía, vistas complementarias, F3, reinicio y cierre por teclado.
- Recorrido verificado en navegador: cotización, abono de C$600, transferencia pendiente de C$2,400, cambios entre experiencias y modos, ampliación y vistas complementarias sin pérdida de estado; verificación del cobro, preparación, entrega de cinco unidades, inventario 31 físicas / 7 reservadas / 24 disponibles, entrega restante en Simple y reinicio.
- Resultado final: compilación TypeScript/Vite y 23 pruebas aprobadas; sin errores ni avisos en la consola capturada. Verificado además el cierre con clic en horizontal y la ausencia de desplazamiento horizontal innecesario dentro de la guía.

La implementación del pedido y sus cálculos no se amplían en esta fase. Las modificaciones se limitan a navegación, presentación y accesibilidad de la demo independiente. La prueba de presentación comprueba que los controles principales estén fuera del área desplazable; se conservan los controles de publicación y las pruebas del pedido. La validación general de la versión destinada a Hostinger permanece en la fase 3.

## Fase 3 — Verificar y preparar la versión publicable

Actualizar las pruebas de presentación afectadas por la reducción del contenido. Mantener las comprobaciones de datos ficticios, ausencia de conexiones comerciales y comportamiento del pedido; no sustituirlas por comprobaciones que solo reflejen el nuevo texto.

Ejecutar `corepack pnpm test` y revisar visualmente tamaños representativos de escritorio y móvil. Probar abonos, transferencias pendientes, verificación, entrega parcial, modo Simple, inventario, F3, documentos, calculadora y reinicio.

Preparar únicamente el contenido compilado de `dist` para alojarlo como sitio estático. Node.js se utiliza para compilar; esta demo no necesita un proceso Node.js permanente en el servidor. Verificar rutas de imágenes y recursos en la ubicación elegida.

Inspeccionar también el contenido de los archivos compilados. Publicar solo recursos de ejecución, sin fuentes originales, mapas de código fuente, documentación interna o archivos de configuración privados. Aplicar igualmente la condición transversal a cualquier archivo que se sincronice con GitHub.

Entregable: compilación verificada y lista concreta de archivos que se publicarán.

Criterio de cierre: compilación y pruebas aprobadas, controles visibles y utilizables, sin errores funcionales o de recursos en el navegador.

### Cierre de la fase 3 — 13/09/2026

- Compilación TypeScript/Vite y 25 pruebas aprobadas. Dos pruebas nuevas sirven los archivos compilados en `/` y `/demo/`, comprueban sus bytes y tipos MIME, y verifican que fuentes y configuración del repositorio no estén disponibles.
- Comprobada en navegador la copia exacta preparada para publicación: escritorio de 1280 × 720 y móvil de 390 × 844, con recursos relativos cargados también desde una subcarpeta. Sin errores ni avisos en las consolas capturadas.
- Verificados abono, rechazo de sobrepago, transferencia pendiente y su verificación, producción, entrega parcial, inventario, F3, entrega restante en Simple, documentos, calculadora y reinicio. Comprobadas además búsqueda, ampliación, guía, las seis vistas complementarias y cierre por teclado.
- Preparada la versión `cc77d5640b79`: cinco archivos de ejecución, inventario SHA-256 y ZIP cuyo contenido coincide con el inventario. No se incluyen fuentes originales, mapas de código fuente, documentos ni configuración del repositorio en el paquete.
- Revisados los recursos compilados, las imágenes y los límites del simulador independiente. Esta fase no incorpora reglas ni implementación del producto comercial.
- Retirada de la etiqueta meta una directiva de incrustación que el navegador no aplicaba allí. La configuración y verificación de ese encabezado HTTP se registra como parte de la publicación en el alojamiento real.

El [informe de la versión publicable](version-publicable.md) contiene el inventario, la evidencia y los límites de esta verificación. El comando `corepack pnpm release:prepare` permite generar nuevas entregas después de pasar las pruebas. Esta entrega incluye cambios locales aún sin commit; sus archivos se identifican por sus hashes, no solo por el commit base. No se ha publicado en Hostinger.

## Fase 4 — Preparar Hostinger y el subdominio

Confirmar en hPanel el límite de sitios de la suscripción Business y los sitios ocupados. Definir el dominio real y el subdominio de destino; `demo.tudominio.com` es solo un ejemplo, no un dominio seleccionado.

Preferir un sitio personalizado PHP/HTML independiente para el subdominio si existe capacidad disponible. Si la suscripción no tiene cupo, evaluar primero una carpeta de demostración dentro del sitio existente y, cuando corresponda, un subdominio asociado a ella, antes de considerar ampliar el plan.

Identificar dónde se administra el DNS y qué directorio corresponde al destino. Configurar exclusivamente el destino de la demo y comprobar HTTPS. Si ya existen archivos en ese destino, revisarlos y respaldarlos antes de reemplazarlos.

Entregable: destino identificado, configurado y separado de los archivos de WordPress.

Criterio de cierre: el subdominio resuelve al destino correcto con HTTPS y el sitio WordPress sigue respondiendo normalmente.

### Cierre de la fase 4 — 13/09/2026

- El usuario identificó `www.inkmultiservicios.com` como su página WordPress. Su dirección final, `https://inkmultiservicios.com/`, responde con HTTP 200 y el título del sitio comercial, antes y después de crear el destino de la demo.
- hPanel confirma Business Web Hosting, vencimiento 20/08/2027 y capacidad de 50 sitios. Había 1 sitio; tras crear la demo, el panel muestra 2 de 50. No se contrató otro plan ni un dominio adicional.
- Creado `demo.inkmultiservicios.com` como sitio PHP/HTML independiente. Su panel y acceso de archivos corresponden exclusivamente a ese nombre. Plan Details indica `public_html` como ruta de carga dentro del sitio seleccionado; debe usarse el administrador específico de la demo al publicar.
- La dirección definitiva `https://demo.inkmultiservicios.com/` responde con HTTP 200 y la página predeterminada de Hostinger. El certificado válido corresponde al subdominio, hPanel muestra SSL `Active` y HTTP redirige a HTTPS con 301. La compilación de la demo no se ha subido.
- Los servidores autoritativos del dominio son `ns-cloud-c1.googledomains.com` a `ns-cloud-c4.googledomains.com`. El buscador oficial de Tucows confirmó **Shopify** como proveedor comercial del dominio; también se confirmó el acceso a esa cuenta y su edición DNS. El registro sigue en Tucows y hPanel muestra una transferencia hacia Hostinger iniciada el 10/09/2026, todavía en curso.
- Añadido el registro de la demo en Shopify, tras comprobar que no existía. Verificado en el panel, el servidor autoritativo, un resolvedor público y el DNS local. hPanel confirmó que el dominio ya está conectado:

| Tipo | Nombre | Valor | TTL |
| --- | --- | --- | --- |
| A | `demo` | `45.93.101.181` | 86400 segundos |

Hostinger sugería TTL 300; Shopify no ofreció un campo para cambiarlo y publicó su TTL predeterminado de 86400 segundos. Se conservaron los registros existentes y los servidores de nombres. WordPress mantiene HTTP 200 por HTTPS. La verificación del 13/09/2026 confirmó que el certificado del subdominio ya está activo; la evidencia TLS y HTTP se conserva localmente en `work/hostinger/fase-4-verificacion.json`.

Directorio comprobado: el acceso **Dashboard del sitio → File manager → Open** abre File Browser para la demo. Tras los errores de acceso de las sesiones anteriores, la nueva sesión abierta por el usuario permitió entrar en `public_html` y listar su único archivo, `default.php` (15.99 KiB), correspondiente a la página predeterminada que responde públicamente. La raíz superior contiene `public_html` y el aviso `DO_NOT_UPLOAD_HERE`; la carga corresponde al interior de `public_html`. No fue necesario cambiar propietarios ni permisos.

La fase 4 queda cerrada con el destino preparado. No se reemplazaron archivos ni se subió la compilación. Antes de reemplazar la página predeterminada en la fase 5, conservar una copia para recuperación; este cierre acredita la inspección, no un respaldo. WordPress conserva su sitio y sus archivos separados.

## Fase 5 — Publicar la demo y enlazarla desde WordPress

Subir la compilación de la fase 3 al directorio confirmado. Comprobar el acceso público, recursos, tipos de contenido, encabezados HTTP y comportamiento de caché. Ajustar la configuración al alojamiento real; no asumir que una directiva incluida en HTML se aplica como encabezado del servidor.

En la página de WordPress acordada, añadir un botón «Probar demo» que abra la dirección del sistema. Mantener un acceso de contacto discreto en la demo y actualizar los enlaces de regreso según la navegación acordada. No incrustar por defecto toda la aplicación dentro de una página de WordPress.

Entregable: URL pública operativa y acceso desde WordPress.

Criterio de cierre: un visitante puede entrar desde WordPress, recorrer el pedido, recargar para reiniciarlo y volver a la página comercial; ambos sitios funcionan sin una sesión de administración.

### Avance de la fase 5 — 13/09/2026

- Publicada la entrega `3722b39cd28e` en `https://demo.inkmultiservicios.com/`: cinco recursos de la aplicación y `.htaccess`. Incluye «Volver a Sistemas» hacia `https://inkmultiservicios.com/sistemas/`, conservando el acceso discreto de contacto.
- Compilación y 25 pruebas aprobadas. La configuración del servidor fija JavaScript como `text/javascript`, aplica la restricción de incrustación por encabezado HTTP y desactiva los listados de carpetas. El HTML requiere revalidación; imágenes usan un día de caché y los recursos con hash, un año con `immutable`.
- Verificados desde solicitudes sin sesión los hashes de los cinco recursos públicos, tipos MIME, encabezados y caché. HTTPS devuelve 200 y HTTP redirige con 301. Configuración y rutas de fuentes devuelven 403 o 404; `assets/` no lista archivos. WordPress sigue respondiendo con 200.
- Recorrido probado en la demo publicada: aprobar cotización, crear pedido, abonar C$600, registrar y verificar la transferencia de C$2400, iniciar y finalizar producción, entregar cinco unidades y comprobar inventario 31 físicas / 7 reservadas / 24 disponibles, también mediante F3. Cambiar a Simple conserva el pedido y permite entregar las siete unidades restantes. Recargar restaura la presentación inicial. Sin errores o avisos en la consola capturada.
- Revisada la presentación móvil a 390 × 844 y verificado el regreso a Sistemas. El respaldo de `default.php` se conserva localmente; el archivo original fue enviado a la papelera, sin eliminación permanente. Su antigua URL devuelve 404.
- WordPress ya tiene «Probar demo» en `/sistemas/`, pero apunta a `/demo-sistema-ink/`, que contiene la presentación anterior. Debe actualizarse ese acceso al subdominio y resolver el destino anterior para evitar dos demostraciones divergentes.

Pendiente para cerrar: actualizar y comprobar el enlace en WordPress. La verificación de sesión por correo permitió reconocer al administrador en la página pública, pero `/wp-admin/` exige además autenticación HTTP Basic con el ámbito «Ink administration» y devuelve 401. Se solicitó al usuario completar ese acceso; no se desactivó la protección ni se cambiaron credenciales. El editor y los enlaces de WordPress aún no se han modificado.

## Fase 6 — Cerrar la entrega y definir actualizaciones

Registrar la URL definitiva, el commit publicado y los pasos de actualización y recuperación. Mantener una copia de la última compilación funcional para poder restaurarla si una publicación falla.

El procedimiento inicial será compilar, verificar y publicar el resultado. Una sincronización con GitHub por sí sola no publica en Hostinger: la automatización desde `main` requiere una integración de despliegue específica. Evaluarla después de la primera publicación, sin almacenar credenciales en el repositorio.

Entregable: guía breve de mantenimiento vinculada a la versión publicada.

Criterio de cierre: queda identificado cómo actualizar, comprobar y recuperar la demo, y qué versión está disponible para los prospectos.

## Datos necesarios antes de las fases de alojamiento

| Dato | Estado |
| --- | --- |
| Plan de hosting | Business Web Hosting, confirmado en hPanel |
| Sitios permitidos y ocupados | 50 permitidos; 2 ocupados tras crear la demo |
| Dominio y subdominio definitivos | `inkmultiservicios.com` y `demo.inkmultiservicios.com`; DNS conectado y HTTPS verificado |
| Registro DNS para la demo | A `demo` → `45.93.101.181`, TTL 86400; aplicado y verificado |
| Proveedor actual del dominio | Shopify, confirmado por Tucows; transferencia a Hostinger en curso |
| Página de WordPress que llevará el botón | `/sistemas/` ya contiene «Probar demo» hacia la presentación anterior; actualización pendiente |
| Acceso a hPanel, archivos, DNS y WordPress | hPanel, File Browser y DNS comprobados; WordPress exige autenticación adicional «Ink administration» |

Los cierres de las fases 1 a 3 acreditan la presentación, exploración y compilación verificadas. La fase 4 confirma el alojamiento independiente. La fase 5 ya publicó y verificó la demo; todavía falta actualizar el acceso desde WordPress.

La ficha operativa local se conserva en `work/dominio-y-hosting.md`, carpeta excluida de Git y de la publicación. Al retomar el trabajo, consultar de nuevo la transferencia y los servidores autoritativos antes de elegir dónde editar el DNS.

## Referencias de alojamiento

- [Hostinger: añadir un sitio y elegir PHP/HTML personalizado](https://www.hostinger.com/support/1583214-how-to-add-a-website-in-hostinger/).
- [Hostinger: subdominio independiente o como parte de un sitio existente](https://www.hostinger.com/support/1583405-how-to-create-and-delete-subdomains-in-hostinger/).
- [Hostinger: consultar los detalles del plan contratado](https://www.hostinger.com/support/1583276-how-to-find-the-details-of-your-hosting-plan-in-hostinger/).
