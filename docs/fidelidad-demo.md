# Análisis de fidelidad de la demo de InkGestión

Fecha de revisión: 12 de septiembre de 2026. Referencia del producto: **1.10.3**, entrega del 11 de septiembre de 2026, revisión **d1c852b**. Base de la demo revisada: **84db573**.

Revisión adicional: **13 de septiembre de 2026**, sobre la demo **72d1c34**. Se verificó en lectura que `main` remoto del producto apunta a **d1c852b449a21c2b7fdcf685f0cda0380844a4a8**. Se usó esa revisión confirmada; los cambios locales posteriores del producto quedaron fuera de la comparación.

## Conclusión

La demo original servía para presentar la apariencia general, pero no permitía apreciar con suficiente fidelidad el alcance actual del sistema. Mostraba 15 módulos, cuatro reutilizaban una tabla genérica y faltaban funciones relevantes de navegación, operación, catálogo y administración. La frase comercial sobre un flujo integrado no podía comprobarse al recorrerla.

La actualización permite presentar los módulos actuales y experimentar un pedido coherente de principio a fin. Es una recreación web del escritorio con simulaciones limitadas: no equivale al ejecutable comercial ni demuestra por sí misma que todas sus promesas operativas se cumplan en una instalación real.

## Evidencia y método

Se contrastaron el README del sistema, su archivo de versión y las notas de entrega 1.10.3 con el manual operacional vigente, los documentos de cierre del modo Simple y la matriz de contenidos comerciales. Se revisaron las definiciones de la ventana principal, el orden y visibilidad del menú, los apartados de Catálogo, Administración y Finanzas, y las vistas de Cotizaciones, Entregas, Calidad, Artículos del cliente, Disponibilidad y Calculadora.

Los manuales PDF/DOCX existentes se identificaban como 1.10.1; no se tomaron como referencia única para la entrega 1.10.3. El árbol de trabajo del producto también contenía cambios posteriores a la entrega: no se atribuyen automáticamente al instalador 1.10.3. La rama alternativa del showcase se inspeccionó como antecedente, sin incorporarla completa.

El producto se consultó en lectura. No se ejecutó el sistema de escritorio, su suite .NET ni su instalación, ni se validó SQL Server o hardware. La correspondencia visual se basa en estructuras de interfaz y documentación, no en una comparación píxel a píxel contra una sesión real. No se copiaron código comercial, contratos, bases de datos ni registros reales al showcase.

## Comparación y cambios

| Área | Brecha encontrada | Resultado en la demo |
| --- | --- | --- |
| Menú y operación | Jerarquía antigua; faltaban Disponibilidad, Calculadora y modo Simple | Ocho accesos principales, nueve secundarios en el perfil completo. Disponibilidad abre una ventana con F3; tres módulos secundarios son opcionales en el producto. Simple oculta Producción y Entregas. |
| Flujo comercial | Pantallas aisladas sin consecuencias observables | Pedido ficticio compartido desde cotización hasta entrega, con saldo, producción, reservas e historial. Reinicio disponible. |
| Cobro y transferencias | No se podía distinguir registrar de aplicar | Abonos, transferencias pendientes y verificación. El saldo solo disminuye cuando el cobro se aplica; una política alternativa permite aplicación inmediata. |
| Preparación y entrega | No se explicaban claramente las confirmaciones separadas | El pago completo prepara el trabajo únicamente en Simple con la política activada. Nunca entrega automáticamente. Por áreas permite entrega parcial; Simple confirma todo lo pendiente. |
| Inventario | Existencias estáticas sin relación con la entrega | En el recorrido, la entrega reduce existencia física y reserva; la disponibilidad refleja el mismo estado. Se muestran también ejemplos de kardex y consumo interno. |
| Cotizaciones | Tabla genérica | Propuestas con versión, vigencia, conceptos, fecha prometida y vista previa. El recorrido permite aprobar y convertir. |
| Entregas y despachos | Tabla genérica | Cantidades solicitadas, entregadas y pendientes; despacho agrupado, costo del transportista y obligación separada del cargo al cliente. |
| Artículos del cliente | Tabla genérica | Recepción, ubicación, custodia, producción y devolución; separados del inventario propio. |
| Calidad | Tabla genérica | Incidencias vinculadas a pedido, responsabilidad, costo y reposición. No se presenta como aprobación obligatoria universal. |
| Finanzas | Cobertura parcial | Siete apartados: Por cobrar, Por pagar, Planes, Cuentas, Informes, Activos fijos y Planificación. |
| Catálogo | Cinco apartados | Nueve apartados, incorporando Atributos, Familias y variantes, Acciones operativas y Perfiles de personalización. |
| Administración | Siete apartados | Once apartados, incorporando Cajas físicas, Auditoría, Diseño y navegación y Puesta en marcha; políticas del ejemplo en Empresa. |
| Impresión | Vista ilustrativa principalmente de documentos y recibos | Perfiles diferenciados de envío y retiro local, selección de formatos y vistas previas sintéticas. |
| Calculadora | Ausente | Cantidad, costo adicional, margen objetivo y precio manual; desglose de costos, venta y utilidad con tarifas de ejemplo. |
| Orientación del prospecto | Se prometía integración sin un recorrido comprobable | Dos experiencias identificadas, guía contextual y límites visibles del entorno. |

