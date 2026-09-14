# Versión publicada de la demo

La entrega actual **057815b25c4c** está publicada en [demo.inkmultiservicios.com](https://demo.inkmultiservicios.com/), verificada el **13/09/2026** (hora de México). Incorpora la revisión de fidelidad respecto de InkGestión **1.10.3**. Falta actualizar el acceso desde WordPress; consulta el [plan de publicación](plan-publicacion-hostinger.md).

## Entrega actual — Revisión de fidelidad 1.10.3

Fuente: commit [`978034c16f7777a0f091a4d106342b781ba46ed2`](https://github.com/Eliezer47/sistema-ink-showcase/commit/978034c16f7777a0f091a4d106342b781ba46ed2), sincronizado en `main`. La entrega se generó desde el árbol limpio, sin cambios locales pendientes. Los commits posteriores que solo actualicen este registro no cambian su compilación.

Directorio local: `outputs/hostinger/ink-demo-057815b25c4c-4oFvce/`. El inventario `manifest.json` conserva el commit, los tamaños y SHA-256 fuera de `site/`.

| Archivo dentro de `site/` | Bytes |
| --- | ---: |
| `.htaccess` | 763 |
| `index.html` | 974 |
| `assets/index-06fIzb8f.js` | 342241 |
| `assets/index-RlAj6Ip1.css` | 95583 |
| `og.png` | 1496117 |
| `sistema-ink-icon.png` | 8491 |
| **Total: 6 archivos** | **1944169** |

La compilación TypeScript/Vite y las **30 pruebas** pasaron antes de preparar la entrega. El control [Public safety en GitHub Actions](https://github.com/Eliezer47/sistema-ink-showcase/actions/runs/34793457055) también terminó correctamente. La revisión local del navegador cubrió los flujos de cobro, recibos, producción, entrega, calculadora y presentación móvil; los límites de fidelidad se documentan en el informe del proyecto.

Se cargaron primero los dos recursos nuevos en `public_html/assets` y se comprobaron sus hashes públicos antes de reemplazar `index.html`. Las imágenes y `.htaccess` ya coincidían con la entrega y se conservaron. La verificación pública confirmó los cinco recursos de la aplicación por SHA-256, HTTPS, redirección desde HTTP, tipos MIME, caché y bloqueo de fuentes, configuración y listado de carpetas. Evidencia local: `work/hostinger/revision-1.10.3-publicacion.json`.

En el dominio público se comprobó la aprobación de la cotización, la confirmación separada de la venta y el abono de C$600. La transferencia pendiente de C$2400 conservó el saldo hasta verificarla. Una vez liquidado el pedido, el primer recibo mantuvo su importe de C$600 y su saldo al emitir de C$2400. Se inició y finalizó la producción, se entregaron cinco unidades y el inventario mostró 31 físicas, 7 reservadas y 24 disponibles. La consola capturada no mostró errores ni avisos. La página de Sistemas de WordPress continuó respondiendo con HTTP 200.

Para recuperar la publicación anterior, se conserva `outputs/hostinger/ink-demo-3722b39cd28e-ABezVn/site/index.html` y sus dos recursos con hash siguen presentes en Hostinger. Restaurar ese `index.html` en el mismo sitio y verificarlo contra su inventario devuelve la versión anterior. No se eliminaron recursos antiguos durante esta actualización.

Los apartados siguientes conservan la evidencia histórica de las primeras fases.

## Entrega publicada — Fase 5

Directorio local: `outputs/hostinger/ink-demo-3722b39cd28e-ABezVn/`. El inventario SHA-256 se conserva en `manifest.json`, fuera de `site/`. Publicación mediante carga de archivos individuales, sin subir el ZIP ni el repositorio.

| Archivo dentro de `site/` | Bytes |
| --- | ---: |
| `.htaccess` | 763 |
| `index.html` | 904 |
| `assets/index-l4vI1i4-.js` | 335155 |
| `assets/index-DJYFv4xp.css` | 95060 |
| `og.png` | 1496117 |
| `sistema-ink-icon.png` | 8491 |
| **Total: 6 archivos** | **1936490** |

La compilación con el enlace «Volver a Sistemas» pasó las 25 pruebas. La última revisión posterior se limitó a `.htaccess`, cuyo funcionamiento se comprobó en Hostinger: tipo MIME de JavaScript, encabezados de protección y caché, y bloqueo de acceso a configuración y listados. La evidencia HTTP con hashes y respuestas sin sesión se conserva localmente en `work/hostinger/fase-5-verificacion.json`. El recorrido público, la recarga, la presentación móvil y el enlace de regreso también se verificaron en navegador.

La entrega sigue incluyendo cambios locales sin commit sobre la base indicada más abajo. El acceso de WordPress todavía apunta a la presentación anterior; la fase 5 permanece abierta hasta actualizarlo y comprobar el recorrido de entrada.

## Archivos de la entrega inicial — Fase 3

Directorio local: `outputs/hostinger/ink-demo-cc77d5640b79-hRsgDP/`.

| Archivo dentro de `site/` | Bytes |
| --- | ---: |
| `index.html` | 904 |
| `assets/index-BQxGPDsC.js` | 335123 |
| `assets/index-DJYFv4xp.css` | 95060 |
| `og.png` | 1496117 |
| `sistema-ink-icon.png` | 8491 |
| **Total: 5 archivos** | **1935695** |

El directorio de entrega contiene también `manifest.json`, con el SHA-256 y tamaño de cada archivo, y `ink-demo-cc77d5640b79.zip` (1604656 bytes). El ZIP contiene únicamente los cinco recursos y sus carpetas; cada entrada se contrastó por tamaño y SHA-256 con el inventario.

SHA-256 del ZIP:

```text
9a37a6e5ef5e4b72d0d23d41e1893507af8b54093f47e088e431661eaa2b12e3
```

Publicar únicamente el contenido de `site/` o extraer el contenido del ZIP en el directorio de destino confirmado. El inventario se conserva fuera del sitio. No subir el repositorio, `src`, pruebas, documentación, dependencias ni herramientas de desarrollo.

El commit base es `5c6e114ccf80be098223a47a9a72d74597adf30c`, pero la entrega **incluye cambios locales sin commit** de las fases 1 a 3. No equivale a ese commit: el inventario identifica los archivos concretos preparados. La carpeta `outputs` está excluida de Git.

## Verificaciones ejecutadas

Entorno: Node.js 24.19.0 y pnpm 11.9.0. `corepack pnpm test` completó la compilación TypeScript/Vite y **25 pruebas**, sin fallos.

- Presentación inicial, navegación, estados del pedido, calculadora y controles de publicación.
- Servidor local de la compilación en `/` y `/demo/`: cada recurso devuelve HTTP 200, tipo MIME correcto y bytes idénticos al archivo compilado. Las referencias de HTML son relativas y no incluyen el entorno de desarrollo.
- Las solicitudes de fuentes, configuración de Git, variables de entorno, manifiesto del proyecto y documentación devuelven 404 en esos servidores de prueba.
- Compilación sin mapas de código fuente ni archivos del producto comercial. Revisión del contenido compilado y de las imágenes públicas, además de los controles automáticos de conexiones, persistencia y artefactos prohibidos.

La revisión en navegador se hizo sobre la copia `site/` de esta entrega, no sobre el servidor de desarrollo: escritorio **1280 × 720** desde la raíz y móvil **390 × 844** desde `/demo/`. Las consolas capturadas no mostraron errores ni avisos.

| Recorrido | Resultado observado |
| --- | --- |
| Cotización y pedido | Aprobar y convertir habilita el recorrido de cobro y preparación. |
| Abonos y validación | C$600 deja C$2400 de saldo; el formulario impide un abono de C$3001 sobre un pedido de C$3000. |
| Transferencia | C$2400 pendiente conserva el saldo; verificarla completa el pago. |
| Producción y entrega parcial | Iniciar y finalizar preparación permite entregar 5 de 12 unidades. |
| Inventario y F3 | Ambas vistas reflejan 31 físicas, 7 reservadas y 24 disponibles tras la entrega parcial. |
| Modo Simple | Conserva el pedido y las 5 unidades entregadas; cancelar la entrega restante no cambia el estado y confirmarla entrega las 7 pendientes. |
| Documentos | Recibo y etiqueta de envío abren con datos ficticios y cierran con Escape. |
| Calculadora | Caso inicial: costo C$1680, venta C$2400 y utilidad C$720. Con C$120 adicionales y precio manual C$250: costo C$1800, venta C$3000 y utilidad C$1200. |
| Reinicio | Reiniciar devuelve el pedido a borrador; recargar restaura toda la demo. |
| Exploración móvil | Búsqueda sin coincidencias muestra el estado vacío; filtrar y seleccionar un cliente se conserva al ampliar la vista. |
| Ayuda y teclado | Las seis vistas complementarias abren; Fin selecciona la última pestaña. Escape cierra el diálogo, luego la guía y finalmente la vista ampliada. |
| Recursos en subcarpeta | Logos y archivos de estilos y JavaScript cargan desde `/demo/`; recargar esa ubicación funciona. |

## Límites públicos y configuración del alojamiento

Esta fase mantiene la simulación independiente y los datos sintéticos de la demo. No añade implementación, contratos, modelos ni algoritmos privados del producto comercial. Los archivos JavaScript publicados siguen siendo inspeccionables; la ausencia de mapas de código fuente no impide copiar una apariencia ni conocer los comportamientos visibles.

En la fase 3 se retiró `frame-ancestors 'none'` de la etiqueta meta porque esa directiva solo funciona en un encabezado HTTP. Las demás directivas de la política de contenido, incluido `connect-src 'none'`, se conservan. La fase 5 configuró y verificó `Content-Security-Policy: frame-ancestors 'none'` en Hostinger. La protección depende del encabezado del servidor, no de la etiqueta HTML. [Referencia de MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors).

Las comprobaciones locales acreditan el paquete y sus rutas. La fase 4 verificó directorio, DNS y HTTPS. La entrega publicada de la fase 5 agrega `deployment/hostinger/.htaccess` como configuración del servidor y verificó sus encabezados y caché en el dominio real. El contenido HTML revalida su caché, las imágenes usan `max-age=86400` y los recursos con hash usan `max-age=31536000, immutable`. [Hostinger: configuración de encabezados de caché](https://www.hostinger.com/support/8052370-advanced-cdn-header-management-at-hostinger/), [Apache: encabezados HTTP](https://httpd.apache.org/docs/2.4/mod/mod_headers.html).

## Generar una entrega posterior

```bash
corepack pnpm release:prepare
```

El comando compila, ejecuta las pruebas y copia `dist` y la configuración canónica `deployment/hostinger/.htaccess` a una carpeta nueva de `outputs/hostinger/`. Verifica las copias y escribe su inventario fuera de `site/`; no sobrescribe entregas anteriores ni publica. El ZIP de la entrega inicial se creó posteriormente y se verificó contra su inventario; el comando no comprime automáticamente.

Node.js se necesita para compilar y comprobar el proyecto. El alojamiento de estos archivos estáticos no requiere mantener un proceso Node.js.
