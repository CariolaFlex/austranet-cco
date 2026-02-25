'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe, MapPin, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EntidadHeader } from '@/components/entidades/EntidadHeader';
import { EntidadKPIs } from '@/components/entidades/EntidadKPIs';
import { StakeholdersTab } from '@/components/entidades/StakeholdersTab';
import { HistorialTab } from '@/components/entidades/HistorialTab';
import { GlosarioTab } from '@/components/entidades/GlosarioTab';
import { useEntidad } from '@/hooks/useEntidades';
import { useGlosario } from '@/hooks/useGlosario';
import { ROUTES } from '@/constants';

interface Props {
  params: Promise<{ entidadId: string }>;
}

export default function DetalleEntidadPage({ params }: Props) {
  const { entidadId } = use(params);
  const { data: entidad, isLoading, isError } = useEntidad(entidadId);
  const { data: terminos = [] } = useGlosario(entidadId);
  const glosarioCount = terminos.length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !entidad) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.ENTIDADES}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Volver a entidades
          </Link>
        </Button>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-sm text-destructive">
            No se encontró la entidad o ocurrió un error al cargarla.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={ROUTES.ENTIDADES}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Volver a entidades
        </Link>
      </Button>

      <EntidadHeader
        entidad={entidad}
        onDeleted={() => { window.location.href = ROUTES.ENTIDADES; }}
      />

      <EntidadKPIs entidad={entidad} glosarioCount={glosarioCount} />

      <Tabs defaultValue="informacion">
        <TabsList className="mb-4">
          <TabsTrigger value="informacion">Información</TabsTrigger>
          <TabsTrigger value="stakeholders">
            Stakeholders ({entidad.stakeholders.length})
          </TabsTrigger>
          <TabsTrigger value="glosario">
            Glosario ({glosarioCount})
          </TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="informacion">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Identificación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <InfoRow label="RUT" value={entidad.rut} />
                <InfoRow label="Razón social" value={entidad.razonSocial} />
                {entidad.nombreComercial && (
                  <InfoRow label="Nombre comercial" value={entidad.nombreComercial} />
                )}
                <InfoRow
                  label="Sector"
                  value={entidad.sector.charAt(0).toUpperCase() + entidad.sector.slice(1)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ubicación y contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <InfoRow
                  label="País"
                  value={entidad.pais}
                  icon={<MapPin className="h-3.5 w-3.5" />}
                />
                {entidad.ciudad && <InfoRow label="Ciudad" value={entidad.ciudad} />}
                {entidad.direccion && <InfoRow label="Dirección" value={entidad.direccion} />}
                {entidad.sitioWeb && (
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground w-36 shrink-0 flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" />
                      Sitio web
                    </span>
                    <a
                      href={entidad.sitioWeb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      {entidad.sitioWeb}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">NDA</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {entidad.tieneNDA ? (
                  <div className="space-y-2">
                    <InfoRow label="Estado" value="NDA firmado ✓" />
                    {entidad.fechaNDA && (
                      <InfoRow
                        label="Fecha de firma"
                        value={new Date(entidad.fechaNDA).toLocaleDateString('es-CL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      />
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Sin NDA registrado</p>
                )}
              </CardContent>
            </Card>

            {entidad.notas && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Notas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                    {entidad.notas}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stakeholders">
          <StakeholdersTab stakeholders={entidad.stakeholders} />
        </TabsContent>

        <TabsContent value="glosario">
          <GlosarioTab
            entidadId={entidadId}
            entidadNombre={entidad.nombreComercial ?? entidad.razonSocial}
            stakeholders={entidad.stakeholders}
            checklistActual={entidad.checklistGlosario}
          />
        </TabsContent>

        <TabsContent value="historial">
          <HistorialTab entidadId={entidadId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-muted-foreground w-36 shrink-0 flex items-center gap-1">
        {icon}
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