Panel, Métricas y Compras conservan presentaciones ilustrativas con acciones operativas deshabilitadas. En otras listas se habilita búsqueda y selección. Las vistas de exploración muestran ejemplos de momentos operativos; únicamente Seguir un pedido sincroniza sus cambios entre módulos.

## Qué se puede sostener ante un cliente

- Puede conocer la organización y los controles principales del producto de referencia.
- Puede observar por qué un pedido pagado todavía puede estar pendiente de entrega.
- Puede comparar un abono con una transferencia pendiente de verificar y ver su efecto sobre el saldo.
- Puede seguir cómo una entrega parcial afecta las cantidades e inventario del ejemplo.
- Puede explorar el alcance de las áreas administrativas sin introducir información real.

## Límites que siguen requiriendo demostración del producto instalado

| Promesa o capacidad | Qué muestra el showcase | Prueba necesaria en el producto |
| --- | --- | --- |
| Persistencia y trabajo multiusuario | Un estado temporal en una sola página | Abrir el mismo pedido desde dos estaciones y comprobar consistencia, permisos y concurrencia. |
| Seguridad y auditoría | Pantallas con perfiles y movimientos sintéticos | Intentar operaciones con distintos roles y verificar su autorización y auditoría efectiva. |
| Impresión por estación | Ejemplos HTML de documentos y etiquetas | Imprimir Carta/A4, recibos térmicos y etiquetas con las impresoras del negocio. |
| Respaldos y continuidad | Configuración y estados ilustrados | Verificar copia secundaria, restauración y comportamiento ante desconexión en un entorno de prueba. |
| Devolución tras cierre | Explicación del comportamiento documentado en 1.10.3 | Devolver un movimiento histórico desde una caja actual y verificar que el cierre anterior se conserva. |
| Costos, compras y conciliación | Campos y ejemplos de resultados | Ejecutar recepción parcial, consumos, distribución de costos y conciliación con datos controlados. |
| Rendimiento e instalación | Aplicación web compilada localmente | Instalar la entrega, comprobar sus prerrequisitos y medir con carga representativa. |

Los recibos del recorrido conservan ahora los importes de cada cobro aplicado, incluso después de otros pagos. Su formato HTML sigue siendo ilustrativo y no reproduce todas las plantillas del producto. La calculadora no sustituye el motor comercial. Los reportes operativos no se presentan como contabilidad formal o facturación electrónica. La versión web no implica disponibilidad del sistema como servicio cloud o aplicación móvil.

## Guion sugerido de demostración

1. Abrir Explorar pantallas y mostrar Ventas, Finanzas, Catálogo y Administración. Usar una búsqueda y abrir un documento de ejemplo.
2. Cambiar a Seguir un pedido en Por áreas. Aprobar la cotización por 12 camisetas de C$250, continuar en Ventas y confirmar la venta Desde cotización.
3. Cobrar C$600 en efectivo. Registrar los C$2,400 restantes como transferencia pendiente y mostrar que todavía existe saldo. Verificarla.
4. Iniciar y finalizar producción. Entregar cinco unidades. Inventario debe mostrar 31 físicas, siete reservadas y 24 disponibles; Disponibilidad debe coincidir.
5. Cambiar a Simple sin perder los datos. En Ventas, Entregar ahora confirma las siete unidades restantes.
6. Reiniciar el ejemplo en Simple. Cobrar el total y mostrar que la preparación automática conserva la entrega pendiente hasta confirmarla. La política se puede cambiar en Administración > Empresa.
7. Cerrar con las vistas de impresión y acordar una demostración del producto instalado para validar hardware y operación real.

## Verificación inicial del 12 de septiembre

La suite automatizada incluye compilación TypeScript/Vite, barreras de publicación, contenido del paquete compilado y diez casos de comportamiento del pedido y la calculadora. Las pruebas comprueban importes inválidos, exceso de pago, precisión de centavos, verificación idempotente, independencia entre saldo y entrega, cambios de modo y reinicio.

La revisión de navegador cubre búsquedas y selección, documentos y etiquetas, las siete secciones financieras, nueve de Catálogo y once de Administración, cálculo de ejemplo, recorrido con abono y transferencia, entrega parcial, disponibilidad y confirmación en Simple. Estas comprobaciones validan el showcase; no sustituyen pruebas del producto comercial.

