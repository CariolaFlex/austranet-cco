'use client';

// ============================================================
// COMPONENTE: EntidadKPIs — Módulo 1 Sprint 2
// KPIs de calidad del perfil (M1-07 §7.1)
// ============================================================

import { useEffect, useState } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  ShieldCheck,
  BookOpen,
  FolderKanban,
  Activity,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/lib';
import { Badge } from '@/components/ui/badge';
import { entidadesService } from '@/services/entidades.service';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase/firestore';
import type { Entidad } from '@/types';

// -------------------------------------------------------
// KPI 1: % completitud del perfil (M1-07 §7.1)
// Campos evaluados: 8 campos obligatorios
// -------------------------------------------------------

function calcularPorcentajeCompletitud(entidad: Entidad): number {
  const stks = entidad.stakeholders ?? [];
  const checks = [
    !!entidad.razonSocial?.trim(),
    !!entidad.rut?.trim(),
    !!entidad.tipo,
    !!entidad.sector,
    !!entidad.pais?.trim(),
    !!entidad.estado,
    stks.some((s) => !!s.nivelInfluencia),
    !!entidad.nivelRiesgo,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

// -------------------------------------------------------
// KPI 4: Proyectos vinculados (getCountFromServer)
// -------------------------------------------------------

function useProyectosVinculados(entidadId: string) {
  const [total, setTotal] = useState<number | null>(null);
  const [activos, setActivos] = useState(0);
  const [completados, setCompletados] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const db = getFirestoreDb();
        const col = collection(db, 'proyectos');
        const [snapTotal, snapActivos, snapComp] = await Promise.all([
          getCountFromServer(query(col, where('clienteId', '==', entidadId))),
          getCountFromServer(
            query(col, where('clienteId', '==', entidadId), where('estado', 'in', [
              'activo_en_definicion', 'activo_en_desarrollo',
            ]))
          ),
          getCountFromServer(
            query(col, where('clienteId', '==', entidadId), where('estado', '==', 'completado'))
          ),
        ]);
        setTotal(snapTotal.data().count);
        setActivos(snapActivos.data().count);
        setCompletados(snapComp.data().count);
      } catch {
        setTotal(0);
      }
    };
    if (entidadId) fetch();
  }, [entidadId]);

  return { total, activos, completados };
}

// -------------------------------------------------------
// KPI 5: Stepper de completitud global (M1-07 §9)
// -------------------------------------------------------

const NIVELES = [
  {
    key: 'minimo' as const,
    label: 'MÍNIMO',
    desc: 'Datos básicos + 1 stakeholder',
  },
  {
    key: 'estandar' as const,
    label: 'ESTÁNDAR',
    desc: '≥2 stk + factibilidad + 5 términos',
  },
  {
    key: 'completo' as const,
    label: 'COMPLETO',
    desc: 'NDA + 10 términos + todos con canal',
  },
];

const ORDEN: Record<string, number> = { minimo: 0, estandar: 1, completo: 2 };

