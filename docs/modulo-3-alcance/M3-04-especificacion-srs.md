# M3-04-especificacion-srs.md

<!-- METADATOS DEL DOCUMENTO -->
<!--
Nombre        : M3-04-especificacion-srs.md
Módulo        : Módulo 3 — Documentación de Objetivos y Alcance (SRS)
Fuentes       : Sommerville, Ingeniería de Software, 9ª Ed. Cap. 4 §4.2, §4.3, §4.7
                IEEE Std 830 (referenciado en Sommerville Cap. 4, p. 93)
                Cap. 25 §25.1 (Administración del cambio)
Versión       : 1.0
Fecha         : 2026-02-25
Estado        : activo
Archivos prev.: M3-01 (RF/RNF), M3-02 (técnicas IR), M3-03 (modelos)
-->


M3-04 — Especificación del SRS Formal
1. Metadatos
Campo
Valor
Nombre del archivo
M3-04-especificacion-srs.md
Módulo del sistema
Módulo 3 — Documentación de Objetivos y Alcance (SRS)
Capítulos fuente
Sommerville Cap. 4 §4.2, §4.3, §4.7 · Cap. 25 §25.1 · IEEE 830
Versión
1.0
Fecha
2026-02-25
Estado
activo
Prerrequisitos
M3-01, M3-02, M3-03, M1-01, M1-03, M2-01


2. Objetivo del Documento
Este archivo es el archivo central del Módulo 3 y de todo el sistema de gestión. Define el marco teórico completo y el proceso operativo paso a paso para producir el SRS formal (Especificación de Requerimientos del Software) del proyecto durante el estado en_especificacion.
Por qué el SRS es el artefacto central
El SRS no es un documento de referencia interna. Es el contrato técnico del proyecto:
El cliente lo firma: La versión v1.0 es el documento que el cliente aprueba y que define el alcance legal del proyecto. Cualquier cambio posterior a esa firma tiene implicaciones contractuales que el sistema debe registrar formalmente.
El equipo lo usa para verificar: Cada funcionalidad implementada debe poder contrastarse con un requerimiento del SRS. Si algo está construido pero no aparece en el SRS, no pertenece al alcance acordado. Si algo del SRS no está construido, el proyecto está incompleto.
Define el scope legal: En proyectos con clientes externos, el SRS es el documento que establece qué se incluye y qué no. Un SRS ambiguo es fuente de disputas contractuales.
La síntesis que produce el SRS
El estado en_especificacion es donde todos los insumos de los estados anteriores convergen:
text
M1-01  →  Stakeholders con niveles de influencia     ──┐
M1-03  →  Glosario de dominio actualizado            ──┤
M2-01  →  Datos del proyecto (nombre, código, etc.)  ──┼──▶  SRS v1.0
M3-02  →  Requerimientos candidatos recopilados      ──┤
M3-03  →  Modelos de contexto, interacción, estructura──┘

El analista no inventa el SRS durante en_especificacion: lo formaliza a partir de insumos ya producidos, aplicando las reglas de escritura, la estructura estándar y los criterios de calidad que este archivo define.

3. El Documento de Requerimientos del Software
(Cap. 4 §4.2, p. 91–94)
3.1 Definición fundamental
Sommerville define:
"El documento de requerimientos de software (llamado algunas veces especificación de requerimientos de software o SRS) es un comunicado oficial de lo que deben implementar los desarrolladores del sistema. Incluye tanto los requerimientos del usuario para un sistema, como una especificación detallada de los requerimientos del sistema."
— (Cap. 4 §4.2, p. 91)
La clave de esta definición está en la palabra oficial: no es un borrador de trabajo ni un conjunto de notas. Es el enunciado acordado entre cliente y equipo de desarrollo.
3.2 Propiedades de un buen SRS
Derivadas de Cap. 4 §4.3 (p. 94), un SRS bien producido debe ser:
Propiedad
Definición operativa
Cómo verificarla
Claro
Cada requerimiento tiene una sola interpretación posible. No hay ambigüedad sobre qué debe hacer el sistema.
Hacer que dos personas distintas lean el mismo RF de forma independiente y comprobar que llegan a la misma conclusión de qué debe implementarse.
Sin ambigüedades
No contiene palabras vagas ni comparativos sin referencia. Eliminadas expresiones como "adecuado", "fácil de usar", "rápido", "robusto" sin métrica.
Pasar el checklist de palabras de alerta (ver §4.1 de este archivo).
Fácil de entender
Un stakeholder no técnico puede leer los RF del usuario y comprender qué hará el sistema. Un desarrollador puede leer los RF del sistema y saber qué implementar.
Prueba de lectura con un representante de cada grupo.
Completo
"Totalidad significa que deben definirse todos los servicios requeridos por el usuario." (Cap. 4 §4.1, p. 86). Todos los actores tienen al menos un RF. Todas las secciones de la estructura tienen contenido.
Ejecutar checklist §8.1 de este archivo.
Consistente
"Consistencia quiere decir que los requerimientos tienen que evitar definiciones contradictorias." (Cap. 4 §4.1, p. 86). No hay dos RF que se contradigan. Los actores del SRS coinciden con los stakeholders de M1-01.
Ejecutar checklist §8.2 de este archivo.

3.3 Usuarios del documento de requerimientos
(Cap. 4 §4.2, Figura 4.6, p. 92)
Sommerville identifica explícitamente los distintos usuarios del SRS y sus diferentes necesidades:
Rol
Por qué lee el SRS
Qué busca en él
Cliente / Sponsor
Verificar que sus necesidades están reflejadas antes de firmar
Que diga exactamente lo que pidió; que no incluya funcionalidad que no solicitó ni omita la que sí solicitó
Gestor de proyecto
"Planear una cotizacin para el sistema y el proceso de desarrollo del sistema" (Fig. 4.6)
Alcance total, riesgos, dependencias entre requerimientos, base para estimación de esfuerzo
Ingeniero de sistemas (arquitecto)
"Entender qué sistema debe desarrollarse" (Fig. 4.6)
Restricciones técnicas, RNF de rendimiento/seguridad, dependencias de integración con otros sistemas
Desarrollador
Implementar las funcionalidades acordadas
RF detallados con criterios de aceptación verificables, precondiciones y postcondiciones
Ingeniero de pruebas (QA/Tester)
"Desarrollar pruebas de validación para el sistema" (Fig. 4.6)
Criterios de aceptación en formato DADO/CUANDO/ENTONCES que puedan convertirse directamente en casos de prueba
Analista futuro / Mantenimiento
"Comprender el sistema y las relaciones entre sus componentes" (Fig. 4.6)
Historia de versiones, trazabilidad RF↔componente, glosario de dominio, justificaciones de requerimientos diferidos

Nota de Sommerville: "La diversidad de posibles usuarios significa que el documento de requerimientos debe ser un compromiso entre la comunicación de los requerimientos a los clientes, la definición de los requerimientos con detalle preciso para desarrolladores y examinadores, y la inclusión de información sobre la posible evolución del sistema." (Cap. 4 §4.2, p. 92)
Aplicación en el sistema: El sistema de gestión debe permitir que usuarios con roles distintos (cliente, gestor, analista) accedan al SRS con permisos diferenciados. El cliente puede revisar y aprobar; el gestor puede editar; el desarrollador puede consultar pero no modificar tras la aprobación.
3.4 El problema de los SRS en proyectos ágiles
(Cap. 4 §4.2, p. 92–93)
Sommerville plantea directamente la tensión con metodologías ágiles:
"Los métodos de desarrollo giles argumentan que los requerimientos cambian tan rpidamente que un documento de requerimientos se vuelve obsoleto tan pronto como se escribe, as que el esfuerzo se desperdicia en gran medida. En lugar de un documento formal, los enfoques como la programacin extrema [...] recopilan de manera incremental requerimientos del usuario y los escriben en tarjetas como historias de usuario."
— (Cap. 4 §4.2, p. 92–93)
Sin embargo, el propio Sommerville matiza que incluso en proyectos ágiles es útil un documento SRS cuando:
El software es contratado por un cliente externo (producto personalizado, no genérico).
El sistema incluye requerimientos no funcionales de confiabilidad que se aplican al sistema completo y son fáciles de olvidar cuando se trabaja requerimiento por requerimiento.
El sistema es suficientemente grande o complejo como para requerir un diseño arquitectónico previo.
"An resulta til escribir un breve documento de apoyo que defina los requerimientos de la empresa y los requerimientos de confiabilidad para el sistema es fcil olvidar los requerimientos que se aplican al sistema como un todo, cuando uno se enfoca en los requerimientos funcionales para la siguiente liberacin del sistema."
— (Cap. 4 §4.2, p. 93)
Conclusión para el sistema: El backlog NO reemplaza al SRS en el sistema austranet-cco porque este sistema gestiona proyectos con clientes externos que firman un contrato. El SRS es ese contrato. El backlog puede existir como herramienta de gestión interna del equipo de desarrollo, pero el SRS es el documento oficial que el cliente aprueba.
3.5 La evolución del SRS durante el proyecto
(Cap. 4 §4.7, p. 111–114)
"Los requerimientos para los grandes sistemas de software siempre cambian."
— (Cap. 4 §4.7, p. 111)
Sommerville identifica las causas inevitables del cambio:
Los ambientes empresarial y técnico cambian (nuevas leyes, nuevos sistemas con los que integrar).
Los clientes que pagan y los usuarios finales tienen necesidades que a veces divergen.
Los propios usuarios, al usar el sistema, descubren nuevas necesidades que no podían anticipar.
Esto hace necesaria una política de versiones explícita del SRS (ver §7 de este archivo) y un proceso formal de administración del cambio que registre cada modificación, su justificación y su impacto.
Aplicación en el sistema: El campo historialVersiones del tipo SRS (propuesto en §10) implementa esta necesidad. Ninguna versión del SRS se sobreescribe: se archiva y se crea una nueva versión con referencia a la solicitud de cambio que la originó.

