'use client';

// ============================================================
// COMPONENTE: EntidadForm — Wizard 3 pasos (Módulo 1 Sprint 1C)
// Paso 1: Datos básicos | Paso 2: Stakeholders | Paso 3: Evaluación
//
// Incluye:
// - Normalización de datos incompletos de Firestore en defaultValues
// - Persistencia del progreso en localStorage (Problema 2)
// - Feedback visible de errores de validación por paso
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, CheckCircle, ChevronRight, ChevronLeft, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib';
import { Badge } from '@/components/ui/badge';
import { Input, Textarea, FormField, Select } from '@/components/ui/input';
import { entidadBaseSchema, type EntidadCreateFormData } from '@/lib/validations/entidad.schema';
import { calcularNivelRiesgo } from '@/services/entidades.service';
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
// PERSISTENCIA LOCALSTORAGE
// -------------------------------------------------------

const STORAGE_PREFIX = 'cco_wizard_entidad_';

function getStorageKey(entidadId?: string): string {
  return `${STORAGE_PREFIX}${entidadId || 'nueva'}`;
}

function saveWizardState(
  key: string,
  data: { paso: number; formData: Partial<EntidadCreateFormData> }
): void {
  try {
    // Serializar fechas como strings ISO para localStorage
    const serializable = JSON.parse(JSON.stringify(data, (_, v) =>
      v instanceof Date ? v.toISOString() : v
    ));
    localStorage.setItem(key, JSON.stringify(serializable));
  } catch {
    // Silencioso: localStorage puede no estar disponible
  }
}

function loadWizardState(
  key: string
): { paso: number; formData: Partial<EntidadCreateFormData> } | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Restaurar fechas
    if (parsed.formData?.fechaNDA && typeof parsed.formData.fechaNDA === 'string') {
      parsed.formData.fechaNDA = new Date(parsed.formData.fechaNDA);
    }
    return parsed;
  } catch {
    return null;
  }
}

function clearWizardState(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Silencioso
  }
}

// -------------------------------------------------------
// HELPER: Crear stakeholder con todos los campos requeridos
// -------------------------------------------------------

function crearStakeholderVacio() {
  return {
    id: uuidv4(),
    nombre: '',
    cargo: '',
    email: '',
    telefono: '',
    rol: 'usuario_final' as const,
    nivelInfluencia: 'medio' as const,
    nivelInteres: 'medio' as const,
    canalComunicacion: '',
  };
}

/**
 * Normaliza un stakeholder de Firestore asegurando que todos los campos
 * requeridos por el schema Zod existan con valores válidos.
 */
