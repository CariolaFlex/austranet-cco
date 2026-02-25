'use client';

// ============================================================
// COMPONENTE: GlosarioTab — Módulo 1 Sprint 2 (M1-03)
// Gestión del glosario de dominio de una entidad
// ============================================================

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Textarea, FormField } from '@/components/ui/input';
import { Skeleton } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialogs';
import {
  useGlosario,
  useCreateEntradaGlosario,
  useUpdateEntradaGlosario,
  useDeleteEntradaGlosario,
  useUpdateChecklistGlosario,
} from '@/hooks/useGlosario';
import type { EntradaGlosario, Stakeholder, ChecklistGlosario } from '@/types';

// -------------------------------------------------------
// ZOD SCHEMA para el formulario de término
// -------------------------------------------------------

const entradaGlosarioSchema = z.object({
  termino: z.string().min(1, 'El término es requerido').max(200),
  definicion: z.string().min(20, 'La definición debe tener al menos 20 caracteres').max(2000),
  sinonimos: z.string().optional(), // string separado por comas, se convierte al guardar
  terminoTecnico: z.string().max(200).optional(),
  fuente: z.string().min(1, 'La fuente es requerida').max(200),
  contexto: z.string().max(500).optional(),
  fechaValidacion: z.string().optional(), // ISO date string desde input[type=date]
  advertencia: z.string().max(500).optional(),
});

type EntradaGlosarioFormData = z.infer<typeof entradaGlosarioSchema>;

// -------------------------------------------------------
// CONFIGURACIÓN CHECKLIST (M1-03 §8)
// -------------------------------------------------------

const CHECKLIST_CONSTRUCCION: Array<{ key: keyof ChecklistGlosario; label: string }> = [
  { key: 'reviso_documentacion_interna', label: '¿Se revisó la documentación interna del cliente (contratos, formularios, normativas internas)?' },
  { key: 'reviso_normativas_sector', label: '¿Se revisaron las normativas del sector en que opera el cliente?' },
  { key: 'entrevisto_usuario_final', label: '¿Se entrevistó al menos a un usuario final (quien operará el sistema diariamente)?' },
  { key: 'entrevisto_responsable_tecnico', label: '¿Se entrevistó al menos a un responsable técnico o de procesos del cliente?' },
  { key: 'realizo_observacion_directa', label: '¿Se realizó al menos una sesión de observación directa del trabajo real?' },
  { key: 'definidos_acronimos', label: '¿Están definidos todos los acrónimos que usa el cliente?' },
  { key: 'identificados_terminos_distintos', label: '¿Están identificados los términos que el cliente usa de forma distinta al estándar?' },
  { key: 'capturado_vocabulario_informal', label: '¿Están capturados los términos del vocabulario informal del equipo?' },
];

const CHECKLIST_VALIDACION: Array<{ key: keyof ChecklistGlosario; label: string }> = [
  { key: 'definiciones_validadas', label: '¿Cada definición fue validada (fechaValidacion completado) por el stakeholder que la originó?' },
  { key: 'sin_conflictos_pendientes', label: '¿No hay términos con definiciones en conflicto entre stakeholders?' },
  { key: 'equipo_tecnico_reviso', label: '¿El equipo técnico revisó el glosario y confirmó que entiende cada término sin ambigüedad?' },
  { key: 'sin_interpretaciones_inesperadas', label: '¿Ninguna definición genera una interpretación técnica que el cliente no anticipó?' },
];

// -------------------------------------------------------
// BADGE DE COBERTURA (M1-07 §7.1)
// -------------------------------------------------------

function CoberturaGlosarioBadge({ count }: { count: number }) {
  if (count >= 10) {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
        ✓ Completo ({count} términos)
      </Badge>
    );
  }
  if (count >= 5) {
    return (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
        En progreso ({count}/10 términos)
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
      Insuficiente ({count}/10 términos)
    </Badge>
  );
}

// -------------------------------------------------------
// MODAL AGREGAR / EDITAR TÉRMINO
// -------------------------------------------------------

