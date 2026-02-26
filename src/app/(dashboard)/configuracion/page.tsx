'use client'

// ============================================================
// PÁGINA: Configuración — Sprint 5
// Datos reales de Firestore: organización + perfil de usuario.
// ============================================================

import { useState, useEffect } from 'react'
import { Building2, User, Users, Save, Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, FormField } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { useConfiguracion, useUpdateConfiguracion } from '@/hooks/useConfiguracion'
import type { ActualizarConfigOrganizacionDTO } from '@/services/configuracion.service'

// ── Vacío inicial del formulario ───────────────────────────
const FORM_EMPTY: ActualizarConfigOrganizacionDTO = {
  nombre: '',
  rut: '',
  sector: '',
  pais: '',
  ciudad: '',
  sitioWeb: '',
}

// ── Page ──────────────────────────────────────────────────
export default function ConfiguracionPage() {
  const { user } = useAuth()
  const { data: config, isLoading } = useConfiguracion()
  const update = useUpdateConfiguracion()

  const [form, setForm] = useState<ActualizarConfigOrganizacionDTO>(FORM_EMPTY)
  const [isDirty, setIsDirty] = useState(false)

  // Cargar datos del servidor al form cuando llegan
  useEffect(() => {
    if (config) {
      setForm({
        nombre: config.nombre ?? '',
        rut: config.rut ?? '',
        sector: config.sector ?? '',
        pais: config.pais ?? '',
        ciudad: config.ciudad ?? '',
        sitioWeb: config.sitioWeb ?? '',
      })
      setIsDirty(false)
    }
  }, [config])

  const setField =
    (key: keyof ActualizarConfigOrganizacionDTO) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
      setIsDirty(true)
    }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim() || update.isPending) return
    // Strip empty optional fields
    const payload: ActualizarConfigOrganizacionDTO = {
      nombre: form.nombre.trim(),
      ...(form.rut?.trim() && { rut: form.rut.trim() }),
      ...(form.sector?.trim() && { sector: form.sector.trim() }),
      ...(form.pais?.trim() && { pais: form.pais.trim() }),
      ...(form.ciudad?.trim() && { ciudad: form.ciudad.trim() }),
      ...(form.sitioWeb?.trim() && { sitioWeb: form.sitioWeb.trim() }),
    }
    update.mutate(payload, { onSuccess: () => setIsDirty(false) })
  }

  return (
    <div>
      <PageHeader title="Configuración" />

      <div className="space-y-6">
        {/* ── Datos de la organización ────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  Datos de la organización
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Información básica de tu empresa o institución.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando configuración…
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Nombre de la organización" required>
                    <Input
                      value={form.nombre}
                      onChange={setField('nombre')}
                      placeholder="Ej. Austranet S.A."
                    />
                  </FormField>

                  <FormField label="RUT / Identificación fiscal">
                    <Input
                      value={form.rut ?? ''}
                      onChange={setField('rut')}
                      placeholder="Ej. 76.123.456-7"
                    />
                  </FormField>

                  <FormField label="Sector / Industria">
                    <Input
                      value={form.sector ?? ''}
                      onChange={setField('sector')}
                      placeholder="Ej. Tecnología"
                    />
                  </FormField>

                  <FormField label="País">
                    <Input
                      value={form.pais ?? ''}
                      onChange={setField('pais')}
                      placeholder="Ej. Chile"
                    />
                  </FormField>

                  <FormField label="Ciudad">
                    <Input
                      value={form.ciudad ?? ''}
                      onChange={setField('ciudad')}
                      placeholder="Ej. Santiago"
                    />
                  </FormField>

                  <FormField label="Sitio web">
                    <Input
                      value={form.sitioWeb ?? ''}
                      onChange={setField('sitioWeb')}
                      placeholder="Ej. https://austranet.cl"
                    />
                  </FormField>
                </div>

                {config?.actualizadoEn && (
                  <p className="text-xs text-muted-foreground">
                    Última actualización:{' '}
                    {new Date(config.actualizadoEn).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}

                <div className="flex justify-end pt-1">
                  <Button
                    type="submit"
                    disabled={!form.nombre.trim() || !isDirty || update.isPending}
                    className="gap-2"
                  >
                    {update.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Guardando…
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Guardar cambios
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* ── Perfil de usuario ───────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  Mi perfil
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Información del usuario autenticado actualmente.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Nombre completo</Label>
                <Input value={user?.nombre ?? '—'} readOnly className="bg-muted/40 cursor-default" />
              </div>
              <div className="space-y-1.5">
                <Label>Correo electrónico</Label>
                <Input value={user?.email ?? '—'} readOnly className="bg-muted/40 cursor-default" />
              </div>
              <div className="space-y-1.5">
                <Label>Rol</Label>
                <Input value={user?.rol ?? '—'} readOnly className="bg-muted/40 cursor-default" />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              * La edición del perfil de usuario estará disponible en una próxima versión.
            </p>
          </CardContent>
        </Card>

        {/* ── Gestión de usuarios ─────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  Gestión de usuarios
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Administra los accesos y roles del sistema.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Próximamente</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  La gestión de usuarios estará disponible en una próxima versión.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