function normalizarStakeholder(s: Record<string, unknown>) {
  return {
    id: (s.id as string) || uuidv4(),
    nombre: (s.nombre as string) || '',
    cargo: (s.cargo as string) || '',
    email: (s.email as string) || '',
    telefono: (s.telefono as string) || '',
    rol: (s.rol as EntidadCreateFormData['stakeholders'][0]['rol']) || 'usuario_final',
    nivelInfluencia: (s.nivelInfluencia as EntidadCreateFormData['stakeholders'][0]['nivelInfluencia']) || 'medio',
    nivelInteres: (s.nivelInteres as EntidadCreateFormData['stakeholders'][0]['nivelInteres']) || 'medio',
    canalComunicacion: (s.canalComunicacion as string) || '',
  };
}

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
  const TOTAL_PASOS = 3;
  const storageKey = getStorageKey(entidad?.id);
  const savedState = useRef(mode === 'create' ? null : loadWizardState(storageKey));
  const [restoredFromStorage, setRestoredFromStorage] = useState(false);

  const [paso, setPaso] = useState(() => savedState.current?.paso ?? 1);
  const [stepError, setStepError] = useState<string | null>(null);

  const { mutateAsync: crearEntidad, isPending: isCreating } = useCreateEntidad();
  const { mutateAsync: actualizarEntidad, isPending: isUpdating } = useUpdateEntidad();
  const isLoading = isCreating || isUpdating;
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Construir defaultValues con normalización robusta de stakeholders
  const buildDefaultValues = useCallback((): Partial<EntidadCreateFormData> => {
    // Si hay datos guardados en localStorage, usarlos como base
    const saved = savedState.current?.formData;

    const stakeholdersFromEntity = entidad?.stakeholders?.length
      ? entidad.stakeholders.map((s) => normalizarStakeholder(s as unknown as Record<string, unknown>))
      : [crearStakeholderVacio()];

    const stakeholdersFromSaved = saved?.stakeholders?.length
      ? saved.stakeholders.map((s) => normalizarStakeholder(s as unknown as Record<string, unknown>))
      : null;

    return {
      tipo: saved?.tipo ?? entidad?.tipo ?? 'cliente',
      razonSocial: saved?.razonSocial ?? entidad?.razonSocial ?? '',
      nombreComercial: saved?.nombreComercial ?? entidad?.nombreComercial ?? '',
      rut: saved?.rut ?? entidad?.rut ?? '',
      sector: saved?.sector ?? entidad?.sector ?? undefined,
      pais: saved?.pais ?? entidad?.pais ?? 'Chile',
      ciudad: saved?.ciudad ?? entidad?.ciudad ?? '',
      direccion: saved?.direccion ?? entidad?.direccion ?? '',
      sitioWeb: saved?.sitioWeb ?? entidad?.sitioWeb ?? '',
      stakeholders: stakeholdersFromSaved ?? stakeholdersFromEntity,
      tieneNDA: saved?.tieneNDA ?? entidad?.tieneNDA ?? false,
      fechaNDA: saved?.fechaNDA ?? entidad?.fechaNDA ?? undefined,
      notas: saved?.notas ?? entidad?.notas ?? '',
      nivelRiesgo: saved?.nivelRiesgo ?? entidad?.nivelRiesgo ?? 'bajo',
      estado: saved?.estado ?? entidad?.estado ?? 'activo',
      respuestasFactibilidad: mode === 'create' ? undefined : (saved?.respuestasFactibilidad ?? entidad?.respuestasFactibilidad ?? undefined),
    };
  }, [entidad]);

  const {
    register,
    watch,
    control,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<EntidadCreateFormData>({
    // SIN zodResolver: el resolver bloqueaba handleSubmit silenciosamente cuando
    // los <Select> de factibilidad (Paso 3) se montaban con '' y fallaban z.enum().
    // Toda la validación es ahora explícita: por paso en irSiguiente, y completa en onSubmit.
    defaultValues: buildDefaultValues(),
    mode: 'onChange',
    shouldUnregister: false,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'stakeholders' });

  // Notificar al usuario si se restauró desde localStorage
  useEffect(() => {
    if (savedState.current && !restoredFromStorage) {
      setRestoredFromStorage(true);
    }
  }, [restoredFromStorage]);

  // Watch values for live preview
  const watchedTieneNDA = watch('tieneNDA');
  const watchedRespuestas = watch('respuestasFactibilidad');
  const watchedStakeholders = watch('stakeholders');
  const watchedFields = watch(['tipo', 'razonSocial', 'rut', 'sector', 'pais']);

  // Guardar estado en localStorage al cambiar de paso o al modificar el formulario
  const persistState = useCallback(() => {
    const currentData = getValues();
    saveWizardState(storageKey, { paso, formData: currentData });
  }, [storageKey, paso, getValues]);

  // Persistir al cambiar de paso
  useEffect(() => {
    persistState();
  }, [paso, persistState]);

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

  // Schema parcial de Paso 1 para validación manual (sin zodResolver)
  const step1Schema = entidadBaseSchema.pick({
    tipo: true,
    razonSocial: true,
    rut: true,
    sector: true,
    pais: true,
  });

  const irSiguiente = async () => {
    try {
      setStepError(null);
      clearErrors();

      if (paso === 1) {
        // Validación manual del Paso 1 con Zod (sin zodResolver global)
        const result = step1Schema.safeParse({
          tipo: getValues('tipo'),
          razonSocial: getValues('razonSocial'),
          rut: getValues('rut'),
          sector: getValues('sector'),
          pais: getValues('pais'),
        });
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            const field = issue.path[0] as keyof EntidadCreateFormData;
            if (field) setError(field, { type: 'manual', message: issue.message });
          });
          setStepError('Corrige los campos marcados en rojo antes de continuar.');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      } else if (paso === 2) {
        // Validación mínima: basta con que exista al menos 1 stakeholder en el array.
        // La validación completa de campos ocurre en onSubmit.
        const stks = getValues('stakeholders');
        if (!Array.isArray(stks) || stks.length === 0) {
          setStepError('Agrega al menos un stakeholder antes de continuar.');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      // Validación pasada — persistir y avanzar
      persistState();
      setPaso((p) => Math.min(p + 1, TOTAL_PASOS));
    } catch (err) {
      console.error('[EntidadForm] Error en irSiguiente:', err);
      setStepError('Error inesperado al validar. Intente nuevamente.');
    }
  };

  const irAnterior = () => {
    setStepError(null);
    persistState();
    setPaso((p) => Math.max(p - 1, 1));
  };

  const handleCancel = () => {
    clearWizardState(storageKey);
    router.back();
  };

  const handleDiscardDraft = () => {
    clearWizardState(storageKey);
    window.location.reload();
  };

  // -------------------------------------------------------
  // SUBMIT
  // -------------------------------------------------------

  const handleFinalSubmit = async () => {
    // Prevenir doble-submit durante una mutación activa
    if (isLoading) return;
    // Blindaje extra: sólo puede ejecutarse desde el Paso 3 (final)
    if (paso !== TOTAL_PASOS) return;

    try {
      setSubmitError(null);

      // Leer valores directamente desde el estado del formulario (fuente de verdad)
      const rawData = getValues();

      // ── Stakeholders ──────────────────────────────────────────
      // Usar getValues como fuente autoritativa (bypasa cualquier transformación del resolver)
      const stakeholders = (rawData.stakeholders ?? []).filter(
        (s) => s.nombre?.trim()
      );
      if (!stakeholders.length) {
        setSubmitError('Debes agregar al menos un stakeholder con nombre. Vuelve al Paso 2.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // ── Limpieza de respuestasFactibilidad ────────────────────
      // Los <Select> del Paso 3 se montan con '' (placeholder).
      // Eliminamos entradas vacías para no enviar strings inválidos a Firestore.
      const rawRespuestas = rawData.respuestasFactibilidad;
      const cleanRespuestas = (() => {
        if (!rawRespuestas || typeof rawRespuestas !== 'object') return undefined;
        const cleaned: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(rawRespuestas as Record<string, unknown>)) {
          if (v !== '' && v !== null && v !== undefined) cleaned[k] = v;
        }
        return Object.keys(cleaned).length > 0
          ? (cleaned as unknown as RespuestasFactibilidad)
          : undefined;
      })();

      // ── Validación cross-field NDA ─────────────────────────────
      if (rawData.tieneNDA === true && !rawData.fechaNDA) {
        setSubmitError('Si tiene NDA, debe indicar la fecha de firma.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // ── Calcular nivel de riesgo ──────────────────────────────
      const nivelRiesgo = cleanRespuestas
        ? calcularNivelRiesgo(cleanRespuestas)
        : (rawData.nivelRiesgo ?? 'bajo');

      const stakeholdersConId = stakeholders.map((s) => ({
        ...s,
        id: s.id ?? uuidv4(),
      }));

      const payload = {
        ...rawData,
        stakeholders: stakeholdersConId,
        respuestasFactibilidad: cleanRespuestas,
        nivelRiesgo,
      };

      console.log('[EntidadForm] Submit → stakeholders:', stakeholdersConId.length, '| factibilidad:', !!cleanRespuestas);

      if (mode === 'create') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nueva = await crearEntidad(payload as any);
        clearWizardState(storageKey);
        router.push(ROUTES.ENTIDAD_DETALLE(nueva.id));
      } else if (entidad) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await actualizarEntidad({ id: entidad.id, data: payload as any });
        clearWizardState(storageKey);
        router.push(ROUTES.ENTIDAD_DETALLE(entidad.id));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al guardar la entidad. Intente nuevamente.';
      setSubmitError(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------

  return (
<form
  noValidate
  onKeyDown={(e) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault();
      e.stopPropagation();
    }
  }}
  onSubmit={(e) => {
    e.preventDefault();
    e.stopPropagation();
    if (paso !== TOTAL_PASOS) return;
    void handleFinalSubmit();
  }}
  className="space-y-6"
>

      <StepIndicator paso={paso} totalPasos={TOTAL_PASOS} />

      {/* Banner de borrador restaurado */}
      {restoredFromStorage && (
        <div className="rounded-md bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 px-4 py-3 text-sm text-blue-800 dark:text-blue-300 flex items-center justify-between">
          <span>Se restauró un borrador guardado previamente.</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-blue-700 dark:text-blue-400 hover:text-blue-900"
            onClick={handleDiscardDraft}
          >
            Descartar borrador
          </Button>
        </div>
      )}

      {/* Error de validación por paso */}
      {stepError && (
        <div className="rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{stepError}</span>
        </div>
      )}

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
                  onClick={() => append(crearStakeholderVacio())}
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
          onClick={paso === 1 ? handleCancel : irAnterior}
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