Resultado de esta revisión: **21 de 21 pruebas aprobadas**, compilación correcta y ningún error o aviso en la consola capturada del navegador. Se verificaron también cancelación de entrega, reinicio, F3 y cierre de ventanas con Escape.

## Revisión adicional del 13 de septiembre

### Resultado comercial

La demo sirve como recorrido orientativo de las funciones y del flujo mostrado. No debe presentarse como una reproducción exacta de todas las pantallas de captura, ni como prueba de funcionamiento de una instalación real. El recorrido abrevia formularios y usa un único pedido preparado. Las funciones incluidas en la venta deben coincidir con la edición, configuración y permisos acordados con el comprador.

### Diferencias verificadas y corregidas

| Diferencia | Evidencia en la entrega 1.10.3 | Corrección en la demo |
| --- | --- | --- |
| La aclaración sobre escritorio estaba dentro de Acerca de | Manual: propósito, conexión y estaciones | Aviso visible al entrar y al ampliar; identifica datos ficticios. |
| La vista completa podía interpretarse como incluida en cualquier compra | Manual: Edición comercial | Se indica que las funciones dependen de edición y permisos; Acerca de identifica Comercial, Operaciones e Integral. |
| Convertir aparecía como acción directa en Cotizaciones | Manual: Cotizaciones, Convertir a pedido; controles de Cotizaciones y Ventas | Aprobar conserva la propuesta; el recorrido continúa en Ventas, Desde cotización, Confirmar venta. |
| Caja mostraba solo dos vistas generales | Manual: Registrar un cobro; controles de Caja | Por cobrar, Pendientes, Pagados e Historial de hoy. Un pedido pagado y parcialmente entregado sigue pendiente. |
| La verificación agrupaba todo lo pendiente y no permitía rechazar | Manual: Verificar transferencias | Verificar o rechazar cada movimiento por separado; rechazo con motivo, conservación de historia y saldo disponible para un nuevo cobro. |
| Un mismo recibo cambiaba al aumentar el pago acumulado | Manual: reimpresión; pruebas existentes de comprobantes de la entrega | Recibo por cobro aplicado con número, importe, método y saldo al emitir. No se ofrece recibo para transferencias pendientes o rechazadas. |
| Efectivo no mostraba el vuelto | Manual: Registrar un cobro | Monto recibido, aplicación hasta el saldo disponible y vuelto conservado en el recibo. |
| El recorrido obligaba a pasar por Producción antes de entregar | Manual: Trabajar una tarea y Entrega parcial o total; pruebas existentes de entrega en Simple | Entrega independiente del cobro. Si producción no está finalizada, exige confirmar que toda la línea está físicamente terminada, incluso en entrega parcial. |
| La calculadora conservaba decimales en el precio sugerido | Texto de la Calculadora de costos de 1.10.3 | Redondeo al entero superior; precio manual conserva sus centavos. Las tarifas permanecen ficticias. |
| Se podían confundir los pasos abreviados con las pantallas completas | Comparación de controles del escritorio y formularios del recorrido | Se distingue Pantallas de referencia de Recorrido guiado. Al visitar una pantalla fuera del pedido se aclara que sus registros no cambian con él. |

### Alcance y comprobación

- Se consultaron documentación, definiciones de interfaz y pruebas existentes de **la revisión de entrega**. No se ejecutaron el cliente comercial, sus pruebas .NET, SQL Server, instaladores ni impresoras durante esta revisión.
- Las nuevas pruebas reprodujeron cinco grupos de discrepancias antes del cambio y pasaron después. La suite de la demo aprobó **30 de 30 pruebas**, incluida compilación, publicación y ausencia de conexiones al producto o persistencia del navegador.
- Se verificaron **nueve recorridos agrupados** en un navegador sin ventana y con perfil temporal: Caja, conversión, recibos, transferencias, vuelto, entrega parcial/final, entrega sin cobrar, calculadora, navegación por los 16 módulos, vista ampliada y móvil de 390 × 844.
- Los nueve recorridos terminaron sin errores de aplicación ni solicitudes externas atribuibles a la demo. El antivirus local inyectó contenido y solicitudes propias, además de tres avisos de CSP; el HTML servido conserva su política original. Esa actividad del entorno se registró por separado, sin modificar la configuración del antivirus.
- No se incorporaron fuentes, contratos, algoritmos privados, bases de datos ni registros reales del sistema al repositorio público. La nueva lógica pertenece solo al ejemplo ficticio.

La validación visual exacta, formatos de impresión, operación multiusuario, permisos efectivos, instalación y restauración siguen pendientes de una demostración de la entrega comercial. Esta revisión no elimina esa limitación ni constituye una garantía de equivalencia completa.

**Publicación:** consulta `version-publicable.md` para identificar la entrega alojada y sus verificaciones. La comparación anterior describe el código revisado; el registro de publicación permite comprobar qué versión está disponible para los prospectos.
