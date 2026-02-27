# M3-05-validacion-requerimientos.md

---

## Metadatos

| Campo | Valor |
|---|---|
| **Archivo** | `M3-05-validacion-requerimientos.md` |
| **Módulo** | Módulo 3 — Documentación de Alcance (SRS) |
| **Capítulo fuente** | Cap. 4 §4.6 — Validación de requerimientos (Sommerville, 9ª Ed.) |
| **Fuente complementaria** | Cap. 4 §4.5 (proceso IR), Cap. 3 (metodologías ágiles) |
| **Versión** | 1.0 |
| **Fecha** | 2026-02-25 |
| **Estado del SRS cubierto** | `en_validacion` → `aprobado` \| `con_observaciones` |
| **Archivos anteriores** | M3-01, M3-02, M3-03, M3-04 |

---

## 1. Objetivo del Documento

Este archivo documenta la **validación de requerimientos**, la quinta y última actividad activa del proceso de Ingeniería de Requerimientos en el sistema `austranet-cco`. Cubre el estado `en_validacion` del SRS y las dos transiciones de salida posibles: `aprobado` y `con_observaciones`.

La validación es la actividad **más crítica** del proceso IR porque es la **última oportunidad** de detectar errores en los requerimientos antes de que el equipo de desarrollo comience a implementarlos. Sommerville lo expresa con claridad: *"los errores en un documento de requerimientos pueden conducir a grandes costos por tener que rehacer, cuando dichos problemas se descubren durante el desarrollo del sistema o después de que éste se halla en servicio"* (Cap. 4 §4.6, p. 110). Esta dinámica de costo exponencial se describe en M3-04, Sección 4: un problema detectado en validación cuesta órdenes de magnitud menos que el mismo problema detectado durante el desarrollo o en producción.

### Salidas posibles del estado `en_validacion`

| Salida | Estado resultante | Condición | Efecto inmediato |
|---|---|---|---|
| **Aprobación** | `aprobado` → versión `v1.0` | Sin defectos críticos ni mayores abiertos | Proyecto transiciona a `activo_en_desarrollo` en M2 |
| **Observaciones** | `con_observaciones` | Defectos críticos o mayores encontrados | SRS bloqueado; regresa a `en_especificacion` con lista de correcciones |

---

## 2. Validación de Requerimientos (Cap. 4 §4.6)

### 2.1 Definición Formal

Sommerville define la validación de requerimientos en los siguientes términos exactos:

> *"La validación de requerimientos es el proceso de verificar que los requerimientos definan realmente el sistema que en verdad quiere el cliente. Se traslapa con el análisis, ya que se interesa por encontrar problemas con los requerimientos."*
> — (Cap. 4 §4.6, p. 110)

Esta definición es precisa: validar no es revisar que el documento esté bien escrito, sino verificar que **lo que está escrito corresponde a lo que el cliente realmente necesita**. Es una distinción fundamental que diferencia la validación de la verificación.

### 2.2 Validación vs. Verificación

Estas dos actividades se confunden frecuentemente. La distinción es:

| Actividad | Pregunta que responde | ¿Quién puede hacerla? | Cuándo ocurre en austranet-cco |
|---|---|---|---|
| **Verificación** | ¿Estamos construyendo el producto **correctamente**? (¿el software cumple la especificación?) | El equipo técnico (analista, QA) | Reglas de calidad M3-04 §8: antes de pasar a `en_validacion` |
| **Validación** | ¿Estamos construyendo el **producto correcto**? (¿la especificación refleja lo que el cliente realmente necesita?) | Requiere participación activa del cliente | Proceso de revisión formal: durante `en_validacion` |

> ⚠️ **Punto crítico**: Un SRS puede ser internamente consistente, bien estructurado y pasar todas las reglas de calidad de M3-04 (verificación), y **aun así ser incorrecto** si el cliente no lo valida. La verificación es condición necesaria pero no suficiente para la aprobación del SRS.

El sistema `austranet-cco` implementa **ambas**:
- **Verificación** → mediante el checklist automático de calidad (M3-04, Sección 8) que bloquea la transición a `en_validacion` si no se cumplen las reglas técnicas.
- **Validación** → mediante el proceso de revisión formal con el cliente documentado en este archivo.

### 2.3 Los 5 Tipos de Problemas que la Validación Debe Detectar

Sommerville identifica cinco tipos de comprobaciones que deben realizarse durante la validación (Cap. 4 §4.6, p. 110-111). Estos cinco tipos son el **vocabulario oficial** del sistema para clasificar defectos del SRS:

