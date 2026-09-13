# InkGestión — Demo del sistema

![Portada del recorrido visual de InkGestión](public/og.png)

Demostración pública de **InkGestión**, basada en la versión de escritorio **1.10.3**. Incluye pantallas recreadas y un pedido interactivo con datos ficticios. El [análisis de fidelidad](docs/fidelidad-demo.md) documenta la comparación, los cambios y los límites de la presentación.

Este repositorio es independiente del producto comercial. No contiene sus servicios, base de datos, autenticación, instaladores ni código de negocio.

## Qué puede probar un prospecto

- **Explorar pantallas:** navegar por 16 módulos y abrir la consulta de Disponibilidad mediante el menú o F3. Catálogo contiene nueve apartados; Administración, once; Finanzas, siete. Los accesos opcionales de Calculadora, Artículos del cliente y Calidad están habilitados en este perfil de demostración.
- **Seguir un pedido:** aprobar una cotización, convertirla, registrar abonos o transferencias ficticias, verificar el cobro, preparar el trabajo y entregar total o parcialmente. Ventas, Caja, Producción, Entregas, Inventario, Disponibilidad y la cuenta por cobrar comparten el estado de ese ejemplo.
- **Comparar Simple y Por áreas:** Simple oculta Producción y Entregas del menú y permite confirmar toda la entrega pendiente desde Ventas o Caja. Las políticas de preparación automática y verificación de transferencias se prueban en Administración > Empresa.
- **Buscar y seleccionar registros** en las listas habilitadas, abrir ejemplos de cotización, recibo, resumen y etiquetas, y calcular un escenario de costos con tarifas sintéticas.
- **Consultar la guía** contextual y seis vistas complementarias sobre acceso, servidor, PIN, impresión, baucher y pérdida de conexión.

Los botones deshabilitados representan funciones disponibles únicamente en el producto instalado. Los ejemplos de Explorar pantallas son ilustraciones; el estado compartido corresponde a Seguir un pedido. Reiniciar ejemplo restaura el pedido y conserva las políticas elegidas; recargar restaura toda la demostración.

## Límites

- Sin conexión a servicios comerciales, cuentas reales, telemetría ni almacenamiento del navegador.
- Los cobros y entregas solo modifican el ejemplo en memoria; no mueven dinero, generan documentos válidos ni afectan inventarios reales.
- Sin impresión física, exportación, restauración, importación de archivos o cambios de permisos reales.
- Los importes, usuarios, equipos y referencias son sintéticos. Los identificadores incluyen DEMO- y los correos de muestra usan el dominio reservado .example.
- La calculadora utiliza aritmética pública ilustrativa. No reproduce el motor de costos del producto.
- La demo no acredita seguridad, rendimiento, instalación, recuperación de respaldos ni funcionamiento multiusuario. Esas capacidades necesitan una prueba privada del sistema instalado.

La navegación de escritorio se conserva dentro de una ventana desplazable en pantallas pequeñas. Esto no representa una aplicación móvil del sistema.

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

La suite compila TypeScript y la aplicación, comprueba el contenido compilado, verifica los límites de publicación y prueba los estados del pedido y la calculadora. Los escenarios de negocio de estas pruebas pertenecen exclusivamente a la demo.

check:public revisa los archivos publicables y detecta artefactos comerciales, respaldos, binarios, rutas privadas, llamadas de red, persistencia y dependencias operativas prohibidas. La política de contenido mantiene connect-src 'none'; los cambios locales pueden requerir recargar la página porque la conexión de actualización automática de desarrollo está bloqueada.

## Portafolio y propiedad intelectual

El caso de estudio forma parte del [portafolio de Eliezer Ponce](https://eliezer47.github.io/portfolio/#/project). Este repositorio es visible para presentación, pero no es software de código abierto. Consulta [COPYRIGHT.md](COPYRIGHT.md).

Contacto comercial: [eliezerponcexd@gmail.com](mailto:eliezerponcexd@gmail.com)
