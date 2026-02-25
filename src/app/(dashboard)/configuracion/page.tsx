import { Users } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ConfiguracionPage() {
  return (
    <div>
      <PageHeader title="Configuración" />

      <div className="space-y-6">
        {/* ── Datos de la organización ────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Datos de la organización
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Información básica de tu empresa o institución.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="nombre-empresa">Nombre de la empresa</Label>
                <Input
                  id="nombre-empresa"
                  placeholder="Ej. Austranet S.A."
                  disabled
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rut">RUT / Identificación fiscal</Label>
                <Input
                  id="rut"
                  placeholder="Ej. 76.123.456-7"
                  disabled
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sector">Sector / Industria</Label>
                <Input
                  id="sector"
                  placeholder="Ej. Tecnología"
                  disabled
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pais">País</Label>
                <Input
                  id="pais"
                  placeholder="Ej. Chile"
                  disabled
                />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              * La edición de estos campos estará disponible una vez configurado Firebase.
            </p>
          </CardContent>
        </Card>

        {/* ── Gestión de usuarios ─────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Gestión de usuarios
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Administra los accesos y roles del sistema.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Próximamente
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  La gestión de usuarios estará disponible en una próxima versión.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
