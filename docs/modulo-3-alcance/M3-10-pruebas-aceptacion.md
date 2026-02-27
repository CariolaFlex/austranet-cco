M3-10-pruebas-aceptacion.md
1. Metadatos
Campo	Valor
Nombre del archivo	M3-10-pruebas-aceptacion.md
Módulo	Módulo 3 — Documentación de Objetivos y Alcance (SRS)
Posición	Archivo 10 de 10 del Módulo 3 — Cierre formal del ciclo especificación → prueba
Capítulos fuente (Sommerville)	Cap. 8 completo: §8.1 (Pruebas de desarrollo), §8.2 (TDD), §8.3 (Pruebas de versión), §8.4 (Pruebas de usuario y aceptación)
Libro	Sommerville, Ian. Ingeniería de Software, 9.ª edición. Pearson Educación, 2011
Versión	1.0.0
Fecha	2026-02-26
Estado del proyecto cubierto	activo_en_desarrollo → completado (pruebas ocurren durante y al cierre)
Depende de	M3-04 (criterios de aceptación del SRS), M3-05 (validación del SRS), M3-09 (trazabilidad RF → CP)
Conecta con	M2-04 (defectos impactan plan), M2-07 (metodología determina estrategia de pruebas), M2-08 (KPIs de pruebas → mejora futura)
2. Objetivo del Documento
2.1 Cierre del ciclo de especificación → prueba
Este es el archivo de cierre del Módulo 3 y del ciclo completo de especificación del software. El hilo conductor del Módulo 3 es:

text
M3-01 (¿Qué es un requerimiento?) →
M3-02 (¿Cómo se captura?) →
M3-03 (¿Cómo se modela?) →
M3-04 (¿Cómo se especifica formalmente?) →
M3-05 (¿Cómo se valida que el SRS es correcto?) →
M3-06 (¿Cómo se mide la calidad del SRS?) →
M3-09 (¿Cómo se controla el cambio y la trazabilidad?) →
M3-10 (¿Cómo se prueba que el software implementado cumple lo especificado?)
El campo Requerimiento.criterioAceptacion (M3-04) es el inicio de este archivo. El campo CasoPrueba.estado = 'pasado' es el final. La trazabilidad de M3-09 une ambos puntos: cada requerimiento aprobado debe tener un caso de prueba vinculado que verifique su implementación.

2.2 Distinción fundamental: validación del SRS vs. pruebas del software
M3-05 valida el SRS (¿el documento refleja lo que el cliente necesita?) ANTES de escribir código.

M3-10 verifica que el software implementado cumple el SRS (¿el código implementa lo que el SRS dice?) DESPUÉS de escribir código.

Cita de Sommerville: "La validación de requerimientos es el proceso de verificar que los requerimientos definan realmente el sistema que en verdad quiere el cliente" (Cap. 4 §4.6, p. 110). Las pruebas, en cambio, verifican que la implementación es correcta respecto de lo especificado, no respecto de lo que el cliente realmente necesita. Esta es una distinción fundamental: un SRS puede pasar validación con el cliente y aun así producir software que, cuando se prueba, no funciona correctamente porque la implementación tiene defectos.

2.3 Los límites fundamentales de las pruebas
Las pruebas nunca pueden garantizar la ausencia de defectos. Su objetivo es encontrar defectos, no probar que no existen.

Sommerville establece: "La prueba de software es un proceso de ejecutar un programa con la intención de encontrar errores" (Cap. 8 intro). El acento está en encontrar, no en verificar ausencia. Por más exhaustivas que sean las pruebas, siempre existe la posibilidad de que un defecto no detectado permanezca en el código. Las pruebas reducen el riesgo de defectos, pero no lo eliminan.

2.4 Conexiones con los otros módulos
Los defectos encontrados en pruebas afectan el plan del proyecto (M2-04): cada defecto de severidad crítica puede generar retrasos o cambios de alcance.

El criterio de salida de las pruebas de aceptación determina si el proyecto pasa a estado 'completado' (M2): sin aprobación del cliente, el proyecto no cierra.

La metodología acordada en M2-07 determina cuándo y cómo se hacen las pruebas: en cascada, las pruebas ocurren al final; en TDD (XP/Scrum), las pruebas son continuas desde el inicio; en RUP, las pruebas se estructuran por fase.

3. El Proceso de Pruebas — Marco Teórico
3.1 Verificación y Validación (V&V) — Marco general
Sommerville define V&V en la introducción del Cap. 8: "La verificación y la validación (V&V) son procesos de control de calidad que son esenciales para garantizar la fiabilidad del software" (Cap. 8 intro).

La distinción de Sommerville es clara:

Aspecto	Verificación	Validación
Pregunta	¿Estamos construyendo el producto correctamente?	¿Estamos construyendo el producto correcto?
Qué verifica	Que el software cumple la especificación (SRS)	Que la especificación refleja las necesidades reales del cliente
Cuándo ocurre	Durante desarrollo (pruebas del código)	Antes de desarrollo (revisión formal del SRS con cliente)
En austranet-cco	M3-10 — Pruebas de software contra el SRS	M3-05 — Validación del SRS con el cliente
Nota al lector: Ver M3-05, Sección 2.2 para la aplicación completa de esta distinción en el proceso de validación del SRS. Este archivo (M3-10) cubre exclusivamente el lado de verificación: que el código implementa correctamente lo especificado en el SRS.

3.2 Pruebas de Desarrollo (§8.1)
Sommerville estructura las pruebas de desarrollo en una jerarquía de niveles, desde lo más granular hasta lo más integrado.

PRUEBAS DE UNIDAD (§8.1)
Definición exacta de Sommerville: "Las pruebas de unidad implican probar componentes del sistema (funciones, métodos, clases de objetos) de manera aislada" (Cap. 8 §8.1, p. 202).

Qué se prueba en una unidad:

Funciones individuales

Métodos de clases

Módulos pequeños e independientes

Estrategias de prueba de unidad según Sommerville (§8.1):

1. Partición de equivalencia

Sommerville define: "La partición de equivalencia es una técnica de prueba en la que se divide el dominio de entrada en particiones de equivalencia" (Cap. 8 §8.1, p. 203). Cada partición representa un conjunto de valores que el programa debería tratar de forma similar. Se selecciona un valor representativo de cada partición.

Ejemplo en austranet-cco:

RF-001: "Registrar entidad cliente"

Dominio de entrada: nombre del cliente (texto)

Particiones equivalentes:

Nombres válidos (1-100 caracteres, sin caracteres especiales)

Nombres vacíos

Nombres con caracteres inválidos (símbolos prohibidos)

Nombres > 100 caracteres (desbordamiento)

Se prueba un caso de cada partición, no todos los valores dentro de ella.

2. Análisis de valores límite

Sommerville señala: "El análisis de valores límite es un complemento de la partición de equivalencia. En lugar de probar un valor arbitrario dentro de una partición, se prueban los límites de la partición" (Cap. 8 §8.1, p. 203).

Ejemplo:

RNF-001: "El sistema debe aceptar usuarios de 18 a 65 años"

Valores límite: 17 (justo antes), 18 (límite inferior), 19 (dentro), 64 (dentro), 65 (límite superior), 66 (justo después)

Se prueba cada límite para verificar que funciona correctamente

3. Pruebas estructurales (cobertura de código)

Sommerville menciona: "Las pruebas de cobertura verifican que todas las sentencias del código han sido ejecutadas durante las pruebas" (Cap. 8 §8.1).

Aplicación en austranet-cco:

text
CasoPrueba.tipo = 'funcional'
CasoPrueba.nivelPrueba = 'unidad'
CasoPrueba.metodologia = 'automatizado' (en TDD, esto ocurre con unittest de Python, Jest en JavaScript, etc.)
PRUEBAS DE COMPONENTE (§8.1)
Definición: "Las pruebas de componente prueban componentes integrados de mayor tamaño. Pueden formar un subsistema o un módulo del sistema" (Cap. 8 §8.1, p. 204).

¿En qué se diferencian de las pruebas de unidad?

