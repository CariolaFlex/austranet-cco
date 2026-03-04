'use client';

// ============================================================
// COMPONENTE: EntidadForm — Wizard 3 pasos (Módulo 1 Sprint 1C)
// Paso 1: Datos básicos | Paso 2: Stakeholders | Paso 3: Evaluación
//
// Arquitectura refactorizada (eliminación definitiva del submit prematuro):
// - Cada paso es un componente independiente con su propio <form> + useForm.
// - EntidadForm solo gestiona: paso activo, wizardData acumulado,
//   localStorage y el submit final a Firebase.
// - NINGÚN submit puede dispararse fuera del paso 3.
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreateEntidad, useUpdateEntidad } from '@/hooks/useEntidades';
import { calcularNivelRiesgo } from '@/services/entidades.service';
import { ROUTES } from '@/constants';
import { WizardPaso1 } from './wizard/WizardPaso1';
import { WizardPaso2 } from './wizard/WizardPaso2';
import { WizardPaso3 } from './wizard/WizardPaso3';
import type { Paso1Data } from './wizard/WizardPaso1';
import type { Paso2Data } from './wizard/WizardPaso2';
import type { Paso3Data } from './wizard/WizardPaso3';
import type { Entidad, RespuestasFactibilidad } from '@/types';

// -------------------------------------------------------
// TIPOS INTERNOS
// -------------------------------------------------------

interface WizardAccumulatedData {
  paso1?: Paso1Data;
  paso2?: Paso2Data;
  paso3?: Partial<Paso3Data>; // draft (puede estar incompleto si el usuario volvió atrás)
}

interface WizardSavedState {
  paso: number;
  wizardData: WizardAccumulatedData;
}

// -------------------------------------------------------
// PERSISTENCIA LOCALSTORAGE
// -------------------------------------------------------

const STORAGE_PREFIX = 'cco_wizard_entidad_v2_';

function getStorageKey(entidadId?: string): string {
  return `${STORAGE_PREFIX}${entidadId || 'nueva'}`;
}

function saveWizardState(key: string, state: WizardSavedState): void {
  try {
    const serializable = JSON.parse(
      JSON.stringify(state, (_, v) => (v instanceof Date ? v.toISOString() : v))
    );
    localStorage.setItem(key, JSON.stringify(serializable));
  } catch {
    // Silencioso
  }
}

