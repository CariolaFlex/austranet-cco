'use client';

// ============================================================
// COMPONENTE: EntidadForm — Wizard 3 pasos (Módulo 1 Sprint 1C)
// Paso 1: Datos básicos | Paso 2: Stakeholders | Paso 3: Evaluación
// ============================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, CheckCircle, ChevronRight, ChevronLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib';
import { Badge } from '@/components/ui/badge';
import { Input, Textarea, FormField, Select } from '@/components/ui/input';
import { entidadCreateSchema, type EntidadCreateFormData } from '@/lib/validations/entidad.schema';
import { calcularNivelRiesgo, calcularNivelCompletitud } from '@/services/entidades.service';
import { useCreateEntidad, useUpdateEntidad } from '@/hooks/useEntidades';
import { ROUTES } from '@/constants';
import type { Entidad, RespuestasFactibilidad } from '@/types';

// -------------------------------------------------------
// DATOS DE CONFIGURACIÓN (listas de opciones)
// -------------------------------------------------------

const TIPO_OPTIONS = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'proveedor', label: 'Proveedor' },
  { value: 'ambos', label: 'Cliente + Proveedor' },
];

const SECTOR_OPTIONS = [
  { value: 'construccion', label: 'Construcción' },
  { value: 'salud', label: 'Salud' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'educacion', label: 'Educación' },
  { value: 'finanzas', label: 'Finanzas' },
  { value: 'manufactura', label: 'Manufactura' },
  { value: 'retail', label: 'Retail' },
  { value: 'consultoria', label: 'Consultoría' },
  { value: 'otro', label: 'Otro' },
];

const ROL_OPTIONS = [
  { value: 'usuario_final', label: 'Usuario Final' },
  { value: 'gerente_sistema', label: 'Gerente de Sistema' },
  { value: 'propietario', label: 'Propietario / Sponsor' },
  { value: 'responsable_tecnico', label: 'Responsable Técnico' },
  { value: 'experto_dominio', label: 'Experto de Dominio' },
  { value: 'regulador_externo', label: 'Regulador Externo' },
  { value: 'administrador_negocio', label: 'Administrador de Negocio' },
  { value: 'ti_mantenimiento', label: 'TI / Mantenimiento' },
];

const NIVEL_OPTIONS = [
  { value: 'alto', label: 'Alto' },
  { value: 'medio', label: 'Medio' },
  { value: 'bajo', label: 'Bajo' },
];

// M1-04 §5.1 — Preguntas de factibilidad con pesos ponderados
const PREGUNTAS_FACTIBILIDAD = [
  {
    categoria: 'Técnica (40%)',
    preguntas: [
      { key: 't1_sistemasDocumentados', label: '¿Los sistemas actuales están documentados?', opciones: [{ value: 'si', label: 'Sí' }, { value: 'parcial', label: 'Parcial' }, { value: 'no', label: 'No' }] },
      { key: 't2_experienciaSoftware', label: '¿La organización tiene experiencia con software a medida?', opciones: [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }] },
      { key: 't3_infraestructura', label: '¿Cuenta con infraestructura tecnológica adecuada?', opciones: [{ value: 'si', label: 'Sí' }, { value: 'parcial', label: 'Parcial' }, { value: 'no', label: 'No' }] },
      { key: 't4_procesosDocumentados', label: '¿Los procesos de negocio están documentados?', opciones: [{ value: 'si', label: 'Sí' }, { value: 'parcial', label: 'Parcial' }, { value: 'no', label: 'No' }] },
    ],
  },
  {
    categoria: 'Económica (35%)',
    preguntas: [
      { key: 'e5_presupuesto', label: '¿Cuenta con presupuesto asignado para el proyecto?', opciones: [{ value: 'si', label: 'Sí' }, { value: 'en_proceso', label: 'En proceso' }, { value: 'no', label: 'No' }] },
      { key: 'e6_decisoresAccesibles', label: '¿Los decisores financieros son accesibles?', opciones: [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }] },
      { key: 'e7_presupuestoOperacion', label: '¿Existe presupuesto para operación continua?', opciones: [{ value: 'si', label: 'Sí' }, { value: 'parcial', label: 'Parcial' }, { value: 'no', label: 'No' }] },
    ],
  },
  {
    categoria: 'Organizacional (25%)',
    preguntas: [
      { key: 'o8_stakeholdersDisponibles', label: '¿Los stakeholders clave están disponibles?', opciones: [{ value: 'si', label: 'Sí' }, { value: 'parcial', label: 'Parcial' }, { value: 'no', label: 'No' }] },
      { key: 'o9_patrocinadorEjecutivo', label: '¿Existe patrocinador ejecutivo del proyecto?', opciones: [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }] },
      { key: 'o10_experienciaCambio', label: '¿La organización tiene experiencia en gestión del cambio?', opciones: [{ value: 'si', label: 'Sí' }, { value: 'parcial', label: 'Parcial' }, { value: 'no', label: 'No' }] },
      { key: 'o11_alineacionEstrategica', label: '¿El proyecto está alineado estratégicamente?', opciones: [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }, { value: 'desconocido', label: 'Desconocido' }] },
    ],
  },
];