function CompletitudStepper({
  nivel,
  glosarioCount,
  entidad,
}: {
  nivel: 'minimo' | 'estandar' | 'completo';
  glosarioCount: number;
  entidad: Entidad;
}) {
  const nivelIdx = ORDEN[nivel];
  const stks = entidad.stakeholders ?? [];

  // Calcular qué falta para nivel siguiente
  const pendienteEstandar: string[] = [];
  const stkInfluencia = stks.filter((s) => !!s.nivelInfluencia).length;
  if (stkInfluencia < 2) pendienteEstandar.push(`Stakeholders influencia: ${stkInfluencia}/2`);
  if (!entidad.respuestasFactibilidad) pendienteEstandar.push('Evaluación factibilidad pendiente');
  if (glosarioCount < 5) pendienteEstandar.push(`Glosario: ${glosarioCount}/5 términos`);

  const pendienteCompleto: string[] = [];
  const ndaResuelto =
    entidad.tieneNDA === false || (entidad.tieneNDA === true && !!entidad.fechaNDA);
  if (!ndaResuelto) pendienteCompleto.push('NDA pendiente de fecha');
  if (glosarioCount < 10) pendienteCompleto.push(`Glosario: ${glosarioCount}/10 términos`);
  const sinCanal = stks.filter((s) => !s.canalComunicacion?.trim()).length;
  if (sinCanal > 0) pendienteCompleto.push(`${sinCanal} stk sin canal`);
  const stkAltos = stks.filter((s) => s.nivelInfluencia === 'alto').length;
  if (stkAltos < 2) pendienteCompleto.push(`Stakeholders alto: ${stkAltos}/2`);

  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <p className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wide">
          Nivel de completitud global (M1-07 §9)
        </p>
        <div className="flex items-start">
          {NIVELES.map((n, idx) => {
            const alcanzado = nivelIdx >= idx;
            const esActual = nivelIdx === idx;
            const esUltimo = idx === NIVELES.length - 1;
            const pendiente = idx === 1 ? pendienteEstandar : pendienteCompleto;
            return (
              <div key={n.key} className="flex items-start flex-1">
                <div className="flex flex-col items-center flex-1 min-w-0">
                  {/* Indicador circular */}
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors shrink-0 ${
                      alcanzado
                        ? esActual
                          ? 'bg-primary border-primary text-white'
                          : 'bg-green-500 border-green-500 text-white'
                        : 'border-muted-foreground/30 text-muted-foreground bg-background'
                    }`}
                  >
                    {alcanzado && !esActual ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                  </div>
                  {/* Etiqueta */}
                  <p
                    className={`text-xs font-semibold mt-1.5 text-center ${
                      esActual ? 'text-primary' : alcanzado ? 'text-green-600' : 'text-muted-foreground'
                    }`}
                  >
                    {n.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground text-center leading-tight hidden sm:block px-1">
                    {n.desc}
                  </p>
                  {/* Pendientes del siguiente nivel */}
                  {!alcanzado && idx === nivelIdx + 1 && pendiente.length > 0 && (
                    <div className="mt-2 space-y-0.5 w-full">
                      {pendiente.slice(0, 3).map((item) => (
                        <p key={item} className="text-[10px] text-yellow-600 dark:text-yellow-400 text-center px-1">
                          ⚠ {item}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                {!esUltimo && (
                  <div
                    className={`h-0.5 flex-1 mt-4 mx-1 shrink-0 ${
                      nivelIdx > idx ? 'bg-green-500' : 'bg-muted-foreground/20'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------------------------------

interface EntidadKPIsProps {
  entidad: Entidad;
  glosarioCount?: number;
}

export function EntidadKPIs({ entidad, glosarioCount = 0 }: EntidadKPIsProps) {
  const nivel = entidadesService.calcularNivelCompletitud(entidad, glosarioCount);
  const pct = calcularPorcentajeCompletitud(entidad);
  const stks = entidad.stakeholders ?? [];
  const stkAltos = stks.filter((s) => s.nivelInfluencia === 'alto').length;
  const { total: totalProy, activos: proyActivos, completados: proyComp } =
    useProyectosVinculados(entidad.id);

  const colorPct = pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-600';
  const colorGlosario =
    glosarioCount >= 10 ? 'text-green-600' : glosarioCount >= 5 ? 'text-yellow-600' : 'text-red-600';

  const ndaVigente =
    entidad.tieneNDA === false ? false : entidad.tieneNDA === true && !!entidad.fechaNDA;

  return (
    <div className="space-y-3 mb-2">
      {/* Fila de KPIs 1-4 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* KPI 1 — Completitud % */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Completitud</span>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className={`text-2xl font-bold ${colorPct}`}>{pct}%</div>
            <Progress value={pct} className="h-1.5 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {pct >= 80 ? 'Óptimo' : pct >= 60 ? 'Incompleto' : '⚠ Insuficiente'}
            </p>
          </CardContent>
        </Card>

        {/* KPI 2 — Stakeholders alto */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Influencia alta</span>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{stkAltos}</div>
            <p className="text-xs text-muted-foreground mt-1">
              de {stks.length} registrados
            </p>
            {stkAltos < 2 && (
              <Badge
                variant="outline"
                className="mt-1 text-[10px] px-1.5 py-0 bg-red-50 text-red-700 border-red-200"
              >
                ⚠ Meta: ≥2
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* KPI 3 — Glosario */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Glosario</span>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className={`text-2xl font-bold ${colorGlosario}`}>{glosarioCount}</div>
            <Progress
              value={Math.min((glosarioCount / 10) * 100, 100)}
              className="h-1.5 mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {glosarioCount >= 10 ? '✓ Completo' : `${glosarioCount}/10 términos`}
            </p>
          </CardContent>
        </Card>

        {/* KPI 4 — Proyectos vinculados */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Proyectos</span>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">
              {totalProy === null ? '—' : totalProy}
            </div>
            {totalProy !== null && totalProy > 0 ? (
              <p className="text-xs text-muted-foreground mt-1">
                {proyActivos} activos · {proyComp} completados
              </p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">Sin proyectos</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* NDA + KPI 5 Stepper */}
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3">
        {/* NDA */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">NDA</span>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              {entidad.tieneNDA === false ? (
                <>
                  <XCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-muted-foreground">Sin NDA</span>
                </>
              ) : ndaVigente ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">Vigente</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-600">Sin fecha</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* KPI 5 — Stepper completitud */}
        <CompletitudStepper nivel={nivel} glosarioCount={glosarioCount} entidad={entidad} />
      </div>
    </div>
  );
}
