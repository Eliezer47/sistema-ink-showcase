# InkGestión — Demo del sistema

![Portada del recorrido visual de InkGestión](public/og.png)

Demostración pública de **InkGestión**, basada en la versión de escritorio **1.10.3**. Incluye pantallas recreadas y un pedido interactivo con datos ficticios. El [análisis de fidelidad](docs/fidelidad-demo.md) documenta la comparación, los cambios y los límites de la presentación.

Este repositorio es independiente del producto comercial. No contiene sus servicios, base de datos, autenticación, instaladores ni código de negocio.

La fidelidad se limita a la experiencia visible. Los estados y cálculos de la demo se crean de forma independiente; no deben trasladar arquitectura, contratos, modelos de datos ni algoritmos privados del producto. Todo archivo del repositorio público y todo JavaScript entregado al navegador se considera inspeccionable. La minificación no protege una implementación privada que se haya incluido por error.

El [plan de presentación y publicación en Hostinger](docs/plan-publicacion-hostinger.md) define las fases para centrar la página en el sistema, reducir la información exterior y enlazar la demo desde WordPress.

Las fases 1 a 4 están completadas: presentación mínima, exploración ajustada, compilación verificada y alojamiento independiente preparado. La fase 5 publicó la demo en [demo.inkmultiservicios.com](https://demo.inkmultiservicios.com/), con HTTPS y un enlace «Volver a Sistemas». El acceso «Probar demo» de WordPress aún debe actualizarse; su editor requiere una autenticación adicional. Consulta el [informe de la versión publicable](docs/version-publicable.md).

## Qué puede probar un prospecto

- **Explorar pantallas:** navegar por 16 módulos y abrir la consulta de Disponibilidad mediante el menú o F3. Catálogo contiene nueve apartados; Administración, once; Finanzas, siete. Los accesos opcionales de Calculadora, Artículos del cliente y Calidad están habilitados en este perfil de demostración.
- **Seguir un pedido:** aprobar una cotización y confirmar la venta desde ella en Ventas; registrar abonos o transferencias ficticias, verificar o rechazar cada transferencia y entregar total o parcialmente. Cada cobro aplicado conserva su propio recibo, importe, vuelto y saldo al emitir. Ventas, Caja, Producción, Entregas, Inventario, Disponibilidad y la cuenta por cobrar comparten el estado de ese ejemplo.
- **Comparar Simple y Por áreas:** Simple oculta Producción y Entregas del menú y permite confirmar toda la entrega pendiente desde Ventas o Caja. Las políticas de preparación automática y verificación de transferencias se prueban en Administración > Empresa.
- **Buscar y seleccionar registros** en las listas habilitadas, abrir ejemplos de cotización, recibo, resumen y etiquetas, y calcular un escenario de costos con tarifas sintéticas.
- **Consultar la guía** contextual y abrir «Más vistas» para revisar acceso, servidor, PIN, impresión, baucher y pérdida de conexión. Las pestañas admiten flechas, Inicio y Fin; Escape cierra la ventana y devuelve el foco al botón de acceso.
- **Ampliar la vista** con los mismos controles y datos. Guía, Más vistas y Reiniciar permanecen fuera del desplazamiento horizontal. Escape cierra primero la ventana o guía abierta; sin ellas, sale de la vista ampliada.

Los botones deshabilitados representan funciones disponibles únicamente en el producto instalado. Los ejemplos de Explorar pantallas son ilustraciones; el estado compartido corresponde a Seguir un pedido. Reiniciar ejemplo restaura el pedido y conserva las políticas elegidas; recargar restaura toda la demostración.

La vista completa incluye funciones sujetas a edición y permisos. El recorrido usa pasos abreviados; no reproduce todos los formularios del escritorio. La revisión adicional del 13 de septiembre está en [el informe de fidelidad](docs/fidelidad-demo.md). La entrega alojada se identifica en [el registro de publicación](docs/version-publicable.md).

## Límites

- Sin conexión a servicios comerciales, cuentas reales, telemetría ni almacenamiento del navegador.
- Los cobros y entregas solo modifican el ejemplo en memoria; no mueven dinero, generan documentos válidos ni afectan inventarios reales.
- Sin impresión física, exportación, restauración, importación de archivos o cambios de permisos reales.
- Los importes, usuarios, equipos y referencias son sintéticos. Los identificadores incluyen DEMO- y los correos de muestra usan el dominio reservado .example.
- La calculadora utiliza aritmética pública ilustrativa. No reproduce el motor de costos del producto.
- La demo no acredita seguridad, rendimiento, instalación, recuperación de respaldos ni funcionamiento multiusuario. Esas capacidades necesitan una prueba privada del sistema instalado.

La navegación de escritorio se conserva dentro de una ventana desplazable en pantallas pequeñas. Cuando no cabe a lo ancho, aparecen el selector «Pantalla» y las flechas de desplazamiento. La guía acerca el elemento que explica y permanece visible; no es necesario desplazar toda la página horizontalmente. Esto no representa una aplicación móvil del sistema.

## Ejecución local

Requiere Node.js 22.13 o posterior y pnpm 11. El repositorio fija la versión del gestor en package.json.

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm dev --host 127.0.0.1 --port 5173 --strictPort
```

Abrir http://127.0.0.1:5173/. Si pnpm está instalado directamente, se puede omitir corepack.

## Verificación

```bash
corepack pnpm test
corepack pnpm check:public
```

La suite compila TypeScript y la aplicación, comprueba la presentación inicial y el contenido compilado, verifica los límites de publicación y prueba los estados del pedido y la calculadora. Los escenarios de negocio de estas pruebas pertenecen exclusivamente a la demo.

check:public revisa los archivos publicables y detecta artefactos comerciales, respaldos, binarios, rutas privadas, llamadas de red, persistencia y dependencias operativas prohibidas. La política de contenido mantiene connect-src 'none'; los cambios locales pueden requerir recargar la página porque la conexión de actualización automática de desarrollo está bloqueada.

## Preparar una entrega

```bash
corepack pnpm release:prepare
```

Compila, ejecuta la suite y crea un directorio nuevo en `outputs/hostinger/`, con los recursos públicos y la configuración de Hostinger en `site/`, y su inventario SHA-256 en `manifest.json`. Solo se debe subir el contenido de `site/`, incluyendo `.htaccess`, cuya fuente es `deployment/hostinger/.htaccess`. El comando no publica ni crea un ZIP automáticamente. Las pruebas locales de alojamiento comprueban los recursos compilados en `/` y `/demo/`; los encabezados de `.htaccess` deben comprobarse además en el servidor real.

El [informe de entrega](docs/version-publicable.md) identifica la versión publicada y los recorridos verificados. La configuración de Hostinger aplica la restricción de incrustación mediante encabezados HTTP, evita listados de carpetas y define caché con revalidación del HTML y conservación prolongada de los recursos con hash. La publicación real verificó esos encabezados; el HTML por sí solo no aplica la restricción de incrustación.

## Portafolio y propiedad intelectual

El caso de estudio forma parte del [portafolio de Eliezer Ponce](https://eliezer47.github.io/portfolio/#/project). Este repositorio es visible para presentación, pero no es software de código abierto. Consulta [COPYRIGHT.md](COPYRIGHT.md).

Contacto comercial: [eliezerponcexd@gmail.com](mailto:eliezerponcexd@gmail.com)