| # | Tipo | Definición según Sommerville | Campo `tipo` en registro de defecto |
|---|---|---|---|
| 1 | **Validez** | *"Un usuario quizá crea que necesita un sistema para realizar ciertas funciones. Sin embargo, con mayor consideración y análisis se logra identificar las funciones adicionales o diferentes que se requieran."* ¿El sistema hace lo que el usuario **realmente** necesita? | `validez` |
| 2 | **Consistencia** | *"Los requerimientos en el documento no deben estar en conflicto. Esto es, no debe haber restricciones contradictorias o descripciones diferentes de la misma función del sistema."* | `consistencia` |
| 3 | **Completitud** | *"El documento de requerimientos debe incluir requerimientos que definan todas las funciones y las restricciones pretendidas por el usuario."* ¿Faltan requerimientos? | `completitud` |
| 4 | **Realismo** | *"Al usar el conocimiento de la tecnología existente, los requerimientos deben comprobarse para garantizar que en realidad pueden implementarse. Dichas comprobaciones también tienen que considerar el presupuesto y la fecha para el desarrollo del sistema."* | `realismo` |
| 5 | **Verificabilidad** | *"Para reducir el potencial de disputas entre cliente y contratista, los requerimientos del sistema deben escribirse siempre de manera que sean verificables. Esto significa que usted debe ser capaz de escribir un conjunto de pruebas que demuestren que el sistema entregado cumpla cada requerimiento especificado."* | `verificabilidad` |

*(Cap. 4 §4.6, pp. 110-111)*

### 2.4 Por Qué la Validación Requiere Participación Activa del Cliente

Sommerville advierte explícitamente sobre los límites de la validación sin el cliente:

> *"A final de cuentas, es difícil demostrar que un conjunto de requerimientos, de hecho, no cubre las necesidades de los usuarios. Estos últimos necesitan una imagen del sistema en operación, así como comprender la forma en que dicho sistema se ajustará a su trabajo. Es difícil, incluso para profesionales de la computación experimentados, realizar este tipo de análisis abstracto, y más aún para los usuarios del sistema. Como resultado, rara vez usted encontrará todos los problemas de requerimientos durante el proceso de validación de requerimientos."*
> — (Cap. 4 §4.6, p. 111)

Esta advertencia tiene implicaciones directas para el sistema: el analista **no puede validar por sí solo** que el SRS refleja las necesidades reales del cliente. La participación del stakeholder de influencia `alta` (M1) es obligatoria, no opcional.

> **Aplicación en el sistema:** Los 5 tipos de problemas de Sommerville son las 5 dimensiones del checklist de validación del Módulo 3 y el vocabulario estándar del campo `tipo` en el registro de defectos (Sección 5.3). Un SRS no puede pasar a estado `aprobado` si tiene defectos abiertos de severidad `critico` o `mayor` en cualquiera de estas 5 dimensiones. La verificación técnica (M3-04, §8) actúa como filtro previo de `completitud` y `verificabilidad`, pero la validación de `validez` solo puede confirmarla el cliente.

---

## 3. Técnicas de Validación (Cap. 4 §4.6)

Sommerville identifica tres técnicas que pueden usarse individualmente o en conjunto:

> *"Hay algunas técnicas de validación de requerimientos que se usan individualmente o en conjunto con otras."* — (Cap. 4 §4.6, p. 110)

### 3.1 Revisiones de Requerimientos

> *"Una revisión de requerimientos es un proceso donde un grupo de personas del cliente del sistema y el desarrollador del sistema leen con detalle el documento de requerimientos y buscan errores, anomalías e inconsistencias. Una vez detectados y registrados, recae en el cliente y el desarrollador la labor de negociar cómo resolver los problemas identificados."*
> — (Cap. 4 §4.6, p. 111)

Sommerville distingue entre revisión informal y revisión formal:

| Tipo | Descripción | Cuándo usarla en austranet-cco |
|---|---|---|
| **Revisión informal** | Los desarrolladores discuten el SRS internamente sin proceso estructurado | Pre-revisión interna del equipo antes de iniciar la revisión formal (Fase 0) |
| **Revisión formal** | Proceso estructurado con roles definidos, agenda, registro de defectos y decisión explícita | Obligatoria para la transición `en_validacion → aprobado` o `en_validacion → con_observaciones` |

El proceso de revisión formal completo se detalla en la **Sección 4** de este documento.