4. Escritura de Requerimientos en Lenguaje Natural
(Cap. 4 §4.3, p. 94–98)
Esta sección es el manual de escritura del campo descripcion del tipo Requerimiento en el sistema.
4.1 Reglas de escritura de RF
(Cap. 4 §4.3.1, p. 96–97)
Sommerville presenta estas directrices explícitas para escribir requerimientos en lenguaje natural. Se reproducen completas por ser norma de escritura del sistema:

Directriz 1 — Usar formato estándar sin excepciones
"Elabore un formato estándar y asegúrese de que todas las definiciones de requerimientos se adhieran a dicho formato. Al estandarizar el formato es menos probable cometer omisiones y más sencillo comprobar los requerimientos."
— (Cap. 4 §4.3.1, p. 96)
Sommerville añade que el formato que él usa expresa el requerimiento en una sola oración, con un enunciado de razones asociado que explica por qué se propuso el requerimiento e idealmente quién lo solicitó.
✅ CORRECTO:
text
El sistema DEBE permitir al gestor registrar un nuevo proyecto con nombre, 
código, entidad cliente y fecha de inicio.
[Razón: El registro del proyecto es el evento que activa todo el ciclo de IR.]
[Fuente: Gestor de proyecto — M1-01]

❌ INCORRECTO:
text
El sistema debe manejar proyectos de manera apropiada.
[No hay razón. No hay fuente. "Manejar" y "apropiada" son ambiguos.]


Directriz 2 — Vocabulario controlado: DEBE / DEBERÍA / PODRÁ
"Utilice el lenguaje de manera clara para distinguir entre requerimientos obligatorios y deseables. Los primeros son requerimientos que el sistema debe soportar y, por lo general, se escriben en futuro debe ser. En tanto que los requerimientos deseables no son necesarios y se escriben en tiempo pospretrito o como condicional debería ser."
— (Cap. 4 §4.3.1, p. 96)
La distinción en el sistema es:
Término
Inglés equivalente
Uso
Prioridad MoSCoW
DEBE
SHALL
Requerimiento obligatorio — el sistema falla si no lo cumple
Must Have
DEBERÍA
SHOULD
Requerimiento deseable — el sistema es mejor con él, pero funciona sin él
Should Have
PODRÁ
MAY
Requerimiento opcional — puede implementarse si hay tiempo/presupuesto
Could Have

⚠️ Regla crítica: Usar estos términos de manera absolutamente consistente en todo el SRS. Si en la Sección 3 un RF dice "el sistema debería registrar...", QA debe interpretar que ese requerimiento es deseable, no obligatorio. Si se pretendía obligatorio, debe decir "DEBE". La inconsistencia en el vocabulario es la causa más frecuente de disputas en proyectos con clientes.
✅ CORRECTO:
text
El sistema DEBE validar que el código del proyecto sea único antes de guardar.
El sistema DEBERÍA mostrar una sugerencia de código basada en el nombre del proyecto.
El sistema PODRÁ mostrar proyectos similares como referencia durante el registro.

❌ INCORRECTO:
text
El sistema tiene que validar el código y podría mostrar sugerencias y quizás proyectos similares.
[Tres requerimientos mezclados. Vocabulario inconsistente. Imposible de verificar.]


Directriz 3 — Resaltar partes clave con texto destacado
"Use texto resaltado (negrilla, cursiva o color) para seleccionar partes clave del requerimiento."
— (Cap. 4 §4.3.1, p. 96)
En el contexto del sistema (almacenamiento en Firestore), esto se implementa como:
El verbo modal (DEBE/DEBERÍA/PODRÁ) siempre en mayúsculas.
Los nombres de entidades del sistema (que aparecen en el glosario de M1-03) entre comillas o con la primera letra en mayúscula, de forma consistente.
Los valores numéricos de métricas en RNF siempre en negrita en la visualización del SRS.

Directriz 4 — No usar jerga técnica de software
"No deduzca que los lectores entienden el lenguaje técnico de la ingeniería de software. Es fácil que se malinterpreten palabras como arquitectura y módulo. Por lo tanto, debe evitar el uso de jerga, abreviaturas y acrónimos."
— (Cap. 4 §4.3.1, p. 96–97)
Los RF del usuario (Sección 3 del SRS, subsección del usuario) deben escribirse en lenguaje del dominio del negocio. Los RF del sistema pueden usar terminología técnica siempre que esté definida en el Glosario (Apéndice A del SRS, importado desde M1-03).
✅ CORRECTO (RF de usuario):
text
El analista DEBE poder registrar a todos los interesados en el proyecto, 
indicando su nombre y nivel de participación.

❌ INCORRECTO (RF de usuario):
text
El sistema DEBE persistir las entidades de tipo Stakeholder con sus relaciones 
de cardinalidad N:M en el módulo de administración de roles.
[Jerga técnica inapropiada para un RF de usuario legible por el cliente.]


Directriz 5 — Asociar razón a cada requerimiento
"Siempre que sea posible, asocie una razón con cada requerimiento de usuario. La razón debe explicar por qué se incluyó el requerimiento. Es particularmente útil cuando los requerimientos cambian, pues ayuda a decidir cuáles cambios serían indeseables."
— (Cap. 4 §4.3.1, p. 97)
Este es el campo fuente del tipo Requerimiento en el sistema: no solo quién lo solicitó, sino por qué fue incluido. Sin la razón, cuando el cliente propone eliminar un RF en la fase de validación, el analista no tiene argumento para defender su inclusión.

Directriz 6 — Un requerimiento = una responsabilidad
No derivada explícitamente como regla numerada por Sommerville, pero sí como práctica que se desprende de toda la sección §4.3: cada RF debe describir una sola responsabilidad del sistema. Los RF compuestos (que incluyen "y" conectando dos funcionalidades independientes) deben dividirse.
✅ CORRECTO:
text
RF-015: El sistema DEBE permitir al analista cambiar el estado de un requerimiento 
        de 'propuesto' a 'aprobado'.
RF-016: El sistema DEBE registrar la fecha y el usuario que realizó el cambio 
        de estado del requerimiento.

❌ INCORRECTO:
text
RF-015: El sistema DEBE permitir cambiar el estado de un requerimiento y 
        registrar el usuario que lo hizo.
[Dos responsabilidades. Si RF-015 falla en QA, ¿qué parte falló?]


Directriz 7 — Verificabilidad obligatoria
Derivada de Cap. 4 §4.6 (p. 110): "los requerimientos del sistema deben escribirse siempre de manera que sean verificables. Esto significa que usted debe ser capaz de escribir un conjunto de pruebas que demuestren que el sistema entregado cumpla cada requerimiento especificado."
Cada RF DEBE tener un criterio de aceptación que permita una prueba concreta. Si no se puede escribir la prueba, el RF está mal escrito.
✅ CORRECTO:
text
RF-021: El sistema DEBE bloquear el acceso a un SRS en estado 'aprobado' 
        para modificaciones directas.
Criterio: DADO que el SRS tiene estado 'aprobado', 
          CUANDO un usuario intenta editar un requerimiento, 
          ENTONCES el sistema muestra el error "SRS aprobado: use solicitud de cambio" 
          y no persiste ningún cambio.

❌ INCORRECTO:
text
RF-021: El sistema DEBE garantizar la integridad del SRS aprobado.
[¿Qué prueba demuestra que se cumple "garantizar la integridad"?]