Pruebas de unidad: un método o función aislada

Pruebas de componente: múltiples funciones/clases interactuando, pero aún dentro de un subsistema

Tipos de interfaz que Sommerville identifica (§8.1, pp. 204-205):

Tipo de interfaz	Descripción	Error típico
Interfaz de parámetros	Se pasan parámetros a través de llamadas de función	Parámetro con tipo incorrecto, número de parámetros erróneo
Interfaz de memoria compartida	Los componentes acceden a datos comunes en memoria	Lectura antes de escritura, sobrescritura no sincronizada
Interfaz de procedimiento	Un componente llama procedimientos del otro	Procedimiento llamado con secuencia incorrecta
Interfaz de paso de mensajes	Componentes intercambian mensajes (sistemas distribuidos)	Mensaje perdido, mensaje fuera de orden, contenido corrupto
Errores de interfaz típicos que Sommerville menciona:

Información transmitida incompleta o corrupta entre componentes

Suposiciones incorrectas sobre la semántica de los datos

Sincronización de tiempos entre componentes que acceden a recursos comunes

Aplicación en austranet-cco:

text
CasoPrueba.tipo = 'funcional'
CasoPrueba.nivelPrueba = 'componente'
CasoPrueba.metodologia = 'manual' | 'mixto'
Ejemplo: CP-010 — Prueba integración entre Módulo M1 (Entidades) y Módulo M2 (Proyectos)
Precondición: Entidad cliente debe estar registrada y en estado 'activo'
Pasos: 1. Crear proyecto, 2. Seleccionar entidad, 3. Verificar que el proyecto se vincula correctamente
PRUEBAS DE SISTEMA (§8.1)
Definición: "Las pruebas de sistema prueban el sistema integrado como un todo. Se verifica que todos los componentes funcionan juntos correctamente y que el sistema cumple con sus requerimientos no funcionales" (Cap. 8 §8.1, p. 205).

¿Qué cubre que las pruebas de componente no cubren?

Comportamiento emergente: propiedades del sistema que solo aparecen cuando el sistema completo interactúa

Requerimientos no funcionales: rendimiento, seguridad, disponibilidad

Flujos de usuario end-to-end (casos de uso completos)

Sommerville nota: "La prueba de sistema es donde se detectan principalmente problemas que surgen de la integración de componentes heterogéneos" (Cap. 8 §8.1, p. 205).

Aplicación en austranet-cco:

text
CasoPrueba.tipo = 'funcional' | 'no_funcional' | 'rendimiento' | 'estres'
CasoPrueba.nivelPrueba = 'sistema'
Ejemplo: CP-050 — "Crear SRS completo end-to-end"
Pasos: 1. Crear proyecto, 2. Crear entidad cliente, 3. Definir stakeholders, 4. Crear requerimientos, 5. Ejecutar validación formal, 6. Aprobar SRS
Resultado esperado: SRS v1.0 aprobado, estado = 'aprobado'
3.3 El Modelo en V
El Modelo en V conecta cada nivel de diseño/especificación con su nivel correspondiente de prueba:

text
        ESPECIFICACIÓN                          PRUEBAS
        
Requerimientos  ←———————————————→  Pruebas de aceptación (usuario/cliente)
        ↓                                    ↑
Diseño de sistema  ←———————————————→  Pruebas de sistema
        ↓                                    ↑
Diseño de componente  ←———————————————→  Pruebas de integración
        ↓                                    ↑
Código (implementación)  ←———————————————→  Pruebas de unidad
        ↓                                    ↑
        └————————— Integración continua —————┘
Aplicación en austranet-cco:

Vértice izquierdo (Especificación)	Vértice derecho (Prueba)	Campo sistema
SRS aprobado (M3-04)	Pruebas de aceptación (M3-10)	CasoPrueba.nivelPrueba = 'aceptacion'
Arquitectura del sistema (M2)	Pruebas de sistema	CasoPrueba.nivelPrueba = 'sistema'
Diseño de componentes	Pruebas de integración/componente	CasoPrueba.nivelPrueba = 'componente'
Código (implementación)	Pruebas de unidad	CasoPrueba.nivelPrueba = 'unidad'
La trazabilidad de M3-09 implementa las líneas horizontales del modelo en V: cada requerimiento tiene un caso de prueba que lo verifica en el nivel correspondiente.

4. Desarrollo Dirigido por Pruebas (TDD) — §8.2
4.1 Definición y ciclo del TDD
Definición exacta de Sommerville (§8.2, p. 207):

"El desarrollo dirigido por pruebas (TDD, Test-Driven Development) es un enfoque de desarrollo donde las pruebas se escriben ANTES de que se escriba el código de implementación. Los desarrolladores escriben una prueba que especifica lo que el código debe hacer, luego escriben el código mínimo necesario para pasar la prueba" (Cap. 8 §8.2, p. 207).

El ciclo TDD — ROJO → VERDE → REFACTORIZAR:

ROJO — El desarrollador escribe un test que falla porque la funcionalidad aún no existe

VERDE — El desarrollador escribe el código mínimo necesario para hacer que el test pase

REFACTORIZAR — El desarrollador mejora el código sin cambiar su comportamiento (mantiene el test en verde)

Sommerville ilustra: "El ciclo es rápido, típicamente con pruebas ejecutadas cada pocos minutos. Los desarrolladores trabajan en pequeños incrementos, asegurando que el código nunca está en un estado totalmente roto" (Cap. 8 §8.2, p. 207).

Aplicación en austranet-cco (para metodología agil_xp o agil_scrum con TDD habilitado):

text
Proyecto.metodologia = 'agil_xp' o 'agil_scrum'
PlanPruebas.metodologiaPrueba = 'agil_tdd'

CICLO POR HISTORIA DE USUARIO:
1. ROJO: QA crea CasoPrueba automatizado basado en RF.criterioAceptacion
2. VERDE: Desarrollador escribe código para pasar el test
3. REFACTORIZAR: Desarrollador mejora el código
4. Repetir para siguiente RF
4.2 Beneficios del TDD según Sommerville (§8.2, p. 207)
Sommerville enumera explícitamente los beneficios del TDD:

Código más confiable — El código que pasa pruebas es más confiable que el que no las tiene

Documentación viva — Las pruebas actúan como especificación ejecutable del código

Deuda técnica reducida — La refactorización continua evita que el código se degrade

Ciclo de retroalimentación rápido — Los errores se detectan inmediatamente, no después de días de desarrollo

Mayor confianza en cambios — Refactorizar es seguro porque las pruebas detectan regresiones inmediatamente

4.3 Cuándo y cuándo NO usar TDD (§8.2, p. 208)
Cuándo usar TDD:

Proyectos con requisitos claros (el criterio de aceptación debe estar bien definido antes)

Equipos pequeños y collocados (TDD requiere comunicación frecuente)

Contextos de cambio continuo (las pruebas previenen regresiones)

Sistemas donde confiabilidad es crítica

Cuándo NO usar TDD:

Prototipado exploratorio (cuando los requerimientos son altamente inciertos)

Proyectos con muy corto plazo (TDD añade tiempo inicial, los beneficios llegan después)

Interfaces gráficas complejas (las pruebas de UI son lentas, frágiles y costosas de mantener)

Sistemas de tiempo real con restricciones duras (la prueba automatizada puede no ser suficiente)

Sommerville advierte: "Aunque TDD produce código de calidad, requiere disciplina y entrenamiento. Los equipos nuevos pueden ser más lentos inicialmente" (Cap. 8 §8.2, p. 208).

4.4 TDD en el sistema austranet-cco
Cuándo se activa:

text
Proyecto.metodologia = 'agil_xp' o 'agil_scrum'
↓
PlanPruebas.metodologiaPrueba = 'agil_tdd' (automático)
↓
Para cada RF Must Have:
  - CasoPrueba se crea ANTES del sprint que implementa el RF
  - CasoPrueba.criterioAceptacion = RF.criterioAceptacion (DADO/CUANDO/ENTONCES)
  - CasoPrueba.metodologia = 'automatizado'
  - CasoPrueba.estado = 'definido' (antes de iniciar código)