**Roles en la revisión:**
- **Moderador:** Coordina la sesión, garantiza que el proceso se siga
- **Autor del SRS:** Presenta el documento y aclara dudas (no defiende, explica)
- **Revisor técnico:** Arquitecto o desarrollador senior; verifica realismo y verificabilidad
- **Revisor del cliente:** Stakeholder de influencia `alta` (M1); valida que el SRS refleja sus necesidades reales
- **QA:** Tester del equipo; verifica que los RF son testeables y tienen criterio de aceptación
- **Secretario:** Registra cada defecto con precisión durante la sesión

### 3.2 Prototipado

> *"En esta aproximación a la validación, se muestra un modelo ejecutable del sistema en cuestión a los usuarios finales y clientes. Así, ellos podrán experimentar con este modelo para constatar si cubre sus necesidades reales."*
> — (Cap. 4 §4.6, p. 110-111)

**Diferencia con el prototipado de adquisición (M3-02):** En la fase `en_adquisicion`, el prototipado es *exploratorio*: sirve para descubrir requerimientos que el cliente no sabe articular. En la fase `en_validacion`, el prototipo es *confirmatorio*: sirve para que el cliente verifique que lo que está escrito en el SRS es efectivamente lo que quiere.

**Tipos de prototipos para validación:**

| Tipo | Descripción | Cuándo usar | Riesgo según Sommerville |
|---|---|---|---|
| **Desechable (throwaway)** | Prototipo construido específicamente para validar el SRS; se descarta tras la validación | Cuando hay alta incertidumbre sobre interfaces o flujos de usuario | Presión para convertirlo en producto real; debe descartarse |
| **Evolutivo** | Prototipo que evoluciona hasta convertirse en el sistema final | Proyectos donde los requerimientos son estables tras la validación | Mayor riesgo: se sacrifica calidad interna por velocidad de entrega |

**Qué valida mejor un prototipo que una revisión en papel:**
- Interfaces de usuario (¿la pantalla tiene el flujo correcto?)
- RNF de usabilidad (¿es intuitivo para el usuario real?)
- Flujos complejos con múltiples actores y condiciones
- Requerimientos de dominio cuya validación requiere "ver" el comportamiento

**Limitaciones del prototipado como técnica de validación:**
- No puede validar RNF de rendimiento, seguridad o escalabilidad
- No puede validar la completitud del SRS (puede demostrar que algo funciona, pero no que nada falta)
- Es costoso en tiempo y puede retrasar la transición al desarrollo

### 3.3 Generación de Casos de Prueba

> *"Los requerimientos deben ser comprobables. Si las pruebas para los requerimientos se diseñan como parte del proceso de validación, esto revela con frecuencia problemas en los requerimientos. Si una prueba es difícil o imposible de diseñar, esto generalmente significa que los requerimientos serán difíciles de implementar, por lo que deberían reconsiderarse."*
> — (Cap. 4 §4.6, p. 111)

**El proceso:**

```
Para cada RF Must Have:
  1. Intentar escribir su caso de prueba en formato DADO/CUANDO/ENTONCES
  2. Si el caso de prueba puede escribirse → el RF está bien especificado
  3. Si el caso de prueba es ambiguo → el RF usa palabras prohibidas (Ver M3-04, Sección 5)
  4. Si el caso de prueba es imposible → el RF está mal especificado o no es implementable
  5. Si no existe criterioAceptacion → el RF no puede pasar a `en_validacion`
```

**Relación directa con el tipo `Requerimiento` del sistema:**

El campo `criterioAceptacion` (en formato `DADO/CUANDO/ENTONCES`) del tipo `Requerimiento` **es** el caso de prueba de validación. No son dos artefactos separados: el criterio de aceptación escrito durante la especificación (M3-04) es exactamente el caso de prueba que se usa durante la validación (M3-05) y que luego se convierte en caso de prueba de QA en M2.

**Flujo de vida del caso de prueba:**

```
[M3-04 en_especificacion]          → criterioAceptacion = "DADO X / CUANDO Y / ENTONCES Z"
[M3-05 en_validacion]              → se intenta ejecutar el criterioAceptacion sobre el prototipo
                                      o se revisa su coherencia con la descripción del RF
[M2 activo_en_desarrollo]          → QA usa el mismo criterioAceptacion como caso de prueba
[Requerimiento.estado = implementado] → criterioAceptacion fue ejecutado y pasó
```

