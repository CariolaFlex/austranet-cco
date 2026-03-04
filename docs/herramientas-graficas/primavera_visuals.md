Herramientas Gráficas y Visuales Fundamentales





\# Base de Conocimiento: Herramientas Visuales de Primavera P6 y Metodología de Control



Este documento define los estándares de visualización y control de proyectos basados en Primavera P6 que deben ser adaptados e integrados en el software "Austranet-CCO".



\## 1. Control de Tiempos y Cronograma

\- \*\*Gantt Chart (Estándar):\*\* Visualización de barras con dependencias (FS, SS, FF, SF), ruta crítica y holguras.

\- \*\*Tracking Gantt:\*\* Comparativa visual entre la Línea Base (Planificado) vs. Ejecución Real (Actual).

\- \*\*Network Diagram (PERT):\*\* Visualización de nodos para entender la lógica del flujo de trabajo sin escala de tiempo.



\## 2. Control de Costos y Recursos

\- \*\*Histograma de Recursos:\*\* Gráfico de barras para detectar sobreasignación de equipo o presupuesto por periodo.

\- \*\*Curvas "S" (S-Curves):\*\* Gráfico lineal acumulativo para proyectar flujo de caja y esfuerzo. Compara Planificado vs. Real acumulado.



\## 3. Rendimiento y Valor Ganado (EVM)

\- \*\*Análisis de Valor Ganado:\*\* Visualización simultánea de:

&nbsp; - PV (Planned Value): Lo que se debería haber hecho.

&nbsp; - EV (Earned Value): Lo que realmente se ha logrado (valor monetizado).

&nbsp; - AC (Actual Cost): Lo que se ha gastado.

\- \*\*Indicadores de Salud (Semáforos):\*\* Alertas visuales basadas en SPI (Schedule Performance Index) y CPI (Cost Performance Index).



\## 4. Gestión de Riesgos y Portafolio

\- \*\*Matriz de Riesgos:\*\* Heatmap de Probabilidad vs. Impacto.

\- \*\*Bubble Charts:\*\* Visualización de portafolio (Eje X: Riesgo, Eje Y: ROI, Tamaño: Presupuesto).



Elementos visuales, cómo funcionan y a qué tipo de control o predicción pertenecen.
Para mayor claridad, dividiremos estas herramientas en las áreas principales de control: Tiempos, Costos/Recursos, Rendimiento (Valor Ganado) y Riesgos/Portafolio.



1. Gráficas para el Control de Tiempos e Hitos

   Gráfico de Gantt Estándar (Gantt Chart)
   Cómo funciona: Representa las actividades como barras horizontales a lo largo de un calendario. Muestra visualmente las relaciones lógicas (flechas), las holguras (barras delgadas) y la ruta crítica (usualmente en rojo).
   Tipo de Control: Control de Tiempos e Hitos / Predictivo. Permite predecir fechas de finalización (CPM) y visualizar qué hitos están en riesgo si se retrasa la ruta crítica.
   Gráfico de Gantt de Seguimiento (Tracking Gantt / Baseline Comparison)
   Cómo funciona: Muestra dos o más barras por cada actividad: una representa la programación actual/real y otra (debajo) representa la Línea Base (el plan original).
   Tipo de Control: Control de Tiempos. Es netamente comparativo para ver desviaciones, retrasos o adelantos respecto al plan original.
   Diagrama de Red de Actividades (Activity Network / PERT Chart)
   Cómo funciona: Muestra las actividades como cajas (nodos) conectadas por líneas que representan sus dependencias lógicas, sin estar atadas a una escala de tiempo estricta.
   Tipo de Control: Predictivo / Control Lógico. Ayuda a visualizar el flujo de trabajo, identificar cuellos de botella y entender la lógica de la ruta crítica de manera estructural.
   Diagrama Lógico a Escala de Tiempo (Time-Scaled Logic Diagram)
   Cómo funciona: Es un híbrido. Muestra la lógica de red (nodos y flechas) pero distribuida sobre un calendario, agrupando las tareas por niveles o responsables.
   Tipo de Control: Predictivo / Control de Tiempos. Excelente para sesiones de planificación y para mostrar a los equipos cuándo exactamente deben interactuar.

   
2. Gráficas para el Control de Recursos y Costos

   Histograma de Recursos (Resource Usage Profile - Barras)
   Cómo funciona: Gráfico de barras verticales que muestra la cantidad de horas hombre, horas máquina o dinero que se gastará por periodo (día, semana, mes). Las barras cambian de color (ej. rojo) cuando un recurso está sobreasignado (se excede su límite disponible).
   Tipo de Control: Control de Costos y Capacidad / Predictivo. Permite anticipar cuándo faltará personal o dinero y nivelar los recursos antes de que ocurra el problema.
   Curvas "S" de Distribución (S-Curves - Acumulados)
   Cómo funciona: Es una línea curva superpuesta en el histograma que muestra el gasto o esfuerzo acumulado a lo largo del tiempo. Su forma natural es una "S" (inicio lento, aceleración al medio, desaceleración al final).
   Tipo de Control: Predictivo / Control de Costos. Sirve para proyectar el flujo de caja (Cash Flow) y comparar visualmente el presupuesto acumulado contra el gasto real acumulado.

   
3. Gráficas de Rendimiento (Valor Ganado / Earned Value)

   Gráficos de Perfil de Valor Ganado (Earned Value Performance)
   Cómo funciona: Grafica simultáneamente tres curvas "S" clave:
   PV (Valor Planificado): Lo que deberías haber avanzado.
   EV (Valor Ganado): Lo que realmente avanzaste (traducido a costo/horas).
   AC (Costo Real): Lo que realmente gastaste.
   Tipo de Control: Control Integral (Tiempos y Costos) / Altamente Predictivo. Al ver la separación entre estas tres líneas, P6 calcula visualmente el EAC (Estimación a la Conclusión) y pronostica si el proyecto terminará tarde, temprano, por encima o por debajo del presupuesto.

   
4. Gráficas de Control de Riesgos y Portafolios (Principalmente en P6 EPPM - versión Web)

   Nota: La versión de escritorio (Professional) tiene funciones limitadas de riesgo visual. Las siguientes herramientas brillan en la versión web (EPPM) o mediante su integración con Primavera Risk Analysis.
   Matriz de Riesgos (Risk Matrix)
   Cómo funciona: Una cuadrícula de colores (verde, amarillo, rojo) que cruza la Probabilidad de que ocurra un evento contra su Impacto (en tiempo o costo). Posiciona gráficamente los riesgos registrados en el proyecto.
   Tipo de Control: Control de Riesgos / Predictivo. Ayuda a priorizar planes de mitigación (enfocándose en la zona roja).
   Gráficos de Burbujas de Portafolio (Bubble Charts)
   Cómo funciona: En los "Dashboards" (paneles de control), muestra los proyectos como burbujas. El eje X puede ser el Riesgo, el eje Y el Retorno de Inversión (ROI), y el tamaño de la burbuja el Presupuesto.
   Tipo de Control: Control de Portafolio / Predictivo a nivel directivo. Permite decidir qué proyectos cancelar o priorizar basándose en su salud general.
   Semáforos / Indicadores de Salud (Health Indicators)
   Cómo funciona: Iconos visuales (rojo, amarillo, verde) configurados en columnas que reaccionan automáticamente si el proyecto se desvía un porcentaje específico (ej. si el SPI < 0.9, el semáforo de tiempo se pone rojo).
   Tipo de Control: Control de Tiempos y Costos (Alertas tempranas).