Flujo de implementación:

text
Sprint N-1 cierra → CP de RF-X creados y pasan
Sprint N inicia → 
  1. ROJO: QA/Desarrollador ejecuta CP de RF-X, falla (no hay código)
  2. Desarrollador implementa código mínimo
  3. VERDE: CP de RF-X pasan
  4. Refactorizar: mejorar código manteniendo CP en verde
  5. Suite de regresión: todos los CP de sprints anteriores también deben pasar
Sprint N cierra → CP de RF-X en estado 'pasado'
Diferencia con cascada/RUP:

text
CASCADA: SRS v1.0 aprobado → Diseño → Implementación → Pruebas (al final)
TDD: Cada RF → CP creado → Código → Prueba (continua, cada minuto/hora)
5. Pruebas de Versión (§8.3)
5.1 Qué son las pruebas de versión
Distinción de Sommerville entre pruebas de sistema y pruebas de versión (§8.3, p. 209):

Aspecto	Pruebas de sistema	Pruebas de versión
¿Qué se prueba?	El sistema completo integrado en un entorno controlado	El sistema completo en un entorno que simula la producción
¿Quién las ejecuta?	Equipo de QA especializado	Equipo de QA + usuarios finales (en contexto)
¿Cuándo?	Después de integración completa	Después de que el sistema está listo para liberar
¿Qué se busca?	Defectos de integración, comportamiento incorrecto	Comportamiento en carga, bajo condiciones realistas
Sommerville define: "Las pruebas de versión son un conjunto de pruebas que se llevan a cabo sobre el sistema completo para verificar que cumple con los requerimientos no funcionales" (Cap. 8 §8.3, p. 209).

5.2 Pruebas de rendimiento (§8.3)
Definición de Sommerville: "Las pruebas de rendimiento evalúan el tiempo de respuesta del sistema bajo carga. Se miden atributos como throughput (transacciones por segundo) y latencia (tiempo de respuesta)" (Cap. 8 §8.3, p. 209).

¿Qué se mide en una prueba de rendimiento?

Tiempo de respuesta bajo carga normal

Throughput (transacciones/segundo)

Utilización de recursos (CPU, memoria)

Tiempo de recuperación tras picos de carga

¿Cómo se diseñan? Sommerville menciona (§8.3, p. 210):
"La selección de cargas de prueba es crítica. Deben reflejar el uso realista del sistema. Usar cargas artificiales muy altas puede ocultar problemas que solo aparecen bajo carga realista" (Cap. 8 §8.3, p. 210).

Aplicación en austranet-cco:

text
CasoPrueba.tipo = 'rendimiento'
CasoPrueba.nivelPrueba = 'sistema'
CasoPrueba.metodologia = 'automatizado'
Ejemplo:
  RNF-001: "El sistema debe responder en < 2 segundos bajo 100 usuarios concurrentes"
  ↓
  CasoPrueba.titulo = "Tiempo de respuesta bajo 100 usuarios concurrentes"
  CasoPrueba.parámetrosDeCargas = {
    usuariosConcurrentes: 100,
    duracionPrueba: "15 minutos",
    tasaArribo: "10 usuarios/segundo"
  }
  CasoPrueba.umbralAceptación = {
    tiempoRespuestaMax: "2 segundos",
    percentil95: "< 1.5 segundos"
  }
5.3 Pruebas de estrés (§8.3)
Definición de Sommerville: "Las pruebas de estrés son pruebas de rendimiento extremo. El sistema se carga hasta o más allá de sus límites operacionales. El objetivo es descubrir cómo se comporta el sistema cuando se sobrecarga" (Cap. 8 §8.3, p. 210).

¿En qué se diferencian de las pruebas de rendimiento?

Aspecto	Rendimiento	Estrés
Carga	Realista (dentro de límites normales)	Extrema (cerca o sobre los límites)
Objetivo	Medir tiempo de respuesta	Encontrar dónde y cómo falla el sistema
Resultado esperado	Sistema funciona dentro de umbrales	Sistema degrada gracefully o falla de forma predecible
Sommerville señala: "Las pruebas de estrés pueden revelar comportamientos inesperados cuando el sistema está al límite, como deadlocks o pérdida de datos bajo contención extrema" (Cap. 8 §8.3, p. 211).

Aplicación en austranet-cco (obligatorio para proyectos con criticidad = 'alta' o 'critica'):

text
CasoPrueba.tipo = 'estres'
CasoPrueba.nivelPrueba = 'sistema'
Obligatorio si: Proyecto.criticidad = 'alta' o 'critica'
Ejemplo:
  Carga normal: 100 usuarios
  Carga estrés: 500 usuarios (5x)
  Resultado esperado: Sistema sigue funcional, pero puede degradarse (tiempos más lentos aceptables)
  Comportamiento inaceptable: Pérdida de datos, bloqueos, excepciones no capturadas
5.4 Pruebas de regresión (§8.3)
Definición de Sommerville: "Las pruebas de regresión verifican que los cambios realizados al sistema (fixes de defectos o nuevas funcionalidades) no han roto características que funcionaban correctamente antes" (Cap. 8 §8.3, p. 211).

Por qué son críticas: "Cada vez que se realiza un cambio al sistema, existe el riesgo de que algo que funcionaba correctamente deje de funcionar. Las pruebas de regresión detectan estos problemas antes de que lleguen a producción" (Cap. 8 §8.3, p. 211).

Relación con la gestión del cambio (M3-09): Cuando se aprueba una SolicitudCambioSRS, se activan las pruebas de regresión para verificar que el cambio no ha roto nada.

Aplicación en austranet-cco:

En proyectos ágiles (Scrum/XP):

text
Sprint N-1 cierra con: CP-001 (pasado), CP-002 (pasado), CP-003 (pasado)
Sprint N inicia →
  Suite de regresión = CP-001, CP-002, CP-003 (todos deben pasar nuevamente)
  + CP-004, CP-005 nuevos para RF del Sprint N
En proyectos cascada/RUP:

text
Antes de cada entrega formal (hito):
  Ejecutar toda la suite de pruebas acumulada (todos los CP de todas las fases anteriores)
  Si algún CP falla, se debe investigar por qué (¿cambio no documentado? ¿defecto nuevo?)
6. Pruebas de Usuario (§8.4) — PRUEBAS DE ACEPTACIÓN
Esta es la sección más importante de M3-10 para austranet-cco.

6.1 Tipos de pruebas de usuario (§8.4)
Sommerville distingue tres tipos de pruebas de usuario:

PRUEBAS ALFA (Alpha Testing)
Definición exacta de Sommerville (§8.4, p. 212): "Las pruebas alfa son pruebas del sistema llevadas a cabo por el cliente en el sitio del desarrollador. El cliente usa el sistema bajo supervisión de los desarrolladores" (Cap. 8 §8.4, p. 212).

Características:

Quién las ejecuta: Usuario final, en el sitio del desarrollador

Dónde: Entorno controlado del proveedor

Cuándo: Después de que el sistema está completo pero antes de ser liberado

Propósito: Encontrar defectos que el equipo de desarrollo no detectó

Aplicación en austranet-cco:

text
CasoPrueba.tipo = 'aceptacion_usuario'
CasoPrueba.nivelPrueba = 'aceptacion'
Ejecutor: Usuario final (no el equipo de desarrollo)
Momento: Antes de pruebas beta, después de pruebas de sistema completas
PRUEBAS BETA (Beta Testing)
Definición exacta de Sommerville (§8.4, p. 212): "Las pruebas beta son pruebas del sistema en el sitio del cliente. El cliente usa el sistema en su contexto normal de operación, pero bajo supervisión del proveedor. Se enfoca en encontrar problemas que solo aparecen en el contexto real del cliente" (Cap. 8 §8.4, p. 212).

Diferencias con alfa:

Ubicación: Entorno del cliente (no del proveedor)

Supervisión: Menor — el cliente es el que controla

Datos: Datos reales, no de prueba

