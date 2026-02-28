'use client'

// ============================================================
// PÁGINA: Configuración — Sprint 5 + T-06
// Organización, perfil de usuario, sistema (admin/superadmin).
// ============================================================

import { useState, useEffect } from 'react'
import {
  Building2, User, Users, Save, Loader2,
  Settings2, ToggleLeft, ToggleRight, AlertTriangle,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, FormField } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { useConfiguracion, useUpdateConfiguracion } from '@/hooks/useConfiguracion'
import { useConfiguracionSistema, useUpdateConfiguracionSistema } from '@/hooks/useConfiguracionSistema'
import type { ActualizarConfigOrganizacionDTO } from '@/services/configuracion.service'
import { cn } from '@/lib/utils'

const FORM_EMPTY: ActualizarConfigOrganizacionDTO = {
  nombre: '',
  rut: '',
  sector: '',
  pais: '',
  ciudad: '',
  sitioWeb: '',
}

export default function ConfiguracionPage() {
  const { user } = useAuth()
  const { data: config, isLoading } = useConfiguracion()
  const update = useUpdateConfiguracion()

  const isAdmin = user?.rol === 'admin' || user?.rol === 'superadmin'
  const { data: configSistema, isLoading: loadingSistema } = useConfiguracionSistema()
  const updateSistema = useUpdateConfiguracionSistema()

  const [form, setForm] = useState<ActualizarConfigOrganizacionDTO>(FORM_EMPTY)
  const [isDirty, setIsDirty] = useState(false)
  const [confirmMantenimiento, setConfirmMantenimiento] = useState(false)

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

  const toggleModoMantenimiento = () => {
    if (!configSistema || !user) return
    const actual = configSistema.sistema?.modoMantenimiento ?? false
    if (!actual && !confirmMantenimiento) {
      setConfirmMantenimiento(true)
      return
    }
    updateSistema.mutate({
      campos: { sistema: { ...configSistema.sistema, modoMantenimiento: !actual } },
      modificadoPor: user.id,
    })
    setConfirmMantenimiento(false)
  }

  return (
    <div>
      <PageHeader title="Configuración" />

      <div className="space-y-6">
        {/* ── Organización ───────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Datos de la organización</CardTitle>
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
                    <Input value={form.nombre} onChange={setField('nombre')} placeholder="Ej. Austranet S.A." />
                  </FormField>
                  <FormField label="RUT / Identificación fiscal">
                    <Input value={form.rut ?? ''} onChange={setField('rut')} placeholder="Ej. 76.123.456-7" />
                  </FormField>
                  <FormField label="Sector / Industria">
                    <Input value={form.sector ?? ''} onChange={setField('sector')} placeholder="Ej. Tecnología" />
                  </FormField>
                  <FormField label="País">
                    <Input value={form.pais ?? ''} onChange={setField('pais')} placeholder="Ej. Chile" />
                  </FormField>
                  <FormField label="Ciudad">
                    <Input value={form.ciudad ?? ''} onChange={setField('ciudad')} placeholder="Ej. Santiago" />
                  </FormField>
                  <FormField label="Sitio web">
                    <Input value={form.sitioWeb ?? ''} onChange={setField('sitioWeb')} placeholder="Ej. https://austranet.cl" />
                  </FormField>
                </div>
                {config?.actualizadoEn && (
                  <p className="text-xs text-muted-foreground">
                    Última actualización:{' '}
                    {new Date(config.actualizadoEn).toLocaleDateString('es-ES', {
                      day: 'numeric', month: 'long', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                )}
                <div className="flex justify-end pt-1">
                  <Button
                    type="submit"
                    disabled={!form.nombre.trim() || !isDirty || update.isPending}
                    className="gap-2"
                  >
                    {update.isPending
                      ? <><Loader2 className="h-4 w-4 animate-spin" />Guardando…</>
                      : <><Save className="h-4 w-4" />Guardar cambios</>}
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
                <CardTitle className="text-base font-semibold">Mi perfil</CardTitle>
                <p className="text-sm text-muted-foreground">Información del usuario autenticado.</p>
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
              {user?.empresa && (
                <div className="space-y-1.5">
                  <Label>Empresa</Label>
                  <Input value={user.empresa} readOnly className="bg-muted/40 cursor-default" />
                </div>
              )}
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
              <div className={cn('flex h-7 w-7 items-center justify-center rounded-md', isAdmin ? 'bg-primary/10' : 'bg-muted')}>
                <Users className={cn('h-4 w-4', isAdmin ? 'text-primary' : 'text-muted-foreground')} />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Gestión de usuarios</CardTitle>
                <p className="text-sm text-muted-foreground">Administra accesos y roles del sistema.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isAdmin ? (
              <Link
                href="/admin/usuarios"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
              >
                Ir al panel de usuarios <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  La gestión de usuarios requiere permisos de administrador.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Sistema — solo admin/superadmin ──────── */}
        {isAdmin && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                  <Settings2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Sistema</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Configuración avanzada (solo administradores).
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingSistema ? (
                <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando configuración del sistema…
                </div>
              ) : (
                <>
                  {/* Modo mantenimiento */}
                  <div className={cn(
                    'flex items-start justify-between gap-4 rounded-lg border p-4',
                    configSistema?.sistema?.modoMantenimiento
                      ? 'border-orange-200 bg-orange-50 dark:bg-orange-950/20'
                      : 'border-border'
                  )}>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={cn(
                          'h-4 w-4',
                          configSistema?.sistema?.modoMantenimiento ? 'text-orange-600' : 'text-muted-foreground'
                        )} />
                        <p className="text-sm font-medium">Modo mantenimiento</p>
                        {configSistema?.sistema?.modoMantenimiento && (
                          <span className="text-xs text-orange-600 font-medium">(ACTIVO)</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Cuando está activo, todos los usuarios excepto superadmin son redirigidos
                        a la página de mantenimiento.
                      </p>
                      {confirmMantenimiento && (
                        <p className="text-xs text-orange-700 font-medium mt-1.5">
                          ⚠️ ¿Confirmas activar el modo mantenimiento? Esto bloqueará el acceso. Haz click de nuevo para confirmar.
                        </p>
                      )}
                    </div>
                    <Button
                      variant={configSistema?.sistema?.modoMantenimiento ? 'destructive' : 'outline'}
                      size="sm"
                      className="flex-shrink-0 gap-1.5"
                      disabled={updateSistema.isPending}
                      onClick={toggleModoMantenimiento}
                    >
                      {updateSistema.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : configSistema?.sistema?.modoMantenimiento ? (
                        <><ToggleRight className="h-4 w-4" />Desactivar</>
                      ) : (
                        <><ToggleLeft className="h-4 w-4" />Activar</>
                      )}
                    </Button>
                  </div>

                  {/* Info versión */}
                  <div className="flex items-center justify-between text-sm border rounded-lg px-4 py-2.5">
                    <span className="text-muted-foreground text-xs">Versión de la aplicación</span>
                    <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                      v{configSistema?.sistema?.versionApp ?? '—'}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