interface TerminoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entidadId: string;
  termino?: EntradaGlosario | null;
  stakeholders: Stakeholder[];
}

function TerminoModal({ open, onOpenChange, entidadId, termino, stakeholders }: TerminoModalProps) {
  const { mutate: crear, isPending: isCreating } = useCreateEntradaGlosario(entidadId);
  const { mutate: actualizar, isPending: isUpdating } = useUpdateEntradaGlosario(entidadId);
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EntradaGlosarioFormData>({
    resolver: zodResolver(entradaGlosarioSchema),
    defaultValues: termino
      ? {
          termino: termino.termino,
          definicion: termino.definicion,
          sinonimos: termino.sinonimos?.join(', ') ?? '',
          terminoTecnico: termino.terminoTecnico ?? '',
          fuente: termino.fuente,
          contexto: termino.contexto ?? '',
          fechaValidacion: termino.fechaValidacion
            ? new Date(termino.fechaValidacion).toISOString().split('T')[0]
            : '',
          advertencia: termino.advertencia ?? '',
        }
      : {
          termino: '',
          definicion: '',
          sinonimos: '',
          terminoTecnico: '',
          fuente: '',
          contexto: '',
          fechaValidacion: '',
          advertencia: '',
        },
  });

  const onSubmit = (data: EntradaGlosarioFormData) => {
    const payload = {
      termino: data.termino,
      definicion: data.definicion,
      sinonimos: data.sinonimos
        ? data.sinonimos.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      terminoTecnico: data.terminoTecnico || undefined,
      fuente: data.fuente,
      contexto: data.contexto || undefined,
      fechaValidacion: data.fechaValidacion
        ? new Date(data.fechaValidacion)
        : undefined,
      advertencia: data.advertencia || undefined,
    };

    if (termino) {
      actualizar(
        { terminoId: termino.id, data: payload },
        { onSuccess: () => { onOpenChange(false); reset(); } }
      );
    } else {
      crear(payload, {
        onSuccess: () => { onOpenChange(false); reset(); },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {termino ? 'Editar término' : 'Agregar término al glosario'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Término" required error={errors.termino?.message}>
              <Input
                {...register('termino')}
                placeholder="Ej: Orden de Compra"
                error={!!errors.termino}
              />
            </FormField>
            <FormField label="Término técnico equivalente" error={errors.terminoTecnico?.message}>
              <Input
                {...register('terminoTecnico')}
                placeholder="Ej: Purchase Order (PO) (opcional)"
              />
            </FormField>
          </div>

          <FormField label="Definición" required error={errors.definicion?.message}>
            <Textarea
              {...register('definicion')}
              placeholder="Significado exacto en el contexto del cliente (mín. 20 caracteres)"
              rows={3}
              error={!!errors.definicion}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Sinónimos" error={errors.sinonimos?.message}>
              <Input
                {...register('sinonimos')}
                placeholder="Separar por comas: OC, pedido, orden (opcional)"
              />
            </FormField>
            <FormField label="Fuente" required error={errors.fuente?.message}>
              {stakeholders.length > 0 ? (
                <select
                  {...register('fuente')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Seleccionar fuente...</option>
                  {stakeholders.map((s) => (
                    <option key={s.id} value={`${s.nombre} (${s.cargo})`}>
                      {s.nombre} — {s.cargo}
                    </option>
                  ))}
                  <option value="Equipo Austranet">Equipo Austranet</option>
                  <option value="Documentación interna">Documentación interna</option>
                  <option value="Observación directa">Observación directa</option>
                  <option value="Normativa del sector">Normativa del sector</option>
                </select>
              ) : (
                <Input
                  {...register('fuente')}
                  placeholder="Ej: Juan Pérez (Jefe de Operaciones)"
                  error={!!errors.fuente}
                />
              )}
              {errors.fuente && (
                <p className="text-xs text-red-500 mt-1">{errors.fuente.message}</p>
              )}
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Contexto de uso" error={errors.contexto?.message}>
              <Input
                {...register('contexto')}
                placeholder="Ej: Proceso de compras, área financiera (opcional)"
              />
            </FormField>
            <FormField label="Fecha de validación" error={errors.fechaValidacion?.message}>
              <input
                type="date"
                {...register('fechaValidacion')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </FormField>
          </div>

          <FormField label="Advertencia" error={errors.advertencia?.message}>
            <Input
              {...register('advertencia')}
              placeholder="Ej: No confundir con Factura. Aplica solo al proceso interno. (opcional)"
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : termino ? 'Guardar cambios' : 'Agregar término'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------------------------------

interface GlosarioTabProps {
  entidadId: string;
  entidadNombre: string;
  stakeholders: Stakeholder[];
  checklistActual?: Partial<ChecklistGlosario>;
}

export function GlosarioTab({
  entidadId,
  entidadNombre,
  stakeholders,
  checklistActual,
}: GlosarioTabProps) {
  const { data: terminos = [], isLoading } = useGlosario(entidadId);
  const { mutate: deleteTermino } = useDeleteEntradaGlosario(entidadId);
  const { mutate: updateChecklist } = useUpdateChecklistGlosario(entidadId);

  const [modalOpen, setModalOpen] = useState(false);
  const [terminoEditando, setTerminoEditando] = useState<EntradaGlosario | null>(null);
  const [checklistAbierto, setChecklistAbierto] = useState(false);
  const [checklist, setChecklist] = useState<Partial<ChecklistGlosario>>(
    checklistActual ?? {}
  );
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<'todos' | 'validados' | 'sin_validar' | 'con_advertencia'>('todos');
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());

  const handleDeleteTermino = (t: EntradaGlosario) => {
    if (!confirm(`¿Eliminar el término "${t.termino}" del glosario?`)) return;
    deleteTermino(t.id);
  };

  const handleChecklistChange = (key: keyof ChecklistGlosario, value: boolean) => {
    const nuevo = { ...checklist, [key]: value };
    setChecklist(nuevo);
    updateChecklist(nuevo);
  };

  const toggleExpandir = (id: string) => {
    setExpandidos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filtrado en cliente
  const terminosFiltrados = terminos
    .filter((t) => {
      if (busqueda.trim()) {
        const b = busqueda.toLowerCase();
        if (
          !t.termino.toLowerCase().includes(b) &&
          !t.definicion.toLowerCase().includes(b)
        )
          return false;
      }
      if (filtro === 'validados') return !!t.fechaValidacion;
      if (filtro === 'sin_validar') return !t.fechaValidacion;
      if (filtro === 'con_advertencia') return !!t.advertencia;
      return true;
    });

  // Progreso del checklist
  const allChecks = [...CHECKLIST_CONSTRUCCION, ...CHECKLIST_VALIDACION];
  const completados = allChecks.filter((c) => !!checklist[c.key]).length;
  const pctChecklist = Math.round((completados / allChecks.length) * 100);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Glosario de Dominio
            </h3>
            <CoberturaGlosarioBadge count={terminos.length} />
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Términos específicos del sector y contexto de {entidadNombre}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => { setTerminoEditando(null); setModalOpen(true); }}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Agregar término
        </Button>
      </div>

      {/* Checklist colapsable (M1-03 §8) */}
      <Card>
        <CardHeader
          className="cursor-pointer py-3"
          onClick={() => setChecklistAbierto((v) => !v)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              {checklistAbierto ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              Checklist operativo (M1-03 §8) — {completados}/{allChecks.length} completados
            </CardTitle>
            <span
              className={`text-xs font-semibold ${
                pctChecklist === 100
                  ? 'text-green-600'
                  : pctChecklist >= 50
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
            >
              {pctChecklist}%
            </span>
          </div>
        </CardHeader>
        {checklistAbierto && (
          <CardContent className="pt-0 space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                §8.1 Construcción del glosario
              </p>
              <div className="space-y-2">
                {CHECKLIST_CONSTRUCCION.map(({ key, label }) => (
                  <label key={key} className="flex items-start gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={!!checklist[key]}
                      onChange={(e) => handleChecklistChange(key, e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary"
                    />
                    <span
                      className={`text-sm leading-relaxed ${
                        checklist[key] ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                §8.2 Validación del glosario
              </p>
              <div className="space-y-2">
                {CHECKLIST_VALIDACION.map(({ key, label }) => (
                  <label key={key} className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!checklist[key]}
                      onChange={(e) => handleChecklistChange(key, e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary"
                    />
                    <span
                      className={`text-sm leading-relaxed ${
                        checklist[key] ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {pctChecklist === 100 && (
              <div className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 px-3 py-2 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                <p className="text-xs text-green-700 dark:text-green-400">
                  ✅ Glosario listo para Módulo 2/3
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="search"
          placeholder="Buscar por término o definición..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex h-9 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="flex gap-1">
          {(
            [
              { value: 'todos', label: 'Todos' },
              { value: 'validados', label: 'Validados' },
              { value: 'sin_validar', label: 'Sin validar' },
              { value: 'con_advertencia', label: 'Con advertencia' },
            ] as const
          ).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFiltro(value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filtro === value
                  ? 'bg-primary text-white'
                  : 'border border-input bg-background hover:bg-accent'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de términos */}
      {terminosFiltrados.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium">
            {terminos.length === 0
              ? 'El glosario está vacío'
              : 'No hay términos que coincidan con el filtro'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {terminos.length === 0
              ? 'Agrega términos del dominio del cliente para completar el perfil.'
              : 'Ajusta los filtros o la búsqueda.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {terminosFiltrados.map((t) => {
            const expandido = expandidos.has(t.id);
            return (
              <Card key={t.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Fila principal */}
                  <div
                    className="flex items-start gap-3 p-3 cursor-pointer hover:bg-accent/30 transition-colors"
                    onClick={() => toggleExpandir(t.id)}
                  >
                    <button className="mt-0.5 shrink-0 text-muted-foreground">
                      {expandido ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{t.termino}</span>
                        {t.terminoTecnico && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            {t.terminoTecnico}
                          </Badge>
                        )}
                        {t.fechaValidacion && (
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 py-0 bg-green-50 text-green-700 border-green-200"
                          >
                            ✓ Validado
                          </Badge>
                        )}
                        {t.advertencia && (
                          <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {t.definicion}
                      </p>
                    </div>
                    {/* Acciones */}
                    <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => { setTerminoEditando(t); setModalOpen(true); }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteTermino(t)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Detalle expandido */}
                  {expandido && (
                    <div className="px-10 pb-3 space-y-2 border-t bg-muted/20">
                      {t.sinonimos && t.sinonimos.length > 0 && (
                        <div className="flex items-start gap-2 pt-2">
                          <span className="text-xs text-muted-foreground w-28 shrink-0">Sinónimos</span>
                          <div className="flex flex-wrap gap-1">
                            {t.sinonimos.map((s) => (
                              <Badge key={s} variant="secondary" className="text-xs">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {t.contexto && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground w-28 shrink-0">Contexto</span>
                          <span className="text-xs">{t.contexto}</span>
                        </div>
                      )}
                      {t.advertencia && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground w-28 shrink-0 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-yellow-500" />
                            Advertencia
                          </span>
                          <span className="text-xs text-yellow-700 dark:text-yellow-400">
                            {t.advertencia}
                          </span>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-muted-foreground w-28 shrink-0">Fuente</span>
                        <span className="text-xs">{t.fuente}</span>
                      </div>
                      {t.fechaValidacion && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground w-28 shrink-0">Validado el</span>
                          <span className="text-xs">
                            {format(new Date(t.fechaValidacion), "d 'de' MMMM yyyy", { locale: es })}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal agregar / editar */}
      <TerminoModal
        open={modalOpen}
        onOpenChange={(v) => {
          setModalOpen(v);
          if (!v) setTerminoEditando(null);
        }}
        entidadId={entidadId}
        termino={terminoEditando}
        stakeholders={stakeholders}
      />
    </div>
  );
}