> **Aplicación en el sistema:** La generación de casos de prueba es la técnica de validación más directamente implementable en el sistema. Para cada RF con `prioridad: 'must'`, el sistema **debe verificar automáticamente** que el campo `criterioAceptacion` existe y no está vacío antes de permitir la transición del SRS a `en_validacion`. Este es el único bloqueo técnico automático de la transición; los demás controles son procesuales (revisión formal con el cliente).

---

## 4. El Proceso de Revisión Formal del SRS

El proceso de revisión formal combina las directrices de Sommerville (Cap. 4 §4.6) con el esquema de inspecciones de Fagan (referenciado en M3-01, Sección 3). Es el entregable operativo más importante de este archivo y debe implementarse directamente como el flujo de la pantalla de validación del Módulo 3.

### 4.1 Participantes y Roles

| Rol | Perfil | Responsabilidad en la revisión |
|---|---|---|
| **Moderador** | Gestor del proyecto (M2) | Coordinar la sesión, garantizar que el proceso se siga, emitir la decisión final |
| **Autor del SRS** | Analista del equipo | Presentar el SRS sección por sección, aclarar dudas sin defender posiciones |
| **Revisor técnico** | Arquitecto o desarrollador senior | Verificar realismo (¿es implementable?) y verificabilidad (¿puede probarse?) |
| **Revisor del cliente** | Stakeholder con `nivelInfluencia: 'alto'` (M1) | Validar que el SRS refleja sus necesidades reales (validez); sin su firma no hay aprobación |
| **QA** | Tester del equipo | Verificar que todos los RF `must` tienen `criterioAceptacion` en formato DADO/CUANDO/ENTONCES |
| **Secretario** | Cualquier miembro del equipo | Registrar cada defecto con todos sus campos durante la sesión |

> ⚠️ La participación del **Revisor del cliente** (stakeholder `nivelInfluencia: 'alto'`) es **obligatoria**. Si no asiste, la reunión de revisión no puede realizarse y la transición a `aprobado` es imposible.

### 4.2 Proceso Paso a Paso

#### FASE 1 — Distribución (3-5 días antes de la reunión)

1. El Autor del SRS cierra la versión `v0.X` y la distribuye a todos los participantes
2. Cada revisor lee el SRS de forma independiente y prepara su lista individual de defectos potenciales, clasificados por tipo (los 5 tipos de la Sección 2.3)
3. El Moderador confirma la asistencia del stakeholder de `nivelInfluencia: 'alto'` del M1
4. Si el stakeholder clave no puede asistir → se reprograma la reunión (no se hace sin él)

#### FASE 2 — Reunión de Revisión (2-4 horas)

1. **Apertura:** El Moderador presenta la agenda y el objetivo (detectar defectos, no evaluar al autor)
2. **Presentación:** El Autor presenta el SRS sección por sección (no requerimiento por requerimiento)
3. **Revisión:** Los revisores exponen los defectos encontrados en su preparación previa
4. **Registro:** El Secretario registra cada defecto con todos los campos (ver Sección 4.3)
5. **No resolución en sesión:** Los defectos se registran; no se debaten soluciones en la reunión
6. **Decisión final** (emitida por el Moderador + Revisor del cliente):

| Decisión | Condición | Estado SRS resultante |
|---|---|---|
| **Aprobado** | Sin defectos críticos ni mayores | `aprobado` (v1.0) |
| **Aprobado con cambios menores** | Solo defectos `menor`; moderador verifica correcciones | `aprobado` tras verificación del moderador |
| **Con observaciones** | Defectos `crítico` o `mayor` encontrados | `con_observaciones` → regresa a `en_especificacion` |

#### FASE 3 — Resolución (según severidad del defecto)

| Severidad | Acción requerida | ¿Bloquea la aprobación? |
|---|---|---|
| `critico` | Debe resolverse **antes de avanzar**; puede requerir re-adquisición (volver a `en_adquisicion`) | Sí, siempre |
| `mayor` | Debe resolverse antes del estado `aprobado` | Sí |
| `menor` | Puede resolverse en la siguiente versión del SRS (`v1.X`) | No (el moderador puede aprobar directamente) |

#### FASE 4 — Seguimiento y Cierre

1. El Autor aplica las correcciones requeridas y actualiza el SRS (versión sube: `v0.X+1`)
2. El Moderador verifica que **todos** los defectos `critico` y `mayor` fueron resueltos
3. **Si los cambios son significativos** (afectan el alcance o la arquitectura): segunda revisión completa
4. **Si solo correcciones menores**: el Moderador aprueba directamente sin nueva reunión
5. Acta de aprobación firmada por el Moderador + Revisor del cliente → SRS pasa a `aprobado` (`v1.0`)