Duración: Más larga (semanas, no horas)

Participantes: Múltiples usuarios del cliente

Aplicación en austranet-cco:

text
CasoPrueba.tipo = 'aceptacion_usuario'  (igual que alfa, pero en contexto real)
Ubicación: Sitio del cliente
Duración: Varias semanas
Participantes: Múltiples usuarios del cliente
Resultado: Bug report de defectos encontrados, feedback sobre usabilidad
PRUEBAS DE ACEPTACIÓN (Acceptance Testing)
Definición exacta de Sommerville (§8.4, p. 212): "Las pruebas de aceptación son pruebas formales donde el cliente verifica que el sistema cumple con los criterios de aceptación definidos en el contrato (SRS). Si el sistema pasa las pruebas de aceptación, el cliente lo acepta formalmente, lo que completa la obligación contractual del proveedor" (Cap. 8 §8.4, p. 212).

Diferencia crítica con alfa y beta:

Alfa y beta: Son exploratorias, de aprendizaje; el objetivo es encontrar defectos

Aceptación: Es formal, contractual; el objetivo es decidir si aceptar o rechazar el sistema

Aplicación en austranet-cco:

text
CasoPrueba.tipo = 'aceptacion_cliente'
CasoPrueba.nivelPrueba = 'aceptacion'
Ejecutor: Cliente (Stakeholder M1 con nivelInfluencia = 'alto')
Resultado: Acta de aceptación firmada (ver Sección 9.3)
Efecto: Proyecto.estado → 'completado' si se acepta
6.2 El proceso de pruebas de aceptación (§8.4, pp. 212-214)
Sommerville describe las etapas del proceso de aceptación:

ETAPA 1: Definición de criterios de aceptación
Pregunta clave (según Sommerville): "¿Quién define qué significa que el sistema es aceptable?" (§8.4, p. 212).

Respuesta de Sommerville: "Los criterios de aceptación deben definirse durante la especificación de requerimientos (SRS) y deben ser lo suficientemente precisos como para que puedan verificarse objivamente" (§8.4, p. 212).

En austranet-cco, estos criterios son exactamente el campo Requerimiento.criterioAceptacion en formato DADO/CUANDO/ENTONCES (M3-04).

ETAPA 2: Planificación de las pruebas de aceptación
Sommerville señala: "La planificación de pruebas de aceptación debe comenzar durante la especificación de requerimientos. Se debe determinar qué casos de prueba de aceptación se necesitan, qué datos de prueba se requieren y cuándo se ejecutarán" (§8.4, p. 213).

En austranet-cco:

text
Después de aprobar SRS v1.0 (M3-05):
  - PlanPruebas.criteriosAceptacion se define
  - Para cada RF Must Have, se crea CasoPrueba.tipo = 'aceptacion_cliente'
  - Se preparan datos de prueba realistas (no datos dummy)
  - Se agenda la reunión de pruebas de aceptación con el cliente
ETAPA 3: Ejecución de las pruebas
Sommerville describe: "Las pruebas de aceptación se ejecutan en un entorno que simula la producción tan fielmente como sea posible. El cliente participa activamente, ejecutando o supervisando cada caso de prueba" (§8.4, p. 213).

ETAPA 4: Negociación de resultados
Questa es la etapa más crítica. Sommerville advierte (§8.4, pp. 213-214):

"Los problemas surgen cuando el cliente descubre que el sistema no cumple con algunos criterios de aceptación. En este punto, el cliente y el proveedor deben negociar:

¿Es el criterio incorrecto (mal entendimiento del requerimiento)?

¿Es el sistema el que está defectuoso?

¿Puede aceptarse el sistema con defectos menores conocidos?

La presión de tiempo a menudo lleva al cliente a aceptar un sistema con defectos, esperando que se corrijan en versiones posteriores. Esto es peligroso porque crea deuda técnica que es difícil de pagar después" (Cap. 8 §8.4, p. 213-214).

En austranet-cco, esto se documenta en:

text
PlanPruebas.criteriosAceptacion debe incluir explícitamente:
  - Defectos conocidos aceptados al momento de aceptación (y su severidad)
  - Defectos críticos que bloquean aceptación
  - Defectos menores que se permiten (< N defectos de severidad menor)
ETAPA 5: Aceptación o rechazo
"Si todas las pruebas pasan y no hay defectos críticos abiertos, el cliente acepta el sistema formalmente. Si hay defectos críticos, el cliente rechaza el sistema y el proveedor debe volver a trabajar" (§8.4, p. 214).

En austranet-cco:

text
Si: Todos los CasoPrueba.tipo = 'aceptacion_cliente' en estado 'pasado'
   Y: Defectos críticos abiertos = 0
   Y: Defectos mayores abiertos ≤ [umbral acordado]
Entonces: Acta de aceptación firmada por cliente
         Proyecto.estado → 'completado'
         
Si no:
   Proyecto.estado → 'bloqueado_aceptacion'
   Defectos abiertos → M2-04 como incidencias
   Proveedor vuelve a trabajar
6.3 Advertencias de Sommerville sobre pruebas de aceptación (§8.4, p. 214)
Sommerville identifica problemas reales que ocurren en la práctica:

Problema 1: El cliente no puede definir criterios precisos

"A veces, el cliente no puede articularclamente qué necesita que haga el sistema. Es difícil, incluso para profesionales de la computación experimentados, realizar este tipo de análisis abstracto" (Cap. 8 §8.4, p. 214).

Solución en austranet-cco: El proceso de validación de M3-05 existe precisamente para abordar esto. Si el cliente no puede definir criterios de aceptación, el SRS no puede aprobarse.

Problema 2: Presión de tiempo para aceptar

"Los gerentes de proyecto a menudo presionan para que el cliente acepte el sistema incluso si hay defectos, porque el proyecto está retrasado. Esto es contraproducente: aceptar un sistema defectuoso genera insatisfacción del cliente y costo de mantenimiento a largo plazo" (Cap. 8 §8.4, p. 214).

Solución en austranet-cco: El Acta de aceptación documenta explícitamente todos los defectos conocidos aceptados. Si hay defectos críticos, el proyecto NO cierra sin aceptación formal.

Problema 3: Distancia entre lo probado en aceptación y lo usado en producción

"A veces el cliente descubre en producción que el sistema tiene comportamientos que no fueron detectados en las pruebas de aceptación, porque el uso real diverge del esperado" (Cap. 8 §8.4, p. 214).

Solución en austranet-cco: Las pruebas beta (si se ejecutan) ocurren en el contexto real del cliente, lo que reduce este riesgo. Las pruebas de aceptación deben simular tan fielmente como sea posible el uso real.

6.4 Pruebas de aceptación ágiles (§8.4 y §8.2 conjuntamente)
Sommerville dedica parte de §8.4 a cómo funcionan las pruebas de aceptación en contextos ágiles:

"En XP (Extreme Programming) y Scrum, el cliente está disponible y puede ejecutar pruebas de aceptación en cada iteración. Esto es ideal porque el feedback es inmediato y se pueden corregir malentendidos rápidamente" (Cap. 8 §8.4, p. 214).

Aplicación en austranet-cco (para Scrum/XP):

text
Proyecto.metodologia = 'agil_scrum' o 'agil_xp'
↓
PlanPruebas.criteriosAceptacion se evalúan POR SPRINT, no al final del proyecto
↓
Sprint N:
  1. Sprint Planning: Definir criterios de aceptación para RF del sprint
  2. Development: Implementar RF (con TDD)
  3. Sprint Review: Ejecutar pruebas de aceptación ante el cliente
  4. Cliente acepta o rechaza incremento
↓
Proyecto NO espera a todas las pruebas al final
Aceptación es continua, por incremento
Diferencia fundamental con cascada:

text
CASCADA: 12 meses → pruebas de aceptación una sola vez al final
TDD/SCRUM: 1 mes de sprints, pruebas de aceptación cada 2 semanas en el Sprint Review
7. Plan de Pruebas — Plantilla Operativa
Este es el PRIMER ENTREGABLE CONCRETO de M3-10.