Directriz 8 — Resolver ambigüedades antes de escribir el RF
(Cap. 4 §4.1, p. 86)
"La inexactitud en la especificación de requerimientos causa muchos problemas en la ingeniería de software. Es natural que un desarrollador de sistemas interprete un requerimiento ambiguo de forma que simplifique su implementación. Sin embargo, con frecuencia, esto no es lo que desea el cliente."
— (Cap. 4 §4.1, p. 86)
Tipos de ambigüedad frecuentes en RF:
Tipo
Ejemplo malo
Corrección
Polisemia
"El sistema debe manejar el proyecto"
¿Manejar = crear, editar, eliminar, asignar? Especificar cada operación por separado
Pronombre indefinido
"El usuario puede actualizarlo"
¿Qué actualiza? Nombrar explícitamente el objeto: "el analista puede actualizar el estado del requerimiento"
Comparativo sin referencia
"El sistema debe responder más rápido"
¿Más rápido que qué? Definir: "el sistema DEBE responder en menos de 2 segundos"
Adjetivo sin métrica
"El sistema debe ser seguro/robusto/flexible"
"El sistema DEBE requerir autenticación con token JWT válido para cada operación de escritura"
Negativo ambiguo
"El sistema no debe ser lento"
"El sistema DEBE completar la carga del listado de proyectos en menos de 3 segundos con hasta 500 registros activos"

Lista de palabras de alerta — señales de un RF mal escrito que el sistema DEBERÍA detectar automáticamente:
text
adecuado, apropiado, flexible, robusto, escalable, fácil de usar,
intuitivo, rápido, eficiente, seguro, confiable, suficiente,
normalmentem generalmente, en su mayoría, a veces, razonablemente,
manejar, gestionar (sin especificar qué operaciones), soportar,
permitir (sin especificar quién), garantizar (sin criterio medible)

Aplicación en el sistema: Las reglas de la Sección 4.1 son el estándar de escritura del campo descripcion del tipo Requerimiento. El sistema DEBERÍA implementar una validación que advierta cuando una descripción contiene palabras de la lista de alerta antes de permitir cambiar el estado de propuesto a aprobado.

4.2 Notación tabular
(Cap. 4 §4.3.2, p. 97–98 — Especificaciones estructuradas)
"El lenguaje natural estructurado es una manera de escribir requerimientos del sistema, donde está limitada la libertad del escritor de requerimientos y todos éstos se anotan en una forma estándar."
— (Cap. 4 §4.3.2, p. 97)
Cuándo usar tablas en lugar de texto libre
Las tablas son superiores al texto libre cuando:
Hay múltiples situaciones alternativas y se necesita describir las acciones en cada una (Sommerville, p. 98: "Las tablas son particularmente útiles cuando hay algunas posibles situaciones alternas y se necesita describir las acciones a tomar en cada una de ellas").
El RF describe un cálculo con condiciones (ej: cálculo de métricas MoSCoW según distribución).
Se especifican reglas de negocio con múltiples combinaciones de entrada/salida.
Se documenta una tabla de transición de estados del ciclo de vida del SRS.
Estructura de la especificación tabular (Figura 4.10, p. 97)
Sommerville presenta este formato como la plantilla estándar para especificaciones estructuradas:
Campo
Contenido
Identificador
Código único del sistema (ej: SRS3.3.2)
Función
Nombre corto de la función que especifica este RF
Descripción
Descripción completa de lo que hace la función
Entradas
Lista de entradas con sus tipos y origen
Fuente
De dónde provienen las entradas (sensor, base de datos, usuario, etc.)
Salidas
Lista de salidas con sus tipos y destino
Destino
Quién o qué consume las salidas
Acción
Descripción detallada de la lógica: qué hace el sistema con las entradas para producir las salidas
Requerimientos
Otros datos o entidades del sistema que esta función necesita
Precondición
Estado que debe ser verdadero antes de ejecutar la función
Postcondición
Estado que es verdadero después de ejecutar la función exitosamente
Efectos colaterales
Cambios de estado en el sistema que no son la salida principal

Ejemplo del libro (Figura 4.10, p. 97) — Sistema bomba de insulina
Campo
Valor
Identificador
Bomba-de-insulina/Software-de-control/SRS3.3.2
Función
Calcula dosis de insulina — nivel seguro de azúcar
Descripción
Calcula la dosis de insulina que se va a suministrar cuando la medición del nivel de azúcar actual está en zona segura (entre 3 y 7 unidades)
Entradas
Lectura del azúcar actual (r2), las dos lecturas previas (r0 y r1)
Fuente
Lectura del azúcar actual del sensor. Otras lecturas de la memoria.
Salidas
CompDose — la dosis de insulina a administrar
Destino
Ciclo de control principal
Acción
CompDose es cero si es estable el nivel de azúcar, o cae, o si aumenta el nivel pero disminuye la tasa de aumento. Si el nivel se eleva y la tasa de aumento crece, CompDose se calcula al dividir la diferencia entre el nivel de azúcar actual y el nivel previo entre 4 y redondear el resultado. Si la suma se redondea a cero, CompDose se establece en la dosis mínima que puede entregarse.
Requerimientos
Dos lecturas previas, de modo que puede calcularse la tasa de cambio del nivel de azúcar.
Precondición
El depósito de insulina contiene al menos la dosis individual de insulina máxima permitida.
Postcondición
r0 se sustituye con r1, luego r1 se sustituye con r2.
Efectos colaterales
Ninguno

Ejemplo tabular complementario del libro (Figura 4.11, p. 98)
Sommerville también presenta la descripción tabular de condiciones como complemento a la especificación estructurada:
Condición
Acción
Nivel de azúcar en descenso (r2 < r1)
CompDose = 0
Nivel de azúcar estable (r2 = r1)
CompDose = 0
Nivel de azúcar creciente y tasa de incremento decreciente (r2−r1 < r1−r0)
CompDose = 0
Nivel de azúcar creciente y tasa de incremento estable o creciente (r2−r1 ≥ r1−r0)
CompDose = round((r2−r1)/4). Si resultado redondeado = 0, entonces CompDose = MinimumDose

Aplicación en el sistema: Usar notación tabular en el SRS para los RF que describen transiciones de estado (propuesto → aprobado → implementado), cálculo de la distribución MoSCoW, y reglas de escalada de versión del SRS (v0.X → v1.0 → v1.X → v2.0).

4.3 Especificaciones matemáticas / formales
(Cap. 4 §4.3, p. 95)
"En ocasiones, se usan especificaciones matemáticas formales con la finalidad de describir los requerimientos para sistemas de protección o seguridad críticos, aunque rara vez se usan en otras circunstancias."
— (Cap. 4 §4.3, p. 95)
Sommerville es explícito: las especificaciones formales son para sistemas críticos de seguridad, no para sistemas de gestión empresarial. No aplican al sistema austranet-cco.
Sin embargo, el concepto de precondiciones y postcondiciones sí es aplicable:
Precondición: Estado que debe ser verdadero antes de que el sistema ejecute la función. No es un supuesto vago; es un estado verificable del sistema.
Postcondición: Estado que es verdadero después de que la función se ejecuta exitosamente. Define exactamente qué cambió.
"Si se usa un enfoque funcional, una precondición establece lo que debe ser verdadero antes de llamar a la función, y una postcondición especifica lo que es verdadero después de llamar a la función."
— (Cap. 4 §4.3.2, p. 98)
Por qué las precondiciones/postcondiciones son superiores al texto libre:
Son binarias: La precondición se cumple o no se cumple. No hay zona gris.
Definen el contrato completo: El RF no solo describe "qué hace" la función, sino "cuándo puede hacerse" y "qué garantiza después de hacerlo".
Son directamente verificables por QA: Un caso de prueba puede definirse exactamente como "establecer la precondición → ejecutar → verificar la postcondición".
Detectan RF incompletos: Si no se puede escribir una precondición verificable, el RF tiene ambigüedades en su contexto de ejecución.
Ejemplo para el sistema:
text
RF-031: Cambio de estado del SRS a 'en_validacion'

Precondición:
  - SRS.estado == 'en_especificacion'
  - Todas las secciones del checklist §8 tienen estado == 'cumplido'
  - Al menos 1 RF de cada actor del diagrama de contexto
  - Al menos 3 RNF registrados
  - SRS.version coincide con patrón 'v0.X'

Postcondición:
  - SRS.estado == 'en_validacion'
  - SRS.fechaUltimaRevision == fecha actual
  - Se registra evento de transición en historial del SRS
  - Notificación enviada al gestor del proyecto


5. Estructura Completa del SRS Formal
(Cap. 4 §4.2, Figura 4.7, p. 93–94 · IEEE 830)
Esta es la tabla de contenidos oficial del SRS del sistema austranet-cco. Todas las secciones son obligatorias para que el SRS pueda transicionar a en_validacion.