### 4.3 Registro de Defectos

Plantilla operativa de cada defecto detectado durante la revisión:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` | `DEF-XXX` (secuencial dentro del SRS) |
| `srsId` | `string` | ID del SRS bajo revisión |
| `requerimientoId` | `string?` | Código del RF/RNF afectado (ej. `RF-007`); nulo si el defecto es del SRS como documento |
| `seccion` | `string` | Sección del SRS donde aparece el problema |
| `tipo` | `enum` | `validez` \| `consistencia` \| `completitud` \| `realismo` \| `verificabilidad` |
| `descripcion` | `string` | Descripción precisa de qué está mal y por qué |
| `severidad` | `enum` | `critico` \| `mayor` \| `menor` |
| `responsable` | `string` | ID del miembro del equipo que lo corrige |
| `estado` | `enum` | `abierto` \| `en_correccion` \| `resuelto` \| `diferido` |
| `fechaDeteccion` | `Date` | Timestamp de registro durante la sesión |
| `fechaResolucion` | `Date?` | Timestamp cuando el moderador confirma la resolución |

**Ejemplo de defecto bien registrado:**

```
DEF-003
srsId: SRS-2024-012
requerimientoId: RF-015
seccion: 3.2 Requerimientos Funcionales
tipo: verificabilidad
descripcion: RF-015 dice "el sistema deberá responder en un tiempo razonable".
             La palabra "razonable" es ambigua y no puede escribirse un caso de prueba
             que la valide. Ver reglas de palabras prohibidas en M3-04, Sección 5.
severidad: mayor
responsable: ANA-001 (Analista principal)
estado: abierto
fechaDeteccion: 2026-02-25T14:30:00
```

---

## 5. Transiciones de Estado del SRS

### 5.1 Diagrama de Transiciones

```
[en_especificacion]
      │
      │  Condición: Checklist M3-04 §8 completo
      │  (todos los RF must tienen criterioAceptacion,
      │   todos los RNF tienen métrica, sin duplicados,
      │   matriz de trazabilidad completa)
      ▼
[en_validacion]
      │
      ├─────────────────────────────────────────┐
      │                                         │
      │  Sin defectos críticos ni mayores        │  Defectos críticos o mayores
      ▼                                         ▼
[aprobado]                            [con_observaciones]
  versión: v1.0                              │
  Efecto cascada →                          │  Correcciones aplicadas
  activo_en_desarrollo (M2)                 │  versión: v0.X+1
                                            ▼
                                    [en_especificacion]
                                            │
                                            │  Segunda revisión
                                            ▼
                                    [en_validacion] → [aprobado]
