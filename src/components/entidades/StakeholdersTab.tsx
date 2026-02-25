'use client';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/data-table';
import type { Stakeholder } from '@/types';

const ROL_LABELS: Record<string, string> = {
  usuario_final: 'Usuario Final',
  gerente_sistema: 'Gerente Sistema',
  propietario: 'Propietario',
  responsable_tecnico: 'Resp. Técnico',
  experto_dominio: 'Experto Dominio',
  regulador_externo: 'Regulador Externo',
  administrador_negocio: 'Admin. Negocio',
  ti_mantenimiento: 'TI / Mantenimiento',
};

const NIVEL_BADGE: Record<string, string> = {
  alto: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200',
  medio: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200',
  bajo: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200',
};

function NivelBadge({ nivel }: { nivel: string }) {
  return (
    <Badge variant="outline" className={NIVEL_BADGE[nivel] ?? NIVEL_BADGE.bajo}>
      {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
    </Badge>
  );
}

/** Matriz 2x2 Influencia / Interés (M1-01 §6) */
function MatrizInfluenciaInteres({ stakeholders }: { stakeholders: Stakeholder[] }) {
  const cuadrantes = {
    'alto-alto': stakeholders.filter((s) => s.nivelInfluencia === 'alto' && s.nivelInteres === 'alto'),
    'alto-bajo': stakeholders.filter((s) => s.nivelInfluencia === 'alto' && s.nivelInteres === 'bajo'),
    'bajo-alto': stakeholders.filter((s) => s.nivelInfluencia === 'bajo' && s.nivelInteres === 'alto'),
    'bajo-bajo': stakeholders.filter((s) => s.nivelInfluencia === 'bajo' && s.nivelInteres === 'bajo'),
  };

  const hasData = stakeholders.some((s) => s.nivelInfluencia && s.nivelInteres);
  if (!hasData) return null;

  const CellList = ({ items }: { items: Stakeholder[] }) => (
    <ul className="space-y-1">
      {items.map((s) => (
        <li key={s.id} className="text-xs font-medium truncate">{s.nombre}</li>
      ))}
      {items.length === 0 && <li className="text-xs text-muted-foreground italic">–</li>}
    </ul>
  );

  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold mb-3">Matriz Influencia / Interés</h4>
      <div className="border rounded-lg overflow-hidden">
        {/* Encabezado */}
        <div className="grid grid-cols-[80px_1fr_1fr] bg-muted/50">
          <div className="p-2 text-xs font-medium text-muted-foreground" />
          <div className="p-2 text-xs font-semibold text-center border-l">Interés Bajo</div>
          <div className="p-2 text-xs font-semibold text-center border-l">Interés Alto</div>
        </div>

        {/* Fila Influencia Alta */}
        <div className="grid grid-cols-[80px_1fr_1fr] border-t">
          <div className="p-2 text-xs font-medium text-muted-foreground flex items-center justify-end pr-3 bg-muted/30">
            Alta
          </div>
          {/* Mantener satisfecho */}
          <div className="p-3 border-l bg-yellow-50 dark:bg-yellow-900/10 min-h-[80px]">
            <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 mb-2">🟡 Mantener satisfecho</p>
            <CellList items={cuadrantes['alto-bajo']} />
          </div>
          {/* Gestionar de cerca */}
          <div className="p-3 border-l bg-red-50 dark:bg-red-900/10 min-h-[80px]">
            <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2">🔴 Gestionar de cerca</p>
            <CellList items={cuadrantes['alto-alto']} />
          </div>
        </div>

        {/* Fila Influencia Baja */}
        <div className="grid grid-cols-[80px_1fr_1fr] border-t">
          <div className="p-2 text-xs font-medium text-muted-foreground flex items-center justify-end pr-3 bg-muted/30">
            Baja
          </div>
          {/* Monitorear */}
          <div className="p-3 border-l min-h-[80px]">
            <p className="text-xs font-semibold text-gray-500 mb-2">⚫ Monitorear</p>
            <CellList items={cuadrantes['bajo-bajo']} />
          </div>
          {/* Mantener informado */}
          <div className="p-3 border-l bg-blue-50 dark:bg-blue-900/10 min-h-[80px]">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">🔵 Mantener informado</p>
            <CellList items={cuadrantes['bajo-alto']} />
          </div>
        </div>

        {/* Leyenda ejes */}
        <div className="border-t p-2 bg-muted/20 text-center">
          <span className="text-xs text-muted-foreground">Eje Y: Influencia · Eje X: Interés</span>
        </div>
      </div>
    </div>
  );
}

interface StakeholdersTabProps {
  stakeholders: Stakeholder[];
}

export function StakeholdersTab({ stakeholders }: StakeholdersTabProps) {
  if (stakeholders.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm">No hay stakeholders registrados para esta entidad</p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre / Cargo</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Influencia</TableHead>
              <TableHead>Interés</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Contacto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stakeholders.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{s.nombre}</p>
                    <p className="text-xs text-muted-foreground">{s.cargo}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{ROL_LABELS[s.rol] ?? s.rol}</span>
                </TableCell>
                <TableCell>
                  <NivelBadge nivel={s.nivelInfluencia} />
                </TableCell>
                <TableCell>
                  <NivelBadge nivel={s.nivelInteres} />
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{s.canalComunicacion || '–'}</span>
                </TableCell>
                <TableCell>
                  <div>
                    <a href={`mailto:${s.email}`} className="text-sm text-primary hover:underline">
                      {s.email}
                    </a>
                    {s.telefono && (
                      <p className="text-xs text-muted-foreground">{s.telefono}</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <MatrizInfluenciaInteres stakeholders={stakeholders} />
    </div>
  );
}