El PlanPruebas es el documento que el analista/gestor crea al inicio de la fase de pruebas (o al inicio del proyecto, si es TDD) para el proyecto.

Plantilla Completa — PLAN DE PRUEBAS
text
═══════════════════════════════════════════════════════════════
PLAN DE PRUEBAS — Proyecto [Proyecto.id]
═══════════════════════════════════════════════════════════════

SECCIÓN A — IDENTIFICACIÓN
───────────────────────────────────────────────────────────────
ID del plan:                    [PlanPruebas.id]
Proyecto:                       [PlanPruebas.proyectoId] — [Proyecto.nombre]
SRS vinculado:                  [PlanPruebas.srsId]
Versión del SRS:                [v1.0 o v1.X]
Versión del plan:               [PlanPruebas.version]

Metodología de prueba:          [dirigido_plan | agil_tdd | hibrido]
  ↳ Deriva de Proyecto.metodologia (M2-07):
    • cascada/rup → dirigido_plan
    • agil_scrum/agil_xp → agil_tdd
    • incremental/hibrido → hibrido

Estado del plan:                [borrador | aprobado | en_ejecucion | completado]
Aprobado por:                   [PlanPruebas.aprobadoPor]
Fecha de aprobación:            [PlanPruebas.fechaAprobacion]


SECCIÓN B — ALCANCE DE LAS PRUEBAS
───────────────────────────────────────────────────────────────
Descripción del alcance:
[PlanPruebas.alcance — descripción general]

Niveles de prueba incluidos:
  ☐ Pruebas de unidad           (NivelPrueba = 'unidad')
  ☐ Pruebas de componente       (NivelPrueba = 'componente')
  ☐ Pruebas de sistema          (NivelPrueba = 'sistema')
  ☐ Pruebas de aceptación       (NivelPrueba = 'aceptacion')

Tipos de prueba incluidos:
  ☐ Funcional                   (TipoCasoPrueba = 'funcional')
  ☐ No funcional                (TipoCasoPrueba = 'no_funcional')
  ☐ Rendimiento                 (TipoCasoPrueba = 'rendimiento')
  ☐ Estrés                      (TipoCasoPrueba = 'estres')
    ↳ Obligatorio si Proyecto.criticidad = 'alta' | 'critica'
  ☐ Regresión                   (TipoCasoPrueba = 'regresion')
  ☐ Aceptación usuario          (TipoCasoPrueba = 'aceptacion_usuario')
  ☐ Aceptación cliente          (TipoCasoPrueba = 'aceptacion_cliente')


SECCIÓN C — ESTRATEGIA DE PRUEBAS
───────────────────────────────────────────────────────────────
Descripción de estrategia:
[PlanPruebas.estrategia — cómo se ejecutarán las pruebas]

Herramientas de prueba por nivel:
  • Unidad:       [Jest, unittest, pytest, etc.]
  • Componente:   [Postman, REST Assured, etc.]
  • Sistema:      [Selenium, Cypress, LoadRunner, etc.]
  • Aceptación:   [Manual con checklist, Cucumber, etc.]

Entornos requeridos:
  ☐ Desarrollo    (para pruebas de unidad/componente)
  ☐ Staging       (para pruebas de sistema y regresión)
  ☐ Beta          (para pruebas beta con cliente)
  ☐ Producción    (NO se usan para pruebas iniciales)


SECCIÓN D — CRITERIOS DE ENTRADA
───────────────────────────────────────────────────────────────
¿Cuándo puede comenzar la ejecución de pruebas?

[PlanPruebas.criteriosEntrada — lista de condiciones]

Criterios mínimos obligatorios:
  ☐ SRS.estado = 'aprobado' (v1.0 firmado por cliente)
  ☐ CasoPrueba[] definidos para todos los RF Must Have
  ☐ Cobertura de trazabilidad hacia adelante ≥ 80%
    (Ver M3-09, Sección 6.4 — KPI)
  ☐ Entorno de pruebas configurado y verificado
  ☐ Datos de prueba preparados
  ☐ Herramientas de prueba instaladas y funcionando


SECCIÓN E — CRITERIOS DE SALIDA DE PRUEBAS
───────────────────────────────────────────────────────────────
¿Cuándo están completas las pruebas del EQUIPO?

[PlanPruebas.criteriosSalida — lista de condiciones]

Criterios mínimos obligatorios:
  ☐ 100% de CP tipo 'funcional' de RF Must Have ejecutados
  ☐ 0 defectos con severidad 'critica' abiertos
  ☐ ≤ [N] defectos con severidad 'alta' abiertos
     (Define N según criticidad del proyecto)
  ☐ Suite de regresión ejecutada y 100% pasada
  ☐ CP de rendimiento ejecutados y dentro de umbrales (si aplica)
  ☐ CP de estrés ejecutados (si criticidad alta/critica)


SECCIÓN F — CRITERIOS DE ACEPTACIÓN DEL CLIENTE
───────────────────────────────────────────────────────────────
¿Cuándo el CLIENTE firma que acepta el sistema?

[PlanPruebas.criteriosAceptacion — lista de condiciones]

Criterios mínimos obligatorios:
  ☐ Todas las pruebas de aceptación tipo 'aceptacion_cliente'
    en estado 'pasado'
  ☐ Cliente ejecutó o supervisó las pruebas de aceptación
    (representante Stakeholder M1 con nivelInfluencia = 'alto')
  ☐ Criterios definidos en SRS v1.0 Sección 1.3
    ("Criterios de aceptación del sistema") verificados
  ☐ Defectos conocidos documentados en Acta de aceptación
  ☐ Acta de aceptación firmada digitalmente por cliente y proveedor


SECCIÓN G — MATRIZ DE COBERTURA: REQUERIMIENTOS CON CASO DE PRUEBA
───────────────────────────────────────────────────────────────

[Tabla generada automáticamente de M3-09, trazabilidad RF → CP]

Total RF Must Have:         [N]
RF con CP asignado:         [M]
Cobertura:                  [M/N × 100]%

RF Must Have sin CP (pendientes):
  • [RF-XXX] — [Título] — Fecha comprometida: [YYYY-MM-DD]
  • [RF-XXX] — [Título] — Fecha comprometida: [YYYY-MM-DD]
  ...

8. Plantillas de Casos de Prueba por Tipo
Este es el SEGUNDO ENTREGABLE CONCRETO de M3-10.

8.1 Plantilla — Caso de Prueba Funcional
text
═══════════════════════════════════════════════════════════════
CASO DE PRUEBA FUNCIONAL
═══════════════════════════════════════════════════════════════

ID:                             [CasoPrueba.id]
Código:                         [CP-XXX]
Requerimiento vinculado:        [RF-001] — [Título del RF]
Nivel de prueba:                [unidad | componente | sistema]
Tipo:                           funcional

TÍTULO
──────────────────────────────────────────────────────────────
[CasoPrueba.titulo — breve descripción de qué se prueba]

DESCRIPCIÓN
──────────────────────────────────────────────────────────────
[CasoPrueba.descripcion — contexto y propósito de la prueba]

CRITERIO DE ACEPTACIÓN (heredado del Requerimiento)
──────────────────────────────────────────────────────────────
[CasoPrueba.criterioAceptacion]

Formato DADO/CUANDO/ENTONCES:

DADO
  [Estado precondición del sistema]
  Ejemplo: "El usuario está autenticado y tiene rol 'analista'"

CUANDO
  [Acción que ejecuta el usuario o el sistema]
  Ejemplo: "Hace clic en botón 'Crear Requerimiento'"

ENTONCES
  [Resultado verificable que debe ocurrir]
  Ejemplo: "Se abre formulario de creación de requerimiento con campos vacíos"


PRECONDICIONES
──────────────────────────────────────────────────────────────
[CasoPrueba.precondiciones — lista de requisitos previos]

1. [Estado del sistema requerido antes de ejecutar la prueba]
2. [Datos que deben existir en la BD]
3. [Permisos del usuario]
   ...