PORTADA
Campo
Fuente
Obligatorio
Nombre del proyecto
Módulo 2 — campo nombre del proyecto
✅
Código del proyecto
Módulo 2 — campo codigo del proyecto
✅
Entidad cliente
Módulo 1 — nombre de la entidad cliente
✅
Versión del SRS
Campo version del tipo SRS (formato v0.X para borradores)
✅
Fecha de elaboración
Fecha de creación del SRS
✅
Elaborado por
Equipo del proyecto (analista + gestor)
✅
Estado
Borrador / En revisión / Aprobado
✅
Historial de versiones
Tabla: versión, fecha, autor, descripción del cambio
✅ desde v0.2

Quién redacta: Analista del proyecto.
Quién revisa: Gestor del proyecto.
Artefactos de entrada: M2-01 (datos del proyecto), M1-01 (entidad cliente).

SECCIÓN 1 — Introducción
"La Introducción describe la necesidad para el sistema. Debe detallar brevemente las funciones del sistema y explicar cómo funcionar con otros sistemas. También tiene que indicar cómo se ajusta el sistema en los objetivos empresariales o estratégicos globales de la organización que comisiona el software."
— (Cap. 4 §4.2, Figura 4.7, p. 93)
1.1 Propósito del documento
Quién leerá este SRS, para qué lo usará cada rol y qué compromisos establece. Indicar explícitamente que la versión v1.0 (firmada por el cliente) tiene validez contractual.
Redacta: Analista. Revisa: Gestor + Cliente.
1.2 Alcance del sistema
Los límites del sistema: qué hace y qué no hace. Importado directamente del diagrama de contexto de M3-03. Debe ser consistente con lo que el diagrama de contexto muestra: si un actor o sistema externo no aparece en el diagrama de contexto, no está en el alcance.
Redacta: Analista (basado en M3-03). Revisa: Gestor + Cliente.
1.3 Definiciones, acrónimos y abreviaciones
"El Glosario define los términos técnicos usados en el documento. No debe hacer conjeturas sobre la experiencia o la habilidad del lector."
— (Cap. 4 §4.2, Figura 4.7, p. 93)
Importado directamente del Glosario de Dominio de M1-03. Solo se incluyen aquí los términos que se usan en el cuerpo del SRS. El glosario completo va en Apéndice A.
Redacta: Analista. Artefacto de entrada: M1-03 (Glosario).
1.4 Referencias
Lista de todos los documentos que el SRS referencia:
M1-01: Registro de stakeholders del proyecto
M1-03: Glosario de dominio
M2-01: Ficha del proyecto
M3-03: Modelos del sistema (con URLs de cada artefacto)
Normas o estándares externos aplicables al dominio del proyecto
1.5 Visión general del documento
Descripción de la estructura del SRS: qué contiene cada sección y cómo leerlo según el rol del lector.