```

### 5.2 Tabla de Transiciones

| Transición | Quién ejecuta | Condición | Documenta | Efecto en cascada |
|---|---|---|---|---|
| `en_especificacion → en_validacion` | Analista | Checklist M3-04 §8 completo; todos los RF `must` con `criterioAceptacion` | Solicitud de revisión formal | Notifica a todos los revisores; agenda la reunión |
| `en_validacion → aprobado` | Moderador + Revisor cliente | Sin defectos `critico` ni `mayor` abiertos; acta firmada | Acta de aprobación firmada | SRS: `v0.X → v1.0`; Proyecto M2: `activo_en_definicion → activo_en_desarrollo` |
| `en_validacion → con_observaciones` | Moderador | Defectos `critico` o `mayor` encontrados en revisión | Registro completo de defectos | SRS bloqueado; notifica al Autor |
| `con_observaciones → en_especificacion` | Analista | Inicia correcciones de defectos registrados | Nota de re-trabajo | Versión sube: `v0.X → v0.X+1` |
| `en_especificacion → en_validacion` _(2ª vez)_ | Analista | Segunda revisión: defectos `critico`/`mayor` resueltos | Segunda solicitud de revisión | Si solo menores pendientes: moderador puede aprobar sin nueva reunión |

### 5.3 El Efecto Cascada de la Aprobación

Cuando el SRS pasa al estado `aprobado`, se desencadenan las siguientes acciones en el sistema completo:

#### En el SRS (M3):
1. **Versión cambia:** `v0.X → v1.0` (ver reglas de versionado en M3-04, Sección 6)
2. **Se registra `aprobadoPor`:** ID del stakeholder de `nivelInfluencia: 'alto'` del M1 que firmó el acta
3. **Se registra `fechaAprobacion`:** Timestamp del momento de aprobación

#### En el Proyecto (M2):
4. **El proyecto recibe notificación** para ejecutar la transición:
   `activo_en_definicion → activo_en_desarrollo`
5. **El registro de riesgos del M2 se actualiza:** Los `RiesgoProyecto` de tipo `requerimientos` pasan a estado `mitigado` si el SRS fue aprobado sin observaciones críticas pendientes
6. **La estimación de costos puede refinarse:** El `presupuestoEstimado` del M2 se actualiza ahora que el SRS `v1.0` define el alcance completo y confirmado (ver M2-02)

#### En las Entidades (M1):
7. **El historial del stakeholder** que firmó el acta queda registrado como aprobador del SRS en el contexto de ese proyecto

> ⚠️ **Este es el momento de mayor impacto en el sistema completo.** La aprobación del SRS desencadena acciones en M1, M2 y M3 simultáneamente. Debe implementarse como una transacción atómica: si alguna de las acciones falla, el estado del SRS no debe quedar en `aprobado`.

---

## 6. Manejo del Estado `con_observaciones`

### 6.1 `con_observaciones` vs. Rechazo Total

| Aspecto | `con_observaciones` | Rechazo total (implícito) |
|---|---|---|
| **Naturaleza** | Aprobación **condicional**: el cliente acepta el SRS con correcciones conocidas y acordadas | No aprobado; requiere re-especificación significativa |
| **Lista de correcciones** | Explícita, registrada formalmente, con responsables y fechas | A determinar; puede requerir volver a `en_adquisicion` |
| **Esfuerzo requerido** | Correcciones acotadas; el analista sabe exactamente qué corregir | Posible reinicio del proceso de IR |
| **Próximo estado** | `en_especificacion` (correcciones) → `en_validacion` (re-revisión) | Puede ser `en_adquisicion` si los problemas son de validez profunda |

### 6.2 Información que Debe Registrar el Sistema

Cuando el SRS queda en estado `con_observaciones`, el sistema debe capturar:

- **Lista completa de defectos** con severidad, responsable y fecha límite de resolución
- **Estado de cada `Requerimiento`:** cuáles quedan en estado `aprobado` (sin observaciones) y cuáles en estado `propuesto` (con observaciones pendientes)
- **Decisión sobre inicio incremental:** si existen RF `must` ya aprobados sin observaciones, el Moderador puede autorizar el inicio del desarrollo solo para esos RF mientras se resuelven las observaciones del resto
- **Fecha límite para resolver:** acordada con el cliente durante la sesión de revisión

### 6.3 Cuándo No se Requiere Nueva Revisión Completa

Un SRS en estado `con_observaciones` puede regresar directamente a `aprobado` (`v1.0`) sin nueva reunión de revisión completa **solo si**:
- Todos los defectos pendientes eran de severidad `menor`
- El Moderador puede verificar las correcciones de forma unilateral revisando el documento
- El Revisor del cliente confirmó explícitamente que las correcciones menores no cambian el alcance aprobado

Si los defectos incluían `critico` o `mayor`, siempre se requiere una segunda reunión de revisión formal.

---

## 7. Checklist Operativo: Validación Completa

Lista de verificación que el sistema debe comprobar antes de permitir que el Moderador marque el SRS como `aprobado`:

### Verificación Técnica (equipo — automatizable)

- [ ] Todos los RF con `prioridad: 'must'` tienen `criterioAceptacion` en formato DADO/CUANDO/ENTONCES
- [ ] Todos los RNF tienen métrica cuantificable en la descripción (Ver M3-04, Sección 3)
- [ ] No hay RF con `codigo` duplicado en el SRS
- [ ] La matriz de trazabilidad está completa: cada RF tiene `fuente` vinculada a un stakeholder de M1
- [ ] No hay defectos con `estado: 'abierto'` y `severidad: 'critico'`
- [ ] No hay defectos con `estado: 'abierto'` y `severidad: 'mayor'`

### Verificación con el Cliente (procedimental — requiere confirmación manual)

- [ ] Al menos 1 stakeholder con `nivelInfluencia: 'alto'` (M1) participó en la revisión formal
- [ ] El cliente confirmó que los RF reflejan sus necesidades reales (verificación de **validez**)
- [ ] El cliente revisó y aceptó el alcance de la Sección 2 del SRS (Descripción General)
- [ ] Los RF con `prioridad: 'wont'` (Won't Have) fueron explícitamente acordados con el cliente — sin sorpresas de alcance
- [ ] El cliente firmó el acta de aprobación

### Verificación Formal (estado del sistema)

- [ ] El SRS está en versión `v0.X` (cambiará automáticamente a `v1.0` al aprobar)
- [ ] El campo `aprobadoPor` tiene el ID del stakeholder firmante
- [ ] El proyecto en M2 está en estado `activo_en_definicion` (condición para recibir el trigger de transición)

---

## 8. Validación en Proyectos Ágiles

### 8.1 Validación Continua vs. Evento Único

En proyectos con metodología `agil_scrum`, Sommerville señala (Cap. 3) que los requerimientos se gestionan de forma incremental. En lugar de un único evento de validación al final del proceso de IR, la validación es **continua** a lo largo del proyecto:

- Cada **Sprint Review** es un mecanismo de validación incremental: el cliente valida que el incremento entregado cumple los requerimientos del Sprint
- El **Product Backlog** reemplaza parcialmente al SRS como artefacto de requerimientos vivo
- El **Definition of Done (DoD)** define los criterios de calidad que un ítem debe cumplir antes de considerarse completado, reemplazando parcialmente al `criterioAceptacion` formal

### 8.2 Cuándo un Proyecto Ágil Necesita un SRS Formal Aprobado

A pesar de la naturaleza iterativa de los proyectos ágiles, un SRS formal con proceso de validación completo es necesario en los siguientes casos:

- **Clientes externos** con contrato de alcance fijo: el SRS es parte del contrato y define las obligaciones legales
- **Regulaciones o cumplimiento normativo:** sistemas de salud, financieros o de infraestructura crítica requieren documentación formal aprobada
- **Equipos distribuidos o subcontratación:** cuando el desarrollo lo realiza un tercero, el SRS es el contrato técnico

### 8.3 Adaptación del Proceso de Revisión para Proyectos Ágiles

Para proyectos `agil_scrum`, el proceso de revisión formal puede adaptarse:

| Aspecto | Proceso estándar | Adaptación ágil |
|---|---|---|
| **Unidad de revisión** | SRS completo como documento | SRS organizado por **épicas**; revisión épica por épica |
| **Frecuencia** | Una revisión al final de `en_especificacion` | Revisión al completar cada épica durante el sprint de especificación |
| **Participantes** | Todos los roles simultáneamente | Product Owner + Tech Lead por épica; QA integrado en el sprint |
| **Criterio de aprobación** | SRS `v1.0` completo | Épica aprobada → sus RF pasan a `aprobado` individualmente |

> **Aplicación en el sistema:** Para proyectos con `metodologia: 'agil_scrum'`, el sistema puede habilitar la opción de **validación incremental por épica** en lugar de validación del SRS completo. Esto significa que el SRS puede pasar a `aprobado` de forma parcial, épica por épica, y el proyecto puede transicionar a `activo_en_desarrollo` cuando las épicas del MVP (RF `must`) estén aprobadas. Esta configuración se activa durante la aprobación del proyecto en M2-01, PASO 7.

---

## 9. KPIs del Proceso de Validación

El sistema calcula las siguientes métricas para evaluar la calidad del proceso de validación de cada SRS:

| KPI | Definición | Fórmula | Meta | Alerta |
|---|---|---|---|---|
| **Tasa de defectos** | Defectos encontrados por cada 10 RF | `(total_defectos / total_rf) × 10` | < 2 defectos / 10 RF | > 5 defectos / 10 RF |
| **Severidad de defectos** | % de defectos críticos sobre el total | `(defectos_criticos / total_defectos) × 100` | 0% | > 10% |
| **Ciclos de revisión** | Veces que el SRS volvió a `en_especificacion` | `count(transiciones con_obs → en_spec)` | ≤ 1 | ≥ 3 |
| **Participación del cliente** | % de stakeholders de influencia `alta` que asistieron | `(asistieron / total_alta_influencia) × 100` | 100% | < 75% |
| **Tiempo en validación** | Días entre entrada a `en_validacion` y `aprobado` | `fechaAprobacion − fechaEntradaValidacion` | < 15 días | > 30 días |
| **RF aprobados sin cambios** | % de RF que pasaron validación sin modificación | `(rf_sin_cambios / total_rf) × 100` | > 70% | < 50% |

**Interpretación de los KPIs:**

- Una **tasa de defectos alta** (> 5/10 RF) indica problemas sistemáticos en el proceso de especificación → revisar M3-04, reglas de escritura y palabras prohibidas
- **Ciclos ≥ 3** indica que la adquisición de requerimientos fue insuficiente → puede requerir reforzar la aplicación de técnicas de M3-02
- **Participación del cliente < 75%** invalida la revisión: sin el cliente no hay validación de validez

---

## 10. Tabla de Conexiones entre los 3 Módulos

| Concepto / Proceso | Módulo | Campo o proceso específico |
|---|---|---|
| Stakeholders que validan | **M1** | `Stakeholder.nivelInfluencia = 'alto'`; sin este perfil no hay aprobación válida |
| Nivel de riesgo de la entidad | **M1** | `Entidad.nivelRiesgo`: entidades de riesgo `critico` requieren doble validación |
| Riesgos de requerimientos | **M2** | `RiesgoProyecto.tipo = 'requerimientos'` → pasan a `mitigado` al aprobar SRS |
| Transición del proyecto | **M2** | `activo_en_definicion → activo_en_desarrollo` (trigger por aprobación del SRS) |
| Refinamiento de estimación | **M2** | `presupuestoEstimado` actualizable post-SRS `v1.0` con alcance confirmado |
| Estado del proyecto | **M2** | Proyecto debe estar en `activo_en_definicion` para recibir el trigger |
| Acta de aprobación | **M3** | `SRS.aprobadoPor` + `SRS.fechaAprobacion` |
| Registro de defectos | **M3** | Subcolección `SRS/{id}/defectos` (DEF-XXX); propuesto para v2 del modelo de datos |
| Criterio de aceptación | **M3** | `Requerimiento.criterioAceptacion` (DADO/CUANDO/ENTONCES) = caso de prueba |
| Versión del SRS | **M3** | `SRS.version`: `v0.X` en borrador, `v1.0` al aprobar (Ver M3-04, Sección 6) |
| Estado del requerimiento | **M3** | `Requerimiento.estado`: pasa de `propuesto` a `aprobado` al cerrar la validación |

---

## 11. Checklist de Completitud del Archivo

| Ítem | Fuente | ✅ |
|---|---|---|
| Definición formal de validación de requerimientos (texto original) | Cap. 4 §4.6, p. 110 | ✅ |
| Distinción validación vs. verificación con implicaciones para el sistema | Cap. 4 §4.6 | ✅ |
| Los 5 tipos de problemas (comprobaciones) con citas textuales | Cap. 4 §4.6, pp. 110-111 | ✅ |
| Mapeo de los 5 tipos al campo `tipo` del registro de defectos | Sistema austranet-cco | ✅ |
| Técnica: Revisiones de requerimientos (informal vs. formal) | Cap. 4 §4.6, p. 111 | ✅ |
| Técnica: Prototipado (desechable vs. evolutivo, limitaciones) | Cap. 4 §4.6, pp. 110-111 | ✅ |
| Técnica: Generación de casos de prueba y su relación con `criterioAceptacion` | Cap. 4 §4.6, p. 111 | ✅ |
| Proceso de revisión formal: 4 fases completas | Cap. 4 §4.6 + Fagan | ✅ |
| Tabla de roles en la revisión (6 roles) | Cap. 4 §4.6 | ✅ |
| Plantilla de registro de defectos (DEF-XXX) con todos los campos | Sistema austranet-cco | ✅ |
| Diagrama de transiciones de estado del SRS | Sistema austranet-cco | ✅ |
| Tabla de transiciones con condiciones y efectos | Sistema austranet-cco | ✅ |
| Efecto cascada de la aprobación (6 acciones simultáneas) | M1 + M2 + M3 | ✅ |
| Diferencia `con_observaciones` vs. rechazo total | Sistema austranet-cco | ✅ |
| Información requerida cuando SRS queda en `con_observaciones` | Sistema austranet-cco | ✅ |
| Checklist operativo de validación completa (3 secciones) | Cap. 4 §4.6 + sistema | ✅ |
| Validación en proyectos ágiles (Sprint Review, DoD, validación por épica) | Cap. 3 + Cap. 4 §4.6 | ✅ |
| Cuándo un proyecto ágil necesita SRS formal | Cap. 4 + sistema | ✅ |
| KPIs del proceso de validación (6 métricas con fórmula, meta y alerta) | Sistema austranet-cco | ✅ |
| Tabla de conexiones entre los 3 módulos | M1 + M2 + M3 | ✅ |
| Sin repetición de contenido de M3-01 a M3-04 | — | ✅ |

---

*Fin de M3-05-validacion-requerimientos.md*
*Siguiente archivo: M3-06 (si aplica) o cierre del Módulo 3*