Ejemplo:
  1. Base de datos contiene proyecto 'PRJ-001' con estado 'activo'
  2. Usuario 'ana@empresa.com' con rol 'Analista'
  3. Usuario autenticado en el sistema


PASOS DE EJECUCIÓN
──────────────────────────────────────────────────────────────
[CasoPrueba.pasos — acciones numeradas]

1. [Acción del actor o del sistema — específica, verificable]
2. [Acción siguiente]
3. ...
   Resultado intermedio esperado (si aplica)
...

Ejemplo para CP Crear Requerimiento:
  1. Navegar a Proyecto PRJ-001
  2. Hacer clic en botón "Crear Requerimiento"
     → Resultado: Se abre formulario vacío
  3. Completar campo "Título" con "Registrar cliente"
  4. Completar campo "Descripción" con descripción
  5. Seleccionar "Tipo" = "Funcional"
  6. Seleccionar "Prioridad" = "Must Have"
  7. Hacer clic en "Guardar"
     → Resultado: Requerimiento creado con estado 'propuesto'


RESULTADO ESPERADO
──────────────────────────────────────────────────────────────
[CasoPrueba.resultadoEsperado — estado final del sistema]

Ejemplo:
  • Requerimiento con código RF-XXX creado
  • Estado: 'propuesto'
  • Todos los campos completados correctamente
  • Mensaje de confirmación: "Requerimiento creado exitosamente"
  • Usuario redirigido a vista de detalles del requerimiento


METODOLOGÍA:         [manual | automatizado | mixto]
PRIORIDAD:           [alta | media | baja]
ESTADO INICIAL:      definido
RESPONSABLE:         [QA responsable]

8.2 Plantilla — Caso de Prueba de Rendimiento
text
═══════════════════════════════════════════════════════════════
CASO DE PRUEBA DE RENDIMIENTO
═══════════════════════════════════════════════════════════════

Código:                         [CP-XXX]
RNF vinculado:                  [RNF-XXX] — [Título del RNF]
Tipo:                           rendimiento
Nivel de prueba:                sistema
Metodología:                    automatizado


OBJETIVO DE LA PRUEBA
──────────────────────────────────────────────────────────────
[Descripción de qué se mide y por qué es importante]

Ejemplo:
  Verificar que el sistema responde dentro de los umbrales de 
  tiempo comprometidos bajo carga realista (100 usuarios 
  concurrentes). El RNF-005 especifica: "El sistema debe responder
  en < 2 segundos en operaciones de lectura bajo 100 usuarios 
  concurrentes".


PARÁMETROS DE CARGA
──────────────────────────────────────────────────────────────

Usuarios concurrentes:          [número — ejemplo: 100]
Volumen de datos:               [tamaño BD — ejemplo: 10,000 requerimientos]
Duración de la prueba:          [tiempo — ejemplo: 15 minutos]

Escenario de carga:
  [Descripción del patrón de carga]
  Ejemplo:
    • Fase 1 (0-2 min): Ramp-up, 10 usuarios/segundo hasta 100
    • Fase 2 (2-12 min): Carga sostenida, 100 usuarios constantes
    • Fase 3 (12-15 min): Ramp-down, reducir de 100 a 0 usuarios
    
Distribución de operaciones:
  • Crear requerimiento:       20%
  • Leer requerimiento:        60%
  • Actualizar requerimiento:  15%
  • Eliminar requerimiento:    5%


UMBRAL DE ACEPTACIÓN
──────────────────────────────────────────────────────────────

Tiempo de respuesta:
  • Promedio:     < 2 segundos
  • Percentil 95: < 1.5 segundos
  • Máximo:       < 5 segundos

Throughput mínimo:
  • Transacciones/segundo: ≥ 50

Tasa de error máxima:
  • Errores HTTP 5xx: < 0.1%
  • Errores timeout: 0%

Utilización de recursos:
  • CPU: < 80%
  • Memoria: < 85%


RESULTADO ESPERADO
──────────────────────────────────────────────────────────────
[Descripción del comportamiento del sistema dentro de umbrales]

El sistema permanece estable bajo 100 usuarios concurrentes:
  • Todos los tiempos de respuesta dentro de los umbrales
  • Sin errores no capturados
  • Sin memory leaks detectados
  • Sistema completamente recuperado tras finalizar la prueba


HERRAMIENTA DE PRUEBA:           [LoadRunner, JMeter, Gatling, etc.]
ENTORNO:                        [staging | producción-similar]

8.3 Plantilla — Caso de Prueba de Aceptación del Cliente
text
═══════════════════════════════════════════════════════════════
CASO DE PRUEBA DE ACEPTACIÓN DEL CLIENTE
═══════════════════════════════════════════════════════════════

Código:                         [CP-XXX]
RF vinculado:                   [RF-XXX] o [conjunto de RF]
Tipo:                           aceptacion_cliente
Nivel de prueba:                aceptacion


CONTEXTO DE NEGOCIO
──────────────────────────────────────────────────────────────
[Descripción de qué necesidad del cliente verifica este caso]

EN LENGUAJE DE NEGOCIO, NO TÉCNICO.

Ejemplo:
  "El director comercial necesita poder descargar el SRS aprobado
   en formato PDF firmado para archivarlo en los registros de 
   contrato. Esto garantiza que ambas partes tienen constancia 
   del alcance acordado."

Stakeholder que lo supervisa:
  [Nombre] — [Stakeholder.id]
  Nivel de influencia: [alto | medio]
  (Ver M1-01 para perfil completo)


ESCENARIO DE USUARIO
──────────────────────────────────────────────────────────────
[Descripción del caso de uso real que el cliente ejecutará]

Ejemplo:
  "El gestor comercial finaliza la validación del SRS con el 
   equipo de desarrollo. Ambas partes acuerdan que el SRS v1.0 
   es correcto. El gestor necesita descargar el SRS en PDF con 
   la firma digital del cliente para archivo."


PASOS (en lenguaje de usuario, NO técnico)
──────────────────────────────────────────────────────────────
1. El cliente [acción observable, sin jerga técnica]
2. El sistema muestra / responde [descripción de lo que ve]
3. El cliente verifica [qué debe verificar]
...

Ejemplo:
  1. El cliente navega a la pantalla de SRS aprobado
     → El sistema muestra: "SRS PRJ-001 v1.0 - APROBADO"
  2. El cliente hace clic en botón "Descargar como PDF"
     → El sistema genera archivo PDF
  3. El cliente verifica que el PDF contiene:
     - Número de proyecto y versión
     - Fecha de aprobación
     - Firma digital del cliente
     - Firma digital del proveedor
     - Tabla de contenidos completa
     - Todos los requerimientos con criterios de aceptación


CRITERIO DE ACEPTACIÓN (firmable por el cliente)
──────────────────────────────────────────────────────────────

"El sistema se considera aceptado para este criterio si:

[Descripción verificable por el cliente sin conocimiento técnico]"

Ejemplo:
  "El cliente puede descargar el SRS en formato PDF, el archivo
   contiene todos los requerimientos del SRS aprobado, las firmas
   digitales son válidas, y el cliente puede archivarlo o
   compartirlo con otros departamentos."


RESULTADO DE LA EJECUCIÓN
──────────────────────────────────────────────────────────────

Estado:                         [pasado | fallado | bloqueado]

Observaciones del cliente:
  [Campo libre para comentarios, problemas detectados]
  
  Ejemplo:
    "PDF generado correctamente. Verificación de firma digital 
     exitosa. El cliente confirma que el documento es utilizable."

Firma de aceptación:
  Nombre:                       [representante del cliente]
  Cargo:                        [su rol en la Entidad]
  Fecha:                        [YYYY-MM-DD]
  Firma digital:                [aplicada por sistema]

8.4 Plantilla — Caso de Prueba de Regresión
text
═══════════════════════════════════════════════════════════════
CASO DE PRUEBA DE REGRESIÓN
═══════════════════════════════════════════════════════════════