function loadWizardState(key: string): WizardSavedState | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WizardSavedState;
    // Restaurar Date en fechaNDA del paso 3
    if (
      parsed.wizardData?.paso3?.fechaNDA &&
      typeof parsed.wizardData.paso3.fechaNDA === 'string'
    ) {
      parsed.wizardData.paso3.fechaNDA = new Date(
        parsed.wizardData.paso3.fechaNDA as unknown as string
      );
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
// HELPERS
// -------------------------------------------------------

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
    rol: (s.rol as Paso2Data['stakeholders'][0]['rol']) || 'usuario_final',
    nivelInfluencia:
      (s.nivelInfluencia as Paso2Data['stakeholders'][0]['nivelInfluencia']) || 'medio',
    nivelInteres:
      (s.nivelInteres as Paso2Data['stakeholders'][0]['nivelInteres']) || 'medio',
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

  // En modo create NO restauramos localStorage (evita pre-cargar datos de otra entidad)
  const savedState = useRef<WizardSavedState | null>(
    mode === 'create' ? null : loadWizardState(storageKey)
  );

  const [paso, setPaso] = useState<number>(() => savedState.current?.paso ?? 1);
  const [restoredFromStorage, setRestoredFromStorage] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // wizardData: acumulación de datos validados por paso
  const [wizardData, setWizardData] = useState<WizardAccumulatedData>(() => {
    // Prioridad: localStorage > entidad de Firestore > vacío
    if (savedState.current?.wizardData) {
      return savedState.current.wizardData;
    }
    // Construir desde la entidad (modo edit)
    const paso1: Paso1Data | undefined = entidad
      ? {
          tipo: entidad.tipo ?? 'cliente',
          razonSocial: entidad.razonSocial ?? '',
          nombreComercial: entidad.nombreComercial ?? '',
          rut: entidad.rut ?? '',
          sector: entidad.sector ?? 'otro',
          pais: entidad.pais ?? 'Chile',
          ciudad: entidad.ciudad ?? '',
          direccion: entidad.direccion ?? '',
          sitioWeb: entidad.sitioWeb ?? '',
        }
      : undefined;

    const paso2: Paso2Data | undefined = entidad?.stakeholders?.length
      ? {
          stakeholders: entidad.stakeholders.map((s) =>
            normalizarStakeholder(s as unknown as Record<string, unknown>)
          ),
        }
      : undefined;

    const paso3: Partial<Paso3Data> | undefined = entidad
      ? {
          respuestasFactibilidad: entidad.respuestasFactibilidad,
          tieneNDA: entidad.tieneNDA ?? false,
          fechaNDA: entidad.fechaNDA,
          notas: entidad.notas ?? '',
        }
      : undefined;

    return { paso1, paso2, paso3 };
  });

  const { mutateAsync: crearEntidad, isPending: isCreating } = useCreateEntidad();
  const { mutateAsync: actualizarEntidad, isPending: isUpdating } = useUpdateEntidad();
  const isLoading = isCreating || isUpdating;

  // Notificar si se restauró desde localStorage
  useEffect(() => {
    if (savedState.current && !restoredFromStorage) {
      setRestoredFromStorage(true);
    }
  }, [restoredFromStorage]);

  // Persistir en localStorage cuando cambian paso o wizardData
  useEffect(() => {
    saveWizardState(storageKey, { paso, wizardData });
  }, [paso, wizardData, storageKey]);

  // -------------------------------------------------------
  // COMPLETITUD ESTIMADA — calculada a partir de pasos 1 y 2
  // (no requiere datos del paso 3 en tiempo real)
  // -------------------------------------------------------
  const completitudEstimada = ((): 'minimo' | 'estandar' | 'completo' => {
    const p1 = wizardData.paso1;
    const p2 = wizardData.paso2;
    if (!p1 || !p2) return 'minimo';
    const { tipo, razonSocial, rut, sector, pais } = p1;
    const tengoMinimo =
      !!tipo &&
      !!razonSocial?.trim() &&
      !!rut?.trim() &&
      !!sector &&
      !!pais?.trim() &&
      (p2.stakeholders?.length ?? 0) >= 1;
    if (!tengoMinimo) return 'minimo';
    const stakeholdersConInfluencia = p2.stakeholders.filter(
      (s) => s.nivelInfluencia === 'alto' || s.nivelInfluencia === 'medio'
    );
    if (stakeholdersConInfluencia.length >= 2) return 'estandar';
    return 'minimo';
  })();

  // -------------------------------------------------------
  // HANDLERS DE NAVEGACIÓN ENTRE PASOS
  // -------------------------------------------------------

  const handlePaso1Next = (data: Paso1Data) => {
    setWizardData((prev) => ({ ...prev, paso1: data }));
    setPaso(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaso2Next = (data: Paso2Data) => {
    setWizardData((prev) => ({ ...prev, paso2: data }));
    setPaso(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaso2Back = (draft?: Partial<Paso2Data>) => {
    if (draft) setWizardData((prev) => ({ ...prev, paso2: draft as Paso2Data }));
    setPaso(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaso3Back = (draft?: Partial<Paso3Data>) => {
    if (draft) setWizardData((prev) => ({ ...prev, paso3: draft }));
    setPaso(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  // SUBMIT FINAL — solo se llama desde WizardPaso3.onSubmit
  // -------------------------------------------------------

  const handleFinalSubmit = async (paso3Data: Paso3Data) => {
    const paso1 = wizardData.paso1;
    const paso2 = wizardData.paso2;

    if (!paso1 || !paso2) {
      setSubmitError('Datos incompletos. Por favor, completa todos los pasos.');
      return;
    }

    // Filtrar stakeholders sin nombre (limpieza defensiva)
    const stakeholdersConId = paso2.stakeholders
      .filter((s) => s.nombre?.trim())
      .map((s) => ({ ...s, id: s.id ?? uuidv4() }));

    if (!stakeholdersConId.length) {
      setSubmitError('Debes agregar al menos un stakeholder con nombre. Vuelve al Paso 2.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // respuestasFactibilidad ya fue limpiada por el zodResolver del Paso 3
    const cleanRespuestas = paso3Data.respuestasFactibilidad as
      | RespuestasFactibilidad
      | undefined;

    const nivelRiesgo = cleanRespuestas
      ? calcularNivelRiesgo(cleanRespuestas)
      : 'bajo';

    const payload = {
      ...paso1,
      stakeholders: stakeholdersConId,
      respuestasFactibilidad: cleanRespuestas,
      tieneNDA: paso3Data.tieneNDA,
      fechaNDA: paso3Data.fechaNDA,
      notas: paso3Data.notas,
      nivelRiesgo,
      estado: (entidad?.estado ?? 'activo') as
        | 'activo'
        | 'inactivo'
        | 'observado'
        | 'suspendido',
    };

    try {
      setSubmitError(null);
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
      const msg =
        err instanceof Error
          ? err.message
          : 'Error al guardar la entidad. Intente nuevamente.';
      setSubmitError(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------

  return (
    <div className="space-y-6">
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

      {/* Error de envío final */}
      {submitError && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>
            <strong>Error:</strong> {submitError}
          </span>
        </div>
      )}

      {/* ===== PASO 1 ===== */}
      {paso === 1 && (
        <WizardPaso1
          defaultValues={wizardData.paso1}
          onNext={handlePaso1Next}
          onCancel={handleCancel}
        />
      )}

      {/* ===== PASO 2 ===== */}
      {paso === 2 && (
        <WizardPaso2
          defaultValues={wizardData.paso2}
          onNext={handlePaso2Next}
          onBack={handlePaso2Back}
        />
      )}

      {/* ===== PASO 3 ===== */}
      {paso === 3 && (
        <WizardPaso3
          defaultValues={wizardData.paso3}
          onSubmit={handleFinalSubmit}
          onBack={handlePaso3Back}
          isLoading={isLoading}
          mode={mode}
          completitud={completitudEstimada}
        />
      )}
    </div>
  );
}