const NIVEL_RIESGO_COLOR: Record<string, string> = {
  bajo: 'bg-green-100 text-green-800 border-green-200',
  medio: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  alto: 'bg-orange-100 text-orange-800 border-orange-200',
  critico: 'bg-red-100 text-red-800 border-red-200',
};

const COMPLETITUD_COLOR: Record<string, string> = {
  minimo: 'bg-gray-100 text-gray-700 border-gray-200',
  estandar: 'bg-blue-100 text-blue-800 border-blue-200',
  completo: 'bg-green-100 text-green-800 border-green-200',
};

// -------------------------------------------------------
// INDICADOR DE PASOS
// -------------------------------------------------------

function StepIndicator({ paso, totalPasos }: { paso: number; totalPasos: number }) {
  const pasoLabels = ['Datos básicos', 'Stakeholders', 'Evaluación'];
  return (
    <div className="flex items-center mb-6">
      {Array.from({ length: totalPasos }).map((_, idx) => {
        const num = idx + 1;
        const completado = num < paso;
        const activo = num === paso;
        return (
          <div key={num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                  completado
                    ? 'bg-primary border-primary text-white'
                    : activo
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-muted-foreground/30 text-muted-foreground'
                }`}
              >
                {completado ? <CheckCircle className="h-4 w-4" /> : num}
              </div>
              <span
                className={`mt-1 text-xs hidden sm:block ${
                  activo ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                {pasoLabels[idx]}
              </span>
            </div>
            {idx < totalPasos - 1 && (
              <div
                className={`h-0.5 w-16 sm:w-24 mx-2 mb-4 transition-colors ${
                  completado ? 'bg-primary' : 'bg-muted-foreground/20'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// -------------------------------------------------------
// PROPS
// -------------------------------------------------------

interface EntidadFormProps {
  mode: 'create' | 'edit';
  entidad?: Entidad;
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------------------------------

export function EntidadForm({ mode, entidad }: EntidadFormProps) {
  const router = useRouter();
  const [paso, setPaso] = useState(1);
  const TOTAL_PASOS = 3;

  const { mutateAsync: crearEntidad, isPending: isCreating } = useCreateEntidad();
  const { mutateAsync: actualizarEntidad, isPending: isUpdating } = useUpdateEntidad();
  const isLoading = isCreating || isUpdating;
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultValues: Partial<EntidadCreateFormData> = {
    tipo: entidad?.tipo ?? 'cliente',
    razonSocial: entidad?.razonSocial ?? '',
    nombreComercial: entidad?.nombreComercial ?? '',
    rut: entidad?.rut ?? '',
    sector: entidad?.sector ?? undefined,
    pais: entidad?.pais ?? 'Chile',
    ciudad: entidad?.ciudad ?? '',
    direccion: entidad?.direccion ?? '',
    sitioWeb: entidad?.sitioWeb ?? '',
    stakeholders: entidad?.stakeholders?.length
      ? (entidad.stakeholders as EntidadCreateFormData['stakeholders'])
      : [{ id: uuidv4(), nombre: '', cargo: '', email: '', telefono: '', rol: 'usuario_final' as const, nivelInfluencia: 'medio' as const, nivelInteres: 'medio' as const, canalComunicacion: '' }],
    tieneNDA: entidad?.tieneNDA ?? false,
    fechaNDA: entidad?.fechaNDA ?? undefined,
    notas: entidad?.notas ?? '',
    nivelRiesgo: entidad?.nivelRiesgo ?? 'bajo',
    estado: entidad?.estado ?? 'activo',
    respuestasFactibilidad: entidad?.respuestasFactibilidad ?? undefined,
  };

  const {
    register,
    handleSubmit,
    watch,
    control,
    trigger,
    formState: { errors },
    setValue,
  } = useForm<EntidadCreateFormData>({
    resolver: zodResolver(entidadCreateSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'stakeholders' });

  // Watch values for live preview
  const watchedTieneNDA = watch('tieneNDA');
  const watchedRespuestas = watch('respuestasFactibilidad');
  const watchedStakeholders = watch('stakeholders');
  const watchedFields = watch(['tipo', 'razonSocial', 'rut', 'sector', 'pais']);

  // Calcular nivel de riesgo en tiempo real (Paso 3)
  const nivelRiesgoCalc =
    watchedRespuestas &&
    Object.values(watchedRespuestas).every(Boolean)
      ? calcularNivelRiesgo(watchedRespuestas as RespuestasFactibilidad)
      : null;

  // Calcular completitud estimada (solo indicativo)
  const completitudEstimada = (() => {
    const [tipo, razonSocial, rut, sector, pais] = watchedFields;
    const tengoMinimo =
      !!tipo && !!razonSocial?.trim() && !!rut?.trim() && !!sector && !!pais?.trim() &&
      (watchedStakeholders?.length ?? 0) >= 1;
    if (!tengoMinimo) return 'minimo';
    const stakeholdersConInfluencia = (watchedStakeholders ?? []).filter(
      (s) => s.nivelInfluencia === 'alto' || s.nivelInfluencia === 'medio'
    );
    const tieneFactibilidad = !!watchedRespuestas && Object.values(watchedRespuestas).some(Boolean);
    if (stakeholdersConInfluencia.length >= 2 && tieneFactibilidad) return 'estandar';
    return 'minimo';
  })();

  // -------------------------------------------------------
  // NAVEGACIÓN ENTRE PASOS
  // -------------------------------------------------------

  const camposStep1: (keyof EntidadCreateFormData)[] = [
    'tipo', 'razonSocial', 'rut', 'sector', 'pais',
  ];
  const camposStep2: (keyof EntidadCreateFormData)[] = ['stakeholders'];

  const irSiguiente = async () => {
    const camposAValidar = paso === 1 ? camposStep1 : paso === 2 ? camposStep2 : [];
    const valido = camposAValidar.length > 0 ? await trigger(camposAValidar) : true;
    if (valido) setPaso((p) => Math.min(p + 1, TOTAL_PASOS));
  };

  const irAnterior = () => setPaso((p) => Math.max(p - 1, 1));

  // -------------------------------------------------------
  // SUBMIT
  // -------------------------------------------------------

  const onSubmit = async (data: EntidadCreateFormData) => {
    try {
      setSubmitError(null);

      // Calcular nivelRiesgo final si se completó evaluación
      if (data.respuestasFactibilidad) {
        data.nivelRiesgo = calcularNivelRiesgo(data.respuestasFactibilidad as RespuestasFactibilidad);
      }

      // Ensure stakeholders have IDs (service also handles this, but be explicit)
      const stakeholdersConId = (data.stakeholders ?? []).map((s) => ({
        ...s,
        id: s.id ?? uuidv4(),
      }));
      const payload = { ...data, stakeholders: stakeholdersConId };

      if (mode === 'create') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nueva = await crearEntidad(payload as any);
        router.push(ROUTES.ENTIDAD_DETALLE(nueva.id));
      } else if (entidad) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await actualizarEntidad({ id: entidad.id, data: payload as any });
        router.push(ROUTES.ENTIDAD_DETALLE(entidad.id));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al guardar la entidad. Intente nuevamente.';
      setSubmitError(msg);
      // Scroll al error para que el usuario lo vea
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <StepIndicator paso={paso} totalPasos={TOTAL_PASOS} />

      {/* Error de envío */}
      {submitError && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
          <strong>Error:</strong> {submitError}
        </div>
      )}

      {/* ============================= PASO 1 ============================= */}
      {paso === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Datos básicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tipo */}
            <FormField label="Tipo de entidad" required error={errors.tipo?.message}>
              <div className="flex gap-2 flex-wrap">
                {TIPO_OPTIONS.map((opt) => (
                  <Controller
                    key={opt.value}
                    control={control}
                    name="tipo"
                    render={({ field }) => (
                      <button
                        type="button"
                        onClick={() => field.onChange(opt.value)}
                        className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                          field.value === opt.value
                            ? 'bg-primary text-white border-primary'
                            : 'border-input bg-background hover:bg-accent'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )}
                  />
                ))}
              </div>
            </FormField>

            {/* Razón Social + Nombre Comercial */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Razón social" required error={errors.razonSocial?.message}>
                <Input
                  {...register('razonSocial')}
                  placeholder="Ej: Empresa S.A."
                  error={!!errors.razonSocial}
                />
              </FormField>
              <FormField label="Nombre comercial" error={errors.nombreComercial?.message}>
                <Input
                  {...register('nombreComercial')}
                  placeholder="Ej: MiEmpresa (opcional)"
                />
              </FormField>
            </div>

            {/* RUT + Sector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="RUT" required error={errors.rut?.message}>
                <Input
                  {...register('rut')}
                  placeholder="Ej: 76.123.456-7"
                  error={!!errors.rut}
                />
              </FormField>
              <FormField label="Sector" required error={errors.sector?.message}>
                <Select
                  {...register('sector')}
                  options={SECTOR_OPTIONS}
                  placeholder="Seleccione sector..."
                  error={!!errors.sector}
                />
              </FormField>
            </div>

            {/* País + Ciudad */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="País" required error={errors.pais?.message}>
                <Input
                  {...register('pais')}
                  placeholder="Chile"
                  error={!!errors.pais}
                />
              </FormField>
              <FormField label="Ciudad" error={errors.ciudad?.message}>
                <Input {...register('ciudad')} placeholder="Ej: Santiago (opcional)" />
              </FormField>
            </div>

            {/* Dirección + Sitio Web */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Dirección" error={errors.direccion?.message}>
                <Input {...register('direccion')} placeholder="Ej: Av. Principal 123 (opcional)" />
              </FormField>
              <FormField label="Sitio web" error={errors.sitioWeb?.message}>
                <Input
                  {...register('sitioWeb')}
                  placeholder="https://ejemplo.com (opcional)"
                  error={!!errors.sitioWeb}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============================= PASO 2 ============================= */}
      {paso === 2 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Stakeholders</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      id: uuidv4(),
                      nombre: '',
                      cargo: '',
                      email: '',
                      telefono: '',
                      rol: 'usuario_final',
                      nivelInfluencia: 'medio',
                      nivelInteres: 'medio',
                      canalComunicacion: '',
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Agregar stakeholder
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {errors.stakeholders?.root && (
                <p className="text-xs text-red-500">{errors.stakeholders.root.message}</p>
              )}
              {errors.stakeholders?.message && (
                <p className="text-xs text-red-500">{errors.stakeholders.message}</p>
              )}

              {fields.map((field, idx) => (
                <div key={field.id} className="rounded-lg border p-4 space-y-3 relative">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Stakeholder {idx + 1}
                      </span>
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive h-7 w-7 p-0"
                        onClick={() => remove(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField
                      label="Nombre"
                      required
                      error={errors.stakeholders?.[idx]?.nombre?.message}
                    >
                      <Input
                        {...register(`stakeholders.${idx}.nombre`)}
                        placeholder="Nombre completo"
                        error={!!errors.stakeholders?.[idx]?.nombre}
                      />
                    </FormField>
                    <FormField
                      label="Cargo"
                      required
                      error={errors.stakeholders?.[idx]?.cargo?.message}
                    >
                      <Input
                        {...register(`stakeholders.${idx}.cargo`)}
                        placeholder="Ej: Gerente TI"
                        error={!!errors.stakeholders?.[idx]?.cargo}
                      />
                    </FormField>
                    <FormField
                      label="Email"
                      required
                      error={errors.stakeholders?.[idx]?.email?.message}
                    >
                      <Input
                        {...register(`stakeholders.${idx}.email`)}
                        type="email"
                        placeholder="email@empresa.com"
                        error={!!errors.stakeholders?.[idx]?.email}
                      />
                    </FormField>
                    <FormField
                      label="Teléfono"
                      error={errors.stakeholders?.[idx]?.telefono?.message}
                    >
                      <Input
                        {...register(`stakeholders.${idx}.telefono`)}
                        placeholder="+56 9 1234 5678 (opcional)"
                      />
                    </FormField>
                    <FormField
                      label="Rol"
                      required
                      error={errors.stakeholders?.[idx]?.rol?.message}
                    >
                      <Select
                        {...register(`stakeholders.${idx}.rol`)}
                        options={ROL_OPTIONS}
                        placeholder="Seleccione rol..."
                        error={!!errors.stakeholders?.[idx]?.rol}
                      />
                    </FormField>
                    <FormField
                      label="Canal de comunicación"
                      error={errors.stakeholders?.[idx]?.canalComunicacion?.message}
                    >
                      <Input
                        {...register(`stakeholders.${idx}.canalComunicacion`)}
                        placeholder="Ej: Email, Teams, Reunión (opcional)"
                      />
                    </FormField>
                    <FormField
                      label="Nivel de influencia"
                      required
                      error={errors.stakeholders?.[idx]?.nivelInfluencia?.message}
                    >
                      <Select
                        {...register(`stakeholders.${idx}.nivelInfluencia`)}
                        options={NIVEL_OPTIONS}
                        error={!!errors.stakeholders?.[idx]?.nivelInfluencia}
                      />
                    </FormField>
                    <FormField
                      label="Nivel de interés"
                      required
                      error={errors.stakeholders?.[idx]?.nivelInteres?.message}
                    >
                      <Select
                        {...register(`stakeholders.${idx}.nivelInteres`)}
                        options={NIVEL_OPTIONS}
                        error={!!errors.stakeholders?.[idx]?.nivelInteres}
                      />
                    </FormField>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Matriz influencia/interés (M1-01 §6) */}
          {(watchedStakeholders?.length ?? 0) > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Matriz Influencia / Interés (M1-01 §6)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: '🔴 Gestionar de cerca', influencia: 'alto', interes: 'alto', cls: 'bg-red-50 border-red-200 dark:bg-red-950/20' },
                    { label: '🟡 Mantener satisfecho', influencia: 'alto', interes: 'bajo', cls: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20' },
                    { label: '🔵 Mantener informado', influencia: 'bajo', interes: 'alto', cls: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20' },
                    { label: '⚫ Monitorear', influencia: 'bajo', interes: 'bajo', cls: 'bg-gray-50 border-gray-200 dark:bg-gray-900/20' },
                  ].map(({ label, influencia, interes, cls }) => {
                    const en = (watchedStakeholders ?? []).filter(
                      (s) => s.nivelInfluencia === influencia && s.nivelInteres === interes
                    );
                    return (
                      <div key={label} className={`rounded border p-2 ${cls}`}>
                        <div className="font-medium mb-1">{label}</div>
                        {en.length === 0 ? (
                          <div className="text-muted-foreground italic">—</div>
                        ) : (
                          en.map((s, i) => (
                            <div key={i} className="truncate">
                              {s.nombre || `Stakeholder ${i + 1}`}
                            </div>
                          ))
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Influencia: filas (alto = arriba) · Interés: columnas (alto = derecha)
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ============================= PASO 3 ============================= */}
      {paso === 3 && (
        <div className="space-y-4">
          {/* Evaluación de factibilidad */}
          {PREGUNTAS_FACTIBILIDAD.map(({ categoria, preguntas }) => (
            <Card key={categoria}>
              <CardHeader>
                <CardTitle className="text-base">{categoria}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {preguntas.map(({ key, label, opciones }) => (
                  <FormField key={key} label={label}>
                    <Select
                      {...register(`respuestasFactibilidad.${key as keyof RespuestasFactibilidad}`)}
                      options={opciones}
                      placeholder="Seleccionar..."
                    />
                  </FormField>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* NDA + Notas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">NDA y notas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Acuerdo de confidencialidad (NDA)">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('tieneNDA')}
                    className="h-4 w-4 rounded border-gray-300 text-primary"
                  />
                  <span className="text-sm">La entidad tiene NDA firmado</span>
                </label>
              </FormField>

              {watchedTieneNDA && (
                <FormField label="Fecha de firma del NDA" required error={errors.fechaNDA?.message}>
                  <input
                    type="date"
                    {...register('fechaNDA', { valueAsDate: true })}
                    className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </FormField>
              )}

              <FormField label="Notas adicionales" error={errors.notas?.message}>
                <Textarea
                  {...register('notas')}
                  placeholder="Observaciones, contexto adicional, acuerdos verbales... (opcional)"
                  rows={3}
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Indicadores en tiempo real */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-3 items-center">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nivel de riesgo calculado</p>
                  {nivelRiesgoCalc ? (
                    <Badge variant="outline" className={NIVEL_RIESGO_COLOR[nivelRiesgoCalc]}>
                      {nivelRiesgoCalc.charAt(0).toUpperCase() + nivelRiesgoCalc.slice(1)}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Completar evaluación
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Completitud estimada</p>
                  <Badge variant="outline" className={COMPLETITUD_COLOR[completitudEstimada]}>
                    {completitudEstimada.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================= NAVEGACIÓN ============================= */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={paso === 1 ? () => router.back() : irAnterior}
        >
          <ChevronLeft className="h-4 w-4 mr-1.5" />
          {paso === 1 ? 'Cancelar' : 'Anterior'}
        </Button>

        {paso < TOTAL_PASOS ? (
          <Button type="button" onClick={irSiguiente}>
            Siguiente
            <ChevronRight className="h-4 w-4 ml-1.5" />
          </Button>
        ) : (
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? mode === 'create'
                ? 'Creando...'
                : 'Guardando...'
              : mode === 'create'
              ? 'Crear entidad'
              : 'Guardar cambios'}
          </Button>
        )}
      </div>
    </form>
  );
}
