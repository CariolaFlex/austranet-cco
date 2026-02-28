// ============================================================
// HOOK: useNotificacionesFS — T-02
// Notificaciones Firestore en tiempo real (onSnapshot).
// SEPARADO de useNotificaciones.ts (que computa alertas del caché).
// ============================================================

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore'
import { getFirestoreDb } from '@/lib/firebase/firestore'
import { notificacionesService } from '@/services/notificaciones.service'
import type { NotificacionFS } from '@/types'

const COLECCION = 'notificaciones'

/**
 * Hook en tiempo real para las notificaciones Firestore de un usuario.
 * Usa onSnapshot para actualización instantánea sin polling.
 */
export function useNotificacionesFS(uid: string, limite = 20) {
  const [notificaciones, setNotificaciones] = useState<NotificacionFS[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!uid) {
      setIsLoading(false)
      return
    }

    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCION),
      where('destinatarios', 'array-contains', uid),
      where('estado', 'in', ['pendiente', 'leida']),
      orderBy('fechaCreacion', 'desc'),
      limit(limite)
    )

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs: NotificacionFS[] = snap.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            tipo: data.tipo,
            canal: data.canal,
            destinatarios: data.destinatarios ?? [],
            titulo: data.titulo,
            mensaje: data.mensaje,
            accionRequerida: data.accionRequerida ?? false,
            accionUrl: data.accionUrl,
            entidadRelacionada: data.entidadRelacionada,
            modulo: data.modulo,
            estado: data.estado,
            fechaCreacion: data.fechaCreacion?.toDate
              ? data.fechaCreacion.toDate()
              : new Date(data.fechaCreacion),
            prioridad: data.prioridad,
            fechaExpiracion: data.fechaExpiracion?.toDate
              ? data.fechaExpiracion.toDate()
              : data.fechaExpiracion,
            escaladaEl: data.escaladaEl?.toDate
              ? data.escaladaEl.toDate()
              : data.escaladaEl,
          } as NotificacionFS
        })
        setNotificaciones(docs)
        setIsLoading(false)
      },
      (err) => {
        setError(err)
        setIsLoading(false)
      }
    )

    return () => unsub()
  }, [uid, limite])

  const noLeidas = notificaciones.filter((n) => n.estado === 'pendiente')

  return {
    notificaciones,
    noLeidas,
    totalNoLeidas: noLeidas.length,
    isLoading,
    error,
  }
}

/** Mutaciones para marcar notificaciones */
export function useMutacionNotificacion(uid: string) {
  const qc = useQueryClient()

  const marcarLeida = useMutation({
    mutationFn: (notificacionId: string) =>
      notificacionesService.marcarLeida(notificacionId),
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
    },
  })

  const marcarTodasLeidas = useMutation({
    mutationFn: () => notificacionesService.marcarTodasLeidas(uid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notificaciones', uid] })
      toast.success('Todas las notificaciones marcadas como leídas')
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
    },
  })

  const archivar = useMutation({
    mutationFn: (notificacionId: string) =>
      notificacionesService.archivar(notificacionId),
    onError: (error: Error) => {
      toast.error(`Error al archivar: ${error.message}`)
    },
  })

  return { marcarLeida, marcarTodasLeidas, archivar }
}