Código:                         [CP-XXX-REG]
CP origen:                      [CP-XXX] — caso de prueba original que extiende
RF vinculado:                   [RF-XXX]
Tipo:                           regresion
Nivel de prueba:                sistema
Metodología:                    automatizado


MOTIVO DE INCLUSIÓN EN SUITE DE REGRESIÓN
──────────────────────────────────────────────────────────────

☐ RF implementado en sprint anterior — verificar que cambios
  posteriores no lo rompieron

☐ SolicitudCambioSRS aprobada que afecta este RF
  (Ver M3-09, Sección 5 — Cambios post-aprobación)
  SCR ID: [SolicitudCambioSRS.id]

☐ Defecto crítico corregido — verificar que no reaparece
  Defecto ID: [DefectoId]

☐ Cambio de arquitectura — verificar que integraciones siguen
  funcionando
  Cambio: [descripción del cambio]


FRECUENCIA DE EJECUCIÓN
──────────────────────────────────────────────────────────────

☐ En cada sprint          (metodología ágil_scrum | agil_xp)
  Ejecución: Fin de cada sprint, antes del Sprint Review

☐ Antes de cada entrega   (metodología cascada | rup | incremental)
  Ejecución: Antes de entregar a cliente

☐ Ante cada SCR aprobada  (SIEMPRE, todas las metodologías)
  Ejecución: 24 horas después de que el código de la SCR
             está integrado en rama principal


[El resto de campos son idénticos al CP funcional de origen]

PRECONDICIONES:              [igual que CP original]
PASOS DE EJECUCIÓN:         [igual que CP original]
RESULTADO ESPERADO:         [igual que CP original]
CRITERIO DE ACEPTACIÓN:     [igual que CP original]

9. Criterios de Aceptación del Sistema
Este es el TERCER ENTREGABLE CONCRETO de M3-10.

9.1 Distinción: criterios de salida (equipo) vs. criterios de aceptación (cliente)
Aspecto	Criterios de salida (equipo)	Criterios de aceptación (cliente)
¿Quién los evalúa?	El equipo de QA y desarrollo	El cliente (Stakeholder M1 con nivelInfluencia = 'alto')
¿Qué verifican?	Que el software funciona técnicamente según el SRS	Que el software sirve para el negocio del cliente
¿Cuándo?	Antes de entregar al cliente	Durante/después de pruebas de aceptación
¿Fuente?	Criterios de calidad técnica (Cap. 8 §8.1 Sommerville)	Criterios del SRS §1.3 + pruebas de usuario (§8.4)
¿Resultado formal?	Suite de pruebas: X% pasadas	Acta de aceptación firmada
9.2 Matriz de criterios de aceptación por criticidad del proyecto
Criticidad del proyecto	Criterio de aceptación requerido	Quién firma el acta
baja	100% CP Must Have pasados + 0 defectos críticos abiertos	Gestor del proyecto
media	Todo lo anterior + CP de rendimiento pasados + prueba alfa completada	Gestor + representante cliente
alta	Todo lo anterior + prueba beta completada + auditoría de seguridad básica	Admin + cliente (nivelInfluencia='alto')
critica	Todo lo anterior + pruebas de estrés pasadas + certificación de seguridad + aprobación de TODOS los stakeholders M1 con influencia 'alta'	Admin + todos los stakeholders M1 alta influencia
9.3 Proceso de acta de aceptación
Documento formal que cierra el ciclo del proyecto:

text
═══════════════════════════════════════════════════════════════
ACTA DE ACEPTACIÓN DEL SISTEMA
═══════════════════════════════════════════════════════════════

IDENTIFICACIÓN
───────────────────────────────────────────────────────────────
Proyecto:                       [Proyecto.nombre — Proyecto.id]
SRS versión aceptada:           [v1.X — especificar versión exacta]
Fecha de aceptación:            [YYYY-MM-DD]
Lugar:                          [Ubicación donde se firma]


CRITERIOS DE ACEPTACIÓN VERIFICADOS
───────────────────────────────────────────────────────────────

Para cada criterio de PlanPruebas.criteriosAceptacion:

[Criterio 1]:  ✅ Cumplido | ❌ No cumplido | ⚠️ Parcial
  Evidencia: [referencia a CP pasados o documentación]
  Descripción: [breve resumen de cómo se verificó]

[Criterio 2]:  ✅ Cumplido | ❌ No cumplido | ⚠️ Parcial
  Evidencia: [...]
  Descripción: [...]

...

Ejemplo completo:
  Criterio: 100% de CP tipo 'aceptacion_cliente' en estado 'pasado'
  Estado: ✅ Cumplido
  Evidencia: Suite de pruebas ejecutada el 2026-02-26
             CP-101: Registrar cliente — PASADO
             CP-102: Crear proyecto — PASADO
             CP-103: Exportar SRS como PDF — PASADO
  Descripción: Todas las pruebas de aceptación del cliente ejecutadas
               exitosamente. No se detectaron defectos bloqueantes.


DEFECTOS CONOCIDOS AL MOMENTO DE LA ACEPTACIÓN
───────────────────────────────────────────────────────────────

[Defectos que se acepta sean corregidos en versión posterior]

Si no hay defectos: "No hay defectos conocidos abiertos."

Si hay defectos conocidos (aceptados explícitamente):

| ID Defecto | Descripción | Severidad | Impacto | Versión compromiso |
|---|---|---|---|---|
| DEF-001 | Notificación por email no se envía en algunos casos | media | Bajo | v1.1 |
| DEF-002 | Reporte de trazabilidad tarda > 30 seg con 10k reqs | baja | Bajo | v1.2 |

Total defectos conocidos: [N]
Total defectos bloqueantes: 0 (condición de aceptación)


DECLARACIÓN DE ACEPTACIÓN
───────────────────────────────────────────────────────────────

"El cliente declara que el sistema entregado cumple los criterios 
de aceptación definidos en el SRS versión [v1.X] aprobado el 
[fecha], con los defectos conocidos documentados arriba. 

El cliente acepta el sistema para su despliegue en producción.

El proveedor declara que el sistema ha sido completamente probado 
de acuerdo con el Plan de Pruebas [PlanPruebas.id] y cumple con 
los criterios de salida documentados.

Ambas partes acuerdan que la entrega del sistema cumple con los 
términos del contrato y da por finalizada la obligación de 
desarrollo del proveedor."


FIRMANTES
───────────────────────────────────────────────────────────────

CLIENTE

Nombre:                         [representante de Entidad]
Cargo:                          [su rol en la Entidad]
Stakeholder ID:                 [M1-Stakeholder.id]
Nivel de influencia:            alto
Firma digital:                  [aplicada por sistema]
Fecha:                          [YYYY-MM-DD]


PROVEEDOR — GESTOR DEL PROYECTO

Nombre:                         [MiembroEquipo.nombre con rol pm]
Cargo:                          Gestor del Proyecto
Firma digital:                  [aplicada por sistema]
Fecha:                          [YYYY-MM-DD]


PROVEEDOR — ADMIN (si criticidad alta/critica)

Nombre:                         [usuario Admin del sistema]
Cargo:                          Administrador del sistema
Firma digital:                  [aplicada por sistema]
Fecha:                          [YYYY-MM-DD]


EFECTO DE ESTA ACTA
───────────────────────────────────────────────────────────────

Proyecto.estado:                → 'completado'
Proyecto.fechaAceptacion:       = [fecha de este acta]
Proyecto.aceptadoPor:           = Stakeholder.id del cliente
SRS.estado:                     → 'productivo' (en producción)
M2-04 cierre formal del proyecto

10. Pruebas por Metodología — Tabla de Impacto
Conexión entre M3-10 y M2-07 (metodología acordada):