SECCIÓN 2 — Descripción General
"[El capítulo de arquitectura del sistema] presenta un panorama de alto nivel de la arquitectura anticipada del sistema, que muestra la distribución de funciones a través de los módulos del sistema."
— (Cap. 4 §4.2, Figura 4.7, p. 93)
2.1 Perspectiva del producto
¿Es un sistema nuevo o reemplaza a otro? ¿Cómo se relaciona con otros sistemas de la organización cliente?
Incluir el diagrama de contexto de M3-03 aquí, con descripción de cada sistema externo y la naturaleza de la interacción.
Redacta: Analista (basado en M3-03). Artefacto de entrada: Diagrama de contexto.
2.2 Funciones del producto
Resumen de alto nivel de las funcionalidades del sistema. Esta sección usa la lista de Must Have de MoSCoW (obtenida de M3-02). No es la especificación detallada de cada RF; es la descripción ejecutiva que el cliente puede leer en 5 minutos para confirmar que el sistema hace lo que necesita.
Redacta: Analista. Artefactos de entrada: Lista de requerimientos Must Have de M3-02.
2.3 Características de los usuarios
Descripción de los usuarios del sistema: quiénes son, cuál es su nivel técnico, con qué frecuencia usarán el sistema, en qué contexto operativo.
Importado de M1-01 (Stakeholders del proyecto, filtrado a los actores que interactúan directamente con el sistema).
Redacta: Analista. Artefacto de entrada: M1-01.
2.4 Restricciones generales
Factores que limitan el diseño e implementación, independientemente de los requerimientos funcionales:
Restricciones organizacionales: Políticas del cliente (ej: no se puede almacenar datos fuera del país).
Restricciones de hardware: Dispositivos en los que debe funcionar.
Restricciones regulatorias: Normas legales aplicables al dominio (ej: protección de datos personales en Chile — Ley 19.628).
Restricciones tecnológicas: Stack técnico obligatorio (Flutter, Firebase, Next.js, etc.).
Redacta: Analista (basado en entrevistas de M3-02 y datos del proyecto de M2-01).
2.5 Suposiciones y dependencias
"[La sección de Evolución del sistema] describe los supuestos fundamentales sobre los que se basa el sistema."
— (Cap. 4 §4.2, Figura 4.7, p. 93)
Condiciones que deben ser verdad para que el SRS sea válido:
"Se asume que el cliente proporcionará acceso al sistema XYZ existente para la integración."
"Se asume que los usuarios tendrán conectividad a Internet estable para acceder al sistema."
Si una suposición resulta falsa, el SRS debe revisarse porque parte de su contenido puede quedar invalidado.
2.6 Distribución de requerimientos
Qué funciones quedan fuera del alcance de esta versión y se planifican para versiones futuras (Won't Have de MoSCoW, con justificación y versión objetivo).
Artefacto de entrada: Lista Won't Have de M3-02.

SECCIÓN 3 — Requerimientos Funcionales
Esta sección contiene todos los RF del proyecto, organizados por actor o por módulo del sistema (preferir por actor para facilitar la lectura del cliente).
Para cada RF, aplicar la plantilla de M3-01 §9:
text
[CÓDIGO]: [TÍTULO]
Descripción: El sistema DEBE/DEBERÍA/PODRÁ [verbo] [objeto] [condición].
Actor: [Stakeholder de M1-01]
Precondición: [Estado del sistema verificable]
Postcondición: [Estado del sistema después de ejecutar]
Criterio de aceptación:
  DADO [contexto inicial]
  CUANDO [acción del actor]
  ENTONCES [resultado esperado del sistema]
Prioridad MoSCoW: [Must / Should / Could / Won't]
Fuente: [Stakeholder que solicitó este requerimiento — M1-01]
Estado: propuesto
Versión: 1

Ver M3-01 §9 para la plantilla completa de RF con todos los campos del tipo Requerimiento.
Quién redacta: Analista (formalizando requerimientos candidatos de M3-02).
Quién revisa: Gestor del proyecto + representante del cliente.

SECCIÓN 4 — Requerimientos No Funcionales
Organizados por categoría. Para cada RNF, la métrica es obligatoria: sin métrica, el RNF no puede verificarse y no puede incluirse en el SRS (regla de calidad §8.3).
Ver M3-01 §5 para definiciones de cada categoría de RNF.
4.1 Requerimientos de rendimiento
Ej: tiempo de respuesta, throughput, capacidad de usuarios concurrentes.
4.2 Requerimientos de seguridad
Ej: autenticación, autorización, cifrado, auditoría de accesos.
4.3 Requerimientos de disponibilidad
Ej: uptime mínimo, ventanas de mantenimiento permitidas.
4.4 Requerimientos de usabilidad
Ej: tiempo máximo de aprendizaje para usuarios nuevos, tasa de errores aceptable.
4.5 Requerimientos de mantenibilidad
Ej: cobertura mínima de tests, tiempo máximo de diagnóstico de un bug en producción.
4.6 Requerimientos de portabilidad
Ej: navegadores soportados, versiones mínimas de OS para app móvil.
4.7 Requerimientos de cumplimiento / legales
Ej: cumplimiento con Ley 19.628 (datos personales Chile), GDPR si aplica, estándares de accesibilidad WCAG 2.1.
Quién redacta: Analista (identificando RNF de candidatos de M3-02 y de requisitos implícitos del tipo de proyecto).
Quién revisa: Ingeniero de sistemas (arquitecto) + Cliente para los legales/regulatorios.

SECCIÓN 5 — Requerimientos de Interfaz
"[En la especificación de requerimientos del sistema pueden definirse] las interfaces a otros sistemas."
— (Cap. 4 §4.2, Figura 4.7, p. 93)
5.1 Interfaces de usuario
Descripción de las pantallas y flujos principales del sistema. No es el diseño visual (eso es competencia del diseño); es la especificación de qué información debe presentarse y qué acciones deben estar disponibles en cada interfaz. Puede referenciar wireframes del M3-03 si existen como artefactos de modelado.
5.2 Interfaces de hardware
Dispositivos con los que el sistema debe interactuar: lectores de QR, impresoras, cámaras, sensores. Especificar protocolos y estándares si aplica.
5.3 Interfaces de software
APIs externas, servicios de terceros e integraciones:
Nombre del servicio/API
Propósito de la integración
Datos que fluyen en cada dirección
Protocolo (REST, GraphQL, WebSocket, etc.)
Autenticación requerida
Artefacto de entrada: Diagrama de contexto de M3-03 (sistemas externos identificados).
5.4 Interfaces de comunicación
Protocolos de comunicación del sistema: HTTPS, WebSockets, push notifications, correo electrónico transaccional. Incluir requisitos de cifrado y certificados.

SECCIÓN 6 — Restricciones de Diseño
"[Los requerimientos del sistema] tal vez se tenga que diseñar una arquitectura inicial del sistema para ayudar a estructurar la especificación de requerimientos."
— (Cap. 4 §4.3, p. 95)
Tecnologías obligatorias, estándares que el equipo debe respetar y limitaciones que el cliente impone sobre la implementación:
Stack tecnológico obligatorio (ej: Flutter para móvil, Next.js para web, Firebase para backend).
Estándares de código o seguridad que el cliente exige.
Limitaciones de hardware del entorno del cliente (ej: servidores on-premise con specs limitadas).
Restricciones de terceros (ej: "no se puede usar AWS, solo GCP").
Artefacto de entrada: M2-01 (restricciones del proyecto definidas en el Módulo 2).

SECCIÓN 7 — Modelos del Sistema
"[Los Modelos del sistema] pueden incluir modelos gráficos del sistema que muestren las relaciones entre componentes del sistema, el sistema y su entorno."
— (Cap. 4 §4.2, Figura 4.7, p. 93)
Índice de todos los artefactos de modelado producidos en M3-03, con referencia/URL y descripción de qué muestra cada uno:
Artefacto
Tipo
Descripción
URL / Referencia
Diagrama de contexto
Modelo de contexto
Límites del sistema y actores externos
[URL o ID en sistema]
Casos de uso
Modelo de interacción
Interacciones actor-sistema
[URL o ID en sistema]
Modelo de dominio
Modelo de estructura
Entidades y relaciones del dominio
[URL o ID en sistema]
Diagramas de estado
Modelo de comportamiento
Ciclos de vida de entidades clave
[URL o ID en sistema]

Artefacto de entrada: M3-03 (todos los modelos producidos).

SECCIÓN 8 — Apéndices
"Los Apéndices brindan información específica y detallada que se relaciona con la aplicación a desarrollar."
— (Cap. 4 §4.2, Figura 4.7, p. 94)
Apéndice A — Glosario de Dominio Completo
Importado de M1-03. Todos los términos del dominio del negocio del cliente, definidos en el idioma del cliente.
Apéndice B — Stakeholders del Proyecto
Importado de M1-01. Tabla completa de stakeholders con nombre, rol, nivel de influencia y necesidad principal.
Apéndice C — Registro de Cambios al SRS
Historial de todos los cambios realizados al SRS después de v0.1, con fecha, autor, descripción del cambio y referencia a la solicitud de cambio que lo originó.
Apéndice D — Requerimientos Diferidos
Lista de los Won't Have con justificación escrita y versión objetivo de implementación. Esta sección es obligatoria: los requerimientos diferidos sin justificación ni versión objetivo son un riesgo de conflicto futuro con el cliente.

6. Matriz de Trazabilidad
(Cap. 4 §4.7.1, p. 112–113 — Administración de requerimientos)
6.1 Definición
Sommerville define la trazabilidad en el contexto de la administración de requerimientos:
"Es necesario seguir la huella de las relaciones entre requerimientos, sus fuentes y el diseño del sistema, de modo que usted pueda analizar las razones para los cambios propuestos, así como el efecto que dichos cambios tengan probablemente sobre otras partes del sistema."
— (Cap. 4 §4.7, p. 114)
Y más específicamente en la planeación de la administración:
"Políticas de seguimiento: dichas políticas definen las relaciones entre cada requerimiento, así como entre los requerimientos y el diseño del sistema que debe registrarse."
— (Cap. 4 §4.7.1, p. 113)
La trazabilidad es crítica para el mantenimiento porque permite responder: "¿Qué pasa si cambio este requerimiento?" — identificando todos los componentes, casos de prueba y otros requerimientos que se verán afectados.
6.2 Matriz de trazabilidad hacia atrás
RF → stakeholder que lo solicitó → objetivo de negocio que satisface.
Permite responder: "¿Por qué existe este requerimiento?" Cuando un cliente propone eliminar un RF, esta matriz muestra a qué objetivo de negocio está vinculado.
6.3 Matriz de trazabilidad hacia adelante
RF → componente del sistema donde se implementará → caso de prueba que lo verifica.
Permite responder: "¿Qué debo probar para verificar que este RF está implementado?"
6.4 Por qué mantenerla actualizada es costoso pero necesario
"Las herramientas de apoyo para el seguimiento permiten la identificación de requerimientos relacionados."
— (Cap. 4 §4.7.1, p. 113)
Mantener la matriz manualmente es costoso en proyectos grandes. Pero sin ella, cuando un requerimiento cambia durante el mantenimiento, es imposible identificar el efecto completo del cambio. El costo de no tenerla (errores de mantenimiento, cambios que rompen funcionalidad existente) supera el costo de mantenerla.
Herramientas recomendadas por Sommerville (Cap. 4 §4.7.1, p. 113):
Sistemas especializados de administración de requerimientos.
Hojas de cálculo y bases de datos para proyectos pequeños.
Herramientas con procesamiento de lenguaje natural para descubrir relaciones entre requerimientos.
6.5 Plantilla de la Matriz de Trazabilidad del sistema austranet-cco
Código RF
Título
Stakeholder fuente
Módulo sistema
Caso de prueba
Estado
RF-001
Login de usuario
Admin TI cliente
Auth Module
CP-001
Aprobado
RF-002
Registrar proyecto
Gestor proyecto
Módulo 2 — Proyectos
CP-002
Aprobado
RF-003
Agregar requerimiento candidato
Analista
Módulo 3 — SRS
CP-003
Propuesto
RF-004
Cambiar estado del SRS
Gestor proyecto
Módulo 3 — SRS
CP-004
Propuesto
RF-005
Exportar SRS como PDF
Cliente / Gestor
Módulo 3 — SRS
CP-005
Diferido
...
...
...
...
...
...

Aplicación en el sistema: El campo matrizTrazabilidad del tipo SRS (propuesto en §10) implementa esta matriz como array de objetos Trazabilidad. El sistema genera automáticamente las filas a partir de la relación RF → fuente (M1-01) ya registrada en cada Requerimiento.

7. Gestión de Versiones del SRS
(Cap. 4 §4.7 · Cap. 25 §25.1)
7.1 Política de versionado del SRS
Versión
Estado
Significado
Quién puede crear
v0.1
en_especificacion
Primera estructura del SRS con secciones pero incompleto
Analista
v0.X (X ≥ 2)
en_especificacion
Borrador evolucionando durante el proceso de especificación
Analista
v0.X
en_validacion
Borrador enviado al cliente para validación
Gestor (al transicionar estado)
v1.0
aprobado
Primera versión aprobada por el cliente. El cliente firma este documento. Tiene validez contractual.
Solo se crea cuando el cliente aprueba formalmente
v1.X (X ≥ 1)
aprobado
Cambio menor al SRS aprobado (ver §7.2)
Gestor + aprobación del cliente
v2.0
aprobado
Cambio mayor al SRS (cambio de alcance)
Admin del sistema + aprobación formal del cliente

7.2 Qué constituye un cambio mayor vs. menor
Tipo de cambio
Versión
Ejemplos
Cambio menor (v1.X)
Incremento de minor
Corrección de descripción ambigua sin cambiar la funcionalidad. Agregar un criterio de aceptación faltante. Añadir un RNF de categoría existente. Corregir un RF de prioridad Should/Could.
Cambio mayor (v2.0)
Incremento de major
Agregar o eliminar un módulo completo del sistema. Cambiar la prioridad de un RF de Must Have a Won't Have o viceversa. Cambiar restricciones de diseño que afectan la arquitectura. Agregar un actor nuevo al diagrama de contexto. Cambiar el alcance del sistema (Sección 1.2).

Regla fundamental: El cliente firma v1.0. Cualquier cambio post-firma que incremente la versión (v1.X o v2.0) tiene impacto contractual y debe seguir el proceso formal de cambio.
7.3 Proceso de cambio al SRS aprobado
(Cap. 4 §4.7.2, Figura 4.18, p. 113–114 · Cap. 25 §25.1)
Sommerville define el proceso de administración del cambio de tres etapas:
"1. Análisis del problema y especificación del cambio [...] 2. Análisis del cambio y estimación del costo [...] 3. Implementación del cambio."
— (Cap. 4 §4.7.2, p. 114)
Adaptado al sistema:
text
SOLICITUD DE CAMBIO (cualquier stakeholder)
    ↓
REGISTRO en el sistema (campo observaciones + nueva entrada en historialVersiones)
    ↓
ANÁLISIS DE IMPACTO por el analista:
  - ¿Qué RF se ven afectados?
  - ¿Qué módulos del sistema cambian?
  - ¿Qué casos de prueba deben actualizarse?
  - ¿Es cambio menor o mayor?
    ↓
APROBACIÓN:
  - Cambio menor (v1.X): Gestor del proyecto aprueba
  - Cambio mayor (v2.0): Admin del sistema + aprobación formal del cliente
    ↓
ACTUALIZACIÓN del SRS:
  - Nueva versión creada (no se sobreescribe la anterior)
  - SRS anterior queda archivado con estado 'version_anterior'
  - Apéndice C actualizado con registro del cambio
    ↓
NOTIFICACIÓN al equipo de desarrollo de los RF afectados

"Si un nuevo requerimiento tiene que implementarse urgentemente, siempre existe la tentación para cambiar el sistema y luego modificar de manera retrospectiva el documento de requerimientos. Hay que tratar de evitar esto."
— (Cap. 4 §4.7.2, p. 114)
7.4 Archivado de versiones anteriores
Todas las versiones del SRS se retienen permanentemente en Firestore. Ninguna versión se elimina. La política es:
v0.X: Retención indefinida como historial del proceso de especificación.
v1.0: Retención permanente obligatoria — es el documento que el cliente firmó.
v1.X y v2.0: Retención permanente — cada versión representa un acuerdo contractual.
El campo historialVersiones del tipo SRS (propuesto en §10) implementa este archivado como array inmutable de objetos VersionSRS.

8. Reglas de Calidad del SRS
(Cap. 4 §4.6, p. 110 — Validación de requerimientos)
Estas reglas son la puerta de entrada al estado en_validacion. Ningún SRS puede transicionar a en_validacion con items sin cumplir.
Sommerville establece las comprobaciones que deben realizarse durante la validación:
"Durante el proceso de validación de requerimientos, tienen que realizarse diferentes tipos de comprobaciones sobre los requerimientos contenidos en el documento de requerimientos."
— (Cap. 4 §4.6, p. 110)
Las comprobaciones son: validez, consistencia, totalidad, realismo y verificabilidad (Cap. 4 §4.6, p. 110). Este checklist las operacionaliza:

8.1 Completitud del SRS
("Comprobaciones de totalidad" — Cap. 4 §4.6, p. 110)
S1 — Todas las secciones de la Estructura §5 están presentes con contenido sustantivo (no vacías ni con "pendiente").
S2 — Todos los actores del diagrama de contexto (M3-03) tienen al menos 1 RF asociado en la Sección 3.
S3 — Todos los stakeholders con nivel de influencia 'alta' (M1-01) tienen al menos 1 RF que responde a su necesidad principal.
S4 — Cada RF con prioridad Must Have tiene criterio de aceptación en formato DADO/CUANDO/ENTONCES.
S5 — Cada RNF tiene métrica cuantificable definida (no "rápido", sino "< 2 segundos bajo carga de 100 usuarios concurrentes").
S6 — El Apéndice A (Glosario) tiene al menos 10 términos definidos (regla M1-07).
S7 — La Sección 7 (Modelos) referencia al menos el diagrama de contexto adjunto.
S8 — Todas las secciones obligatorias de la Portada están completas.

8.2 Consistencia del SRS
("Comprobaciones de consistencia" — Cap. 4 §4.6, p. 110)
C1 — No hay dos RF con el mismo código.
C2 — Los actores mencionados en la Sección 3 coinciden exactamente con los stakeholders registrados en M1-01.
C3 — Los términos del Glosario (Apéndice A) se usan consistentemente en todo el documento (sin sinónimos no definidos).
C4 — No hay dos RF Must Have que se contradigan entre sí (funcionalidad excluyente sin resolución documentada).
C5 — Los RNF de rendimiento son compatibles con los RNF de seguridad. Si hay tensión entre ellos, está documentada con la decisión de diseño tomada.
C6 — La versión del SRS en la Portada coincide con el campo version del registro en Firestore.

8.3 Verificabilidad del SRS
("Verificabilidad" — Cap. 4 §4.6, p. 110)
"Los requerimientos del sistema deben escribirse siempre de manera que sean verificables. Esto significa que usted debe ser capaz de escribir un conjunto de pruebas que demuestren que el sistema entregado cumpla cada requerimiento especificado."
— (Cap. 4 §4.6, p. 110)
V1 — Cada RF puede verificarse con una prueba concreta (test funcional o de aceptación).
V2 — Los RNF tienen métrica Y método de medición definidos (ej: "< 2 segundos medidos con Lighthouse bajo 4G simulado").
V3 — Los criterios de aceptación son binarios: pasan o no pasan. No contienen "depende del contexto" ni "a criterio del usuario".
V4 — Las precondiciones de los RF son estados del sistema verificables (no suposiciones vagas como "el usuario debe estar familiarizado con el sistema").
V5 — No hay RF cuya descripción contenga palabras de la lista de alerta del §4.1 sin justificación explícita de por qué no pueden evitarse.

8.4 Distribución MoSCoW
("Comprobaciones de realismo" — Cap. 4 §4.6, p. 110)
"Los requerimientos deben comprobarse para garantizar que en realidad pueden implementarse [...] teniendo en cuenta el presupuesto y la fecha para el desarrollo del sistema."
— (Cap. 4 §4.6, p. 110)
M1 — Al menos 60% del esfuerzo estimado está asignado a RF Must Have.
M2 — No más del 20% del total de RF es Could Have.
M3 — Cada RF con prioridad Won't Have tiene justificación escrita (por qué no en esta versión) y versión objetivo (en qué versión futura se considerará).
M4 — El total de RF Must Have es implementable dentro del presupuesto y plazo estimados en M2-02. Si no lo es, se debe re-priorizar antes de avanzar.

9. Proceso Operativo: Fase en_especificacion
El analista ejecuta los siguientes pasos en orden. Cada paso tiene un criterio de salida verificable.

PASO 1 — Preparar la estructura del SRS
Objetivo: Tener la estructura vacía del SRS creada en el sistema, con portada y Sección 1 completas.
Acciones:
Crear el registro SRS en el sistema con estado en_especificacion y versión v0.1.
Completar la Portada con datos de M2-01 (nombre, código del proyecto) y M1-01 (entidad cliente).
Redactar la Sección 1.1 (Propósito) y Sección 1.2 (Alcance) basándose en el diagrama de contexto de M3-03.
Importar el Glosario de M1-03 → Apéndice A y Sección 1.3 (extracto de términos usados en el documento).
Importar Stakeholders de M1-01 → Apéndice B y Sección 2.3.
Criterio de salida: Portada completa, Sección 1 completa, Apéndices A y B importados.

PASO 2 — Formalizar los RF
Objetivo: Convertir todos los requerimientos candidatos propuesto en RF formales de la Sección 3.
Acciones:
Para cada requerimiento candidato con tipo funcional y estado propuesto (de M3-02):
Asignar código único (formato: RF-XXX con tres dígitos).
Redactar título corto (máx. 10 palabras).
Escribir descripción con vocabulario controlado DEBE/DEBERÍA/PODRÁ (Directriz 2, §4.1).
Verificar contra lista de palabras de alerta (Directriz 8, §4.1).
Redactar precondición y postcondición (formato §4.3).
Redactar criterio de aceptación DADO/CUANDO/ENTONCES.
Asignar prioridad MoSCoW.
Registrar stakeholder fuente (de M1-01).
Organizar los RF en la Sección 3 agrupados por actor o módulo del sistema.
Cambiar estado de cada requerimiento de propuesto a aprobado (internamente, dentro del proceso de especificación) o marcarlo como rechazado con justificación.
Criterio de salida: Todos los RF candidatos procesados, Sección 3 del SRS poblada.

PASO 3 — Formalizar los RNF
Objetivo: Tener todos los RNF con métrica cuantificable en la Sección 4.
Acciones:
Identificar RNF de los requerimientos candidatos tipo no_funcional de M3-02.
Identificar RNF implícitos del tipo de proyecto (seguridad, disponibilidad, cumplimiento legal).
Para cada RNF: aplicar plantilla de M3-01 §9 con métrica obligatoria.
Categorizar en las subsecciones 4.1–4.7.
Verificar que no haya RNF sin métrica (checklist V2 de §8.3).
Criterio de salida: Sección 4 completa con al menos 3 RNF, todos con métrica.

PASO 4 — Completar secciones de contexto
Objetivo: Tener las secciones 2, 5, 6 y 7 del SRS completas.
Acciones:
Sección 2: Completar con datos de M2-01 (perspectiva del producto), lista Must Have (funciones del producto), stakeholders de M1-01 (características de usuarios), restricciones del proyecto (generales), suposiciones (basadas en entrevistas de M3-02), Won't Have (distribución de requerimientos).
Sección 5: Interfaces identificadas en el diagrama de contexto de M3-03.
Sección 6: Restricciones tecnológicas del proyecto de M2-01.
Sección 7: Índice de todos los modelos de M3-03 con URL/ID y descripción.
Criterio de salida: Secciones 2, 5, 6 y 7 con contenido. Ninguna subsección vacía.

PASO 5 — Construir la Matriz de Trazabilidad
Objetivo: Tener la trazabilidad RF → stakeholder → módulo documentada.
Acciones:
Para cada RF de la Sección 3: registrar el stakeholder fuente (M1-01) en la matriz.
Para cada RF: asignar el módulo del sistema donde se implementará.
Dejar columna "Caso de prueba" vacía por ahora (se completa en la fase de validación por el equipo de QA).
Criterio de salida: Matriz de trazabilidad con una fila por cada RF registrado.

PASO 6 — Verificar reglas de calidad
Objetivo: Pasar el checklist completo de la Sección 8 sin ítem fallido.
Acciones:
Ejecutar cada ítem del checklist §8.1 (completitud).
Ejecutar cada ítem del checklist §8.2 (consistencia).
Ejecutar cada ítem del checklist §8.3 (verificabilidad).
Ejecutar cada ítem del checklist §8.4 (distribución MoSCoW).
Resolver todos los ítems en estado "no cumple" antes de avanzar.
Criterio de salida: Los 21 ítems del checklist (S1-S8, C1-C6, V1-V5, M1-M4) están en estado "cumplido".

PASO 7 — Criterio para avanzar a en_validacion
El analista puede solicitar la transición del SRS al estado en_validacion únicamente cuando se cumplen todas las condiciones siguientes de forma simultánea. Este paso es irreversible sin pasar por el proceso de cambio de §7.3.
Condiciones técnicas del SRS (verificables en el sistema):
Los 21 ítems del checklist de la Sección 8 están marcados como cumplido (S1–S8, C1–C6, V1–V5, M1–M4).
Al menos 1 RF para cada actor identificado en el diagrama de contexto de M3-03.
Al menos 3 RNF en total, todos con métrica cuantificable.
La versión del SRS corresponde al patrón v0.X (borrador). No puede transicionar si ya está en v1.0.
La matriz de trazabilidad tiene una fila por cada RF registrado.
Condiciones de proceso (verificadas por el gestor):
El gestor del proyecto (Módulo 2) ha realizado una revisión previa del borrador y no tiene observaciones de consistencia estructural pendientes.
Todos los requerimientos candidatos de M3-02 han sido procesados: cada uno tiene estado aprobado, rechazado o diferido. No quedan en estado propuesto.
El Apéndice D está completo: todos los requerimientos con estado diferido tienen justificación escrita y versión objetivo.
Acción del sistema al transicionar:
text
SRS.estado: 'en_especificacion' → 'en_validacion'
SRS.version: 'v0.X' (se incrementa el minor: v0.2 → v0.3, etc.)
SRS.fechaUltimaRevision: fecha actual
Se registra evento de transición en SRS.historialVersiones
Se genera notificación al gestor del proyecto y al representante del cliente

"La validación de requerimientos es importante porque los errores en un documento de requerimientos pueden conducir a grandes costos por tener que rehacer, cuando dichos problemas se descubren durante el desarrollo del sistema o después de que éste se halla en servicio. En general, el costo por corregir un problema de requerimientos al hacer un cambio en el sistema es mucho mayor que reparar los errores de diseño o codificación."
— (Cap. 4 §4.6, p. 110)
Aplicación en el sistema: Este paso 7 se implementa como una transacción atómica en Firestore: el sistema verifica programáticamente las condiciones técnicas antes de permitir el cambio de estado. Las condiciones de proceso requieren confirmación explícita del gestor. Si alguna condición no se cumple, el sistema rechaza la transición y muestra el ítem específico que falla.

10. Plantilla Operativa Extendida: Tipo SRS en el Sistema
Extensión del tipo SRS existente con los campos adicionales que el proceso operativo requiere. Los campos marcados PROPUESTO v2 son adiciones que este archivo justifica; los demás ya existen en el modelo de datos actual.
Campo
Estado
Tipo
Descripción
Justificación
id
Existe
string
UUID del SRS
Identificación única en Firestore
proyectoId
Existe
string
Proyecto al que pertenece
Trazabilidad con Módulo 2
version
Existe
string
Versión semántica (v0.X, v1.0, v1.X, v2.0)
Política de versiones §7
estado
Existe
EstadoSRS
Ciclo de vida del SRS
M3-01 §6
requerimientos
Existe
Requerimiento[]
Lista de RF / RNF / dominio
M3-01 §3
fechaUltimaRevision
Existe
Date?
Última actualización
Auditoría
aprobadoPor
Existe
string?
Stakeholder que firmó v1.0
Proceso de aprobación §7
fechaAprobacion
Existe
Date?
Fecha de firma del cliente
Validez contractual
observaciones
Existe
string?
Notas generales del analista
Flexibilidad operativa
creadoEn
Existe
Date
Fecha de creación del SRS
Auditoría
actualizadoEn
Existe
Date
Última modificación
Auditoría
seccionesCompletadas
PROPUESTO v2
string[]
Array de IDs de sección con contenido completo (['portada', 's1', 's2', ...])
Sección 8.1 — verificación de completitud por sección
checklistCalidad
PROPUESTO v2
ChecklistItem[]
Estado de cada ítem del checklist §8 ({ id: string, estado: 'cumplido' | 'pendiente' | 'no_aplica', nota?: string })
Sección 8 — puerta de entrada a en_validacion
matrizTrazabilidad
PROPUESTO v2
Trazabilidad[]
Array de { codigoRF, stakeholderFuente, moduloSistema, casoPrueba?, estado }
Sección 6 — trazabilidad RF → stakeholder → módulo
modelosAdjuntos
PROPUESTO v2
ArtefactoModelo[]
Array de { nombre, tipo, descripcion, url, artefactoId } — importado de M3-03
Sección 5 §7 del SRS — índice de modelos
distribucionMoSCoW
PROPUESTO v2
DistribucionMoSCoW
{ must: number, should: number, could: number, wont: number, totalEsfuerzoMust: number } — calculado automáticamente
Sección 8.4 — regla M1 y M2
nivelCalidad
PROPUESTO v2
'borrador' | 'revision' | 'aprobado'
Estado de madurez del SRS independiente del ciclo de vida contractual
Sección 8 — comunicar calidad actual al equipo
historialVersiones
PROPUESTO v2
VersionSRS[]
Array inmutable de { version, fecha, autor, descripcionCambio, aprobadoPor?, tipoVersion: 'borrador' | 'menor' | 'mayor' }
Sección 7 — archivado permanente de versiones
solicitudesCambio
PROPUESTO v2
SolicitudCambioSRS[]
Array de { id, fecha, solicitante, descripcion, impactoAnalizado, estado, versionResultante? }
Sección 7.3 — proceso formal de cambio post-aprobación

Subtipos nuevos requeridos:
typescript
interface Trazabilidad {
  codigoRF: string           // FK → Requerimiento.codigo
  stakeholderFuente: string  // FK → Stakeholder.id (M1-01)
  moduloSistema: string      // Módulo del sistema que implementa el RF
  casoPrueba?: string        // CP-XXX — se completa en fase de validación
  estado: 'propuesto' | 'aprobado' | 'implementado' | 'verificado'
}

interface VersionSRS {
  version: string            // 'v0.1', 'v1.0', etc.
  fecha: Date
  autor: string              // userId del analista o gestor
  descripcionCambio: string  // qué cambió respecto a versión anterior
  aprobadoPor?: string       // solo para v1.0 en adelante
  tipoVersion: 'borrador' | 'menor' | 'mayor'
  snapshotSRSId?: string     // referencia al documento archivado en Firestore
}

interface DistribucionMoSCoW {
  must: number               // cantidad de RF Must Have
  should: number
  could: number
  wont: number
  totalEsfuerzoMust: number  // porcentaje del esfuerzo total en Must Have
  esValida: boolean          // true si cumple reglas M1-M4 de §8.4
}


11. Cierre del Módulo 3 — Vista Anticipada
Este archivo completa la especificación formal del SRS. Lo que sigue en el Módulo 3:
M3-05 — Validación del SRS con el Cliente
Cubre el estado en_validacion y el estado con_observaciones. Define:
El proceso de revisión del SRS con el cliente (Cap. 4 §4.6 — técnicas de validación: revisiones, prototipos, generación de casos de prueba).
Cómo gestionar las observaciones del cliente y qué constituye una observación que requiere cambio vs. una que es aclaración sin impacto en el SRS.
El ciclo en_validacion → con_observaciones → en_validacion hasta llegar a la aprobación.
La firma del cliente que convierte el SRS de v0.X a v1.0 y cambia el estado a aprobado.
M3-06 — Calidad y KPIs del SRS
Cubre las métricas del proceso de IR y del documento final:
Tiempo promedio en estado en_especificacion.
Tasa de RF rechazados vs. aprobados por ciclo de validación.
Número de observaciones del cliente en la primera ronda de validación (indicador de calidad del proceso de especificación).
Densidad de RF Must Have por módulo del sistema.
Transición del Proyecto al Desarrollo
La aprobación del SRS (estado aprobado, versión v1.0) activa en el sistema la transición del proyecto de activo_en_definicion a activo_en_desarrollo.
Esto se referencia en M2-04 Sección 5.2 y es el evento más importante del ciclo de vida del proyecto en el sistema: a partir de ese momento, el SRS es el contrato firmado y cualquier cambio tiene implicaciones contractuales que activan el proceso formal de cambio de §7.3.
text
SRS.estado → 'aprobado'
SRS.version → 'v1.0'
SRS.aprobadoPor → id del representante del cliente
SRS.fechaAprobacion → fecha actual
       ↓
Proyecto.estado: 'activo_en_definicion' → 'activo_en_desarrollo'
Proyecto.fechaInicioDesarrollo → fecha actual
Notificación al equipo de desarrollo: "SRS v1.0 aprobado — desarrollo autorizado"


12. Tabla de Conexiones con los 3 Módulos
Concepto / Sección del SRS
Módulo
Campo o proceso que lo alimenta
Nombre del proyecto (Portada)
Módulo 2
Proyecto.nombre
Código del proyecto (Portada)
Módulo 2
Proyecto.codigo
Entidad cliente (Portada)
Módulo 1
Entidad.nombre — entidad tipo cliente
Propósito y alcance (§1.1, §1.2)
Módulo 3
Diagrama de contexto — M3-03
Glosario de dominio (§1.3, Apéndice A)
Módulo 1
GlosarioDominio — M1-03
Características de usuarios (§2.3, Apéndice B)
Módulo 1
Stakeholder[] con nivel de influencia — M1-01
Funciones del producto — Must Have (§2.2)
Módulo 3
Requerimientos candidatos prioridad must — M3-02
Requerimientos diferidos — Won't Have (§2.6, Apéndice D)
Módulo 3
Requerimientos candidatos prioridad wont — M3-02
Restricciones generales (§2.4)
Módulo 2
Proyecto.restricciones — M2-01
Suposiciones y dependencias (§2.5)
Módulo 2 + 3
Entrevistas de M3-02 + datos M2-01
RF completos (Sección 3)
Módulo 3
Requerimientos candidatos tipo funcional formalizados — M3-02
RNF con métrica (Sección 4)
Módulo 3
Requerimientos candidatos tipo no_funcional — M3-02
Interfaces de sistema (Sección 5)
Módulo 3
Sistemas externos del diagrama de contexto — M3-03
Restricciones de diseño (Sección 6)
Módulo 2
Stack tecnológico y restricciones del proyecto — M2-01
Índice de modelos (Sección 7)
Módulo 3
Artefactos de modelado — M3-03
Trazabilidad RF → stakeholder
Módulo 1 + 3
Stakeholder.id (M1-01) + Requerimiento.fuente (M3)
Trazabilidad RF → módulo sistema
Módulo 2 + 3
Arquitectura del proyecto (M2) + asignación del analista
Versionado del SRS
Módulo 3
SRS.historialVersiones + proceso M1-06 (control config.)
Transición a desarrollo
Módulo 2
Proyecto.estado → M2-04 §5.2
Calidad del proceso IR
Módulo 3
KPIs y métricas — M3-06


13. Checklist de Completitud del Archivo
Todos los ítems extraídos del libro y del prompt están cubiertos:
Marco teórico (Cap. 4)
Definición del documento de requerimientos (Cap. 4 §4.2, p. 91)
5 propiedades de un buen SRS: claro, sin ambigüedades, comprensible, completo, consistente
Tabla completa de usuarios del SRS con roles (Cap. 4 §4.2, Figura 4.6, p. 92)
El problema del SRS en proyectos ágiles con clientes externos (Cap. 4 §4.2, p. 92–93)
Evolución inevitable del SRS y causas del cambio (Cap. 4 §4.7, p. 111–112)
5 directrices de escritura de RF en lenguaje natural (Cap. 4 §4.3.1, p. 96–97)
Vocabulario controlado DEBE/DEBERÍA/PODRÁ con tabla de correspondencia MoSCoW
Tipos de ambigüedad lingüística en RF con tabla y ejemplos
Lista de palabras de alerta para detección automática
Definición de especificación estructurada / tabular (Cap. 4 §4.3.2, p. 97)
Cuándo usar tablas vs. texto libre (criterios)
Estructura completa de la plantilla tabular (Figura 4.10, p. 97)
Ejemplo completo del libro: bomba de insulina (Figura 4.10 y 4.11, p. 97–98)
Especificaciones formales: solo para sistemas críticos (Cap. 4 §4.3, p. 95)
Precondiciones y postcondiciones: definición y superioridad sobre texto libre
5 comprobaciones de validación de requerimientos (Cap. 4 §4.6, p. 110)
3 técnicas de validación: revisiones, prototipos, generación de pruebas (Cap. 4 §4.6, p. 111)
3 etapas del proceso de administración del cambio (Cap. 4 §4.7.2, p. 113–114)
4 componentes de la planeación de administración de requerimientos (Cap. 4 §4.7.1, p. 113)
Seguimiento de requerimientos: definición y necesidad (Cap. 4 §4.7, p. 114)
Estructura y proceso operativo
Portada del SRS con todos los campos y fuentes
Sección 1 — Introducción (5 subsecciones con fuentes y responsables)
Sección 2 — Descripción General (6 subsecciones con fuentes y responsables)
Sección 3 — Requerimientos Funcionales (con referencia a plantilla M3-01 §9)
Sección 4 — Requerimientos No Funcionales (7 categorías)
Sección 5 — Requerimientos de Interfaz (4 subsecciones)
Sección 6 — Restricciones de Diseño
Sección 7 — Modelos del Sistema (con tabla de índice)
Sección 8 — Apéndices A, B, C, D
Reglas de calidad (puerta en_validacion)
§8.1 Completitud: 8 ítems verificables (S1–S8)
§8.2 Consistencia: 6 ítems verificables (C1–C6)
§8.3 Verificabilidad: 5 ítems verificables (V1–V5)
§8.4 Distribución MoSCoW: 4 ítems verificables (M1–M4)
Proceso operativo
Paso 1 — Preparar estructura del SRS
Paso 2 — Formalizar RF
Paso 3 — Formalizar RNF
Paso 4 — Completar secciones de contexto
Paso 5 — Construir matriz de trazabilidad
Paso 6 — Verificar reglas de calidad
Paso 7 — Criterio para avanzar a en_validacion
Política de versiones
v0.X → v1.0 → v1.X → v2.0 con criterios exactos
Cambio menor vs. mayor: tabla de criterios
Proceso formal de cambio post-aprobación (3 etapas)
Quién aprueba cambios según tipo (gestor vs. admin + cliente)
Política de retención permanente de versiones en Firestore
Plantilla operativa extendida
Todos los campos existentes del tipo SRS
8 campos nuevos PROPUESTO v2 con tipo, descripción y justificación
Subtipos Trazabilidad, VersionSRS, DistribucionMoSCoW definidos
Conexiones con los 3 módulos
Tabla completa de 18 conexiones Concepto → Módulo → Campo/proceso

Fin del archivo M3-04-especificacion-srs.md
Versión 1.0 — 2026-02-25
Siguiente: M3-05-validacion-srs.md

Referencias canónicas de este archivo:
Sommerville, I. (2011). Ingeniería de Software (9ª ed.). Pearson.
Cap. 4 §4.2 (p. 91–94) · §4.3 (p. 94–98) · §4.6 (p. 110–111) · §4.7 (p. 111–114)
IEEE Std 830 (referenciado en Sommerville, Cap. 4, p. 93)