Metodología (M2-07)	Cuándo se definen los CP	Quién ejecuta	Suite de regresión	Pruebas de aceptación	TDD
cascada	Después de aprobar SRS v1.0 completo	QA especializado	Antes de cada entrega formal	Al final del proyecto (una sola vez)	No
incremental	Antes de cada incremento	QA + analista	Entre incrementos	Por incremento (parcial)	No
rup	Durante fase de Elaboración (M2-04)	QA + analista	En cada fase de construcción	En hito Capacidad Operativa Inicial	No
agil_scrum	Antes del sprint (ATDD/BDD)	Todo el equipo	En cada sprint	En cada Sprint Review (PO acepta)	Sí
agil_xp	Antes del código (TDD obligatorio)	Pair programming	Continua (CI/CD)	En cada iteración (cliente presente)	Sí
hibrido	Según componente (mixto)	Según rol	Según componente	Combinado	Mixto
11. KPIs de Pruebas
KPI	Definición	Fórmula	Meta	Alerta
Cobertura de RF Must Have	% de RF Must Have con al menos un CP asignado y ejecutado	(RF_must_con_cp_ejecutado / total_RF_must) × 100	100% al cierre	< 85%
Tasa de defectos encontrados	Defectos por caso de prueba ejecutado	defectos_total / cp_ejecutados	Referencia del proyecto anterior (M2-08)	> 0.5 defectos/CP (indica SRS deficiente)
Tasa de CP pasados	% de CP ejecutados con resultado 'pasado'	(cp_pasados / cp_ejecutados) × 100	> 95% para cierre	< 80% al primer ciclo
Tiempo promedio de ejecución	Días desde inicio de pruebas hasta criterios de salida cumplidos	fecha_criterios_salida - fecha_inicio_pruebas	Según estimación de M2-02	> 120% del estimado
Densidad de defectos críticos	Defectos críticos por cada 10 RF Must Have	(defectos_criticos / total_RF_must) × 10	< 0.5	> 2 (indica riesgo de no aceptación)
Tasa de regresión	% de CP de regresión que fallan en cada ejecución	(cp_reg_fallados / total_cp_reg) × 100	< 5%	> 15% (indica inestabilidad del código)
12. Tabla de Conexiones con los 3 Módulos
Concepto de M3-10	Módulo donde impacta	Campo/proceso específico
CasoPrueba.criterioAceptacion	M3-04 — SRS	Hereda de Requerimiento.criterioAceptacion
EntradaTrazabilidad.casoPrueba	M3-09 — Trazabilidad	Vincula RF aprobado → CP asignado
CP tipo aceptacion_cliente	M1 — Stakeholders	Stakeholder.nivelInfluencia = 'alto' como supervisor
Acta de aceptación firmada	M2 — Estado del proyecto	Proyecto.estado → 'completado'
Defectos críticos abiertos	M2-04 — Seguimiento	Se registran como incidencias que afectan el plan
ResultadoPrueba.defectoId	M2-03 — Riesgos	Defectos recurrentes → riesgo de tipo 'técnico'
PlanPruebas.metodologiaPrueba	M2-07 — Metodología	dirigido_plan ↔ agil_tdd según metodología del proyecto
Velocidad de ejecución de CP	M2-02 — Estimación	KPI de densidad de defectos → ajuste de estimación futura (M2-08)
CP de regresión por SCR	M3-09 — Cambios	Cada SolicitudCambioSRS aprobada activa suite de regresión
13. Checklist de Completitud del Archivo
Ítem	Fuente en el libro	✅
Definición de V&V y propósito de las pruebas con cita (§8 intro)	Cap. 8 intro	✅
Distinción pruebas de validación (M3-05) vs. pruebas del código (M3-10)	Cap. 8 §8.1	✅
Límites fundamentales de las pruebas (no garantizan ausencia de defectos)	Cap. 8 §8 intro	✅
Pruebas de unidad: definición, estrategias, partición equivalencia (§8.1)	Cap. 8 §8.1, pp. 202-203	✅
Partición de equivalencia y análisis de valores límite con citas	Cap. 8 §8.1, p. 203	✅
Pruebas de componente: definición, tipos de interfaz, errores típicos (§8.1)	Cap. 8 §8.1, pp. 204-205	✅
Pruebas de sistema: definición y comportamiento emergente (§8.1)	Cap. 8 §8.1, p. 205	✅
Modelo en V con mapeo a capas del sistema austranet-cco	Cap. 8 §8.1 (implícito en jerarquía)	✅
Definición de TDD con cita textual (§8.2)	Cap. 8 §8.2, p. 207	✅
Ciclo TDD ROJO-VERDE-REFACTORIZAR con descripción	Cap. 8 §8.2, p. 207	✅
Beneficios del TDD según Sommerville (§8.2)	Cap. 8 §8.2, p. 207	✅
Límites del TDD: cuándo no usarlo (§8.2)	Cap. 8 §8.2, p. 208	✅
Pruebas de rendimiento: definición y diseño (§8.3)	Cap. 8 §8.3, pp. 209-210	✅
Pruebas de estrés: definición y diferencia con rendimiento (§8.3)	Cap. 8 §8.3, p. 210-211	✅
Pruebas de regresión: definición y relación con cambios (§8.3)	Cap. 8 §8.3, p. 211	✅
Tipos de pruebas de usuario (alfa, beta, aceptación) con citas (§8.4)	Cap. 8 §8.4, pp. 212-212	✅
Proceso de pruebas de aceptación con etapas del libro (§8.4)	Cap. 8 §8.4, pp. 212-214	✅
Advertencias de Sommerville sobre pruebas de aceptación (§8.4)	Cap. 8 §8.4, p. 214	✅
Pruebas de aceptación ágiles (por sprint/iteración)	Cap. 8 §8.4, p. 214	✅
Plantilla Plan de Pruebas completa con todos los campos PlanPruebas	Sistema	✅
Plantilla CP Funcional con todos los campos CasoPrueba	Sistema	✅
Plantilla CP Rendimiento con parámetros de carga	Sistema	✅
Plantilla CP Aceptación Cliente con acta	Sistema	✅
Plantilla CP Regresión con motivo de inclusión	Sistema	✅
Tabla de impacto por metodología (M2-07) en enfoque de pruebas	Sistema + M2-07	✅
6 KPIs con fórmulas y umbrales	Sistema	✅
Tabla de conexiones con M1, M2, M3	Sistema	✅
Bloque final de descripción de fuentes	Sistema	✅
14. Bloque Final de Fuentes
Documento generado con base en:

Sommerville, Ian. Ingeniería de Software, 9.ª edición.
Pearson Educación, 2011. Capítulo 8 completo:
§8.1 (Pruebas de desarrollo — unidad, componente, sistema), pp. 202-205;
§8.2 (Desarrollo dirigido por pruebas — TDD), pp. 207-208;
§8.3 (Pruebas de versión — rendimiento, estrés, regresión), pp. 209-211;
§8.4 (Pruebas de usuario y aceptación — alfa, beta, aceptación formal), pp. 212-214.

Extiende y coordina:

M3-04 (Criterio de aceptación del RF → origen del CP)

M3-05 (Validación del SRS — previa a las pruebas del código)

M3-09 (Trazabilidad RF → CP y control de cambios)

M2-07 (Metodología → estrategia de pruebas: TDD para XP/Scrum, dirigido_plan para Cascada)

M2-04 (Defectos encontrados → impacto en el plan del proyecto)

M2-08 (KPIs de pruebas → mejora entre proyectos)

No repite:

Definición de validación de requerimientos ni proceso de revisión formal del SRS (M3-05)

Trazabilidad RF-CP ni KPI de cobertura de trazabilidad (M3-09)

Integración continua ni pipeline CI/CD (M2-06)

Inspección de Fagan ni revisiones de código (M2-05)

Este archivo cierra el ciclo completo del Módulo 3:

El criterio de aceptación nace en M3-04 (especificación del RF),
se vincula en M3-09 (trazabilidad), y se ejecuta y verifica aquí (M3-10).
El campo Requerimiento.criterioAceptacion = DADO/CUANDO/ENTONCES es el mismo
en las tres capas: documentación de requisitos, matriz de trazabilidad y casos de prueba.
Sin esta continuidad, los requerimientos y su verificación se desacoplan irremediablemente.

FIN DEL DOCUMENTO M3-10-pruebas-aceptacion.md — Versión 1.0.0 — 2026-02-26