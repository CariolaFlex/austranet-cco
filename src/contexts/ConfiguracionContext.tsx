'use client';

// ============================================================
// CONTEXTO: Configuración del Sistema — T-06
// Lee la config una vez al montar y la expone globalmente.
// Suscribe a cambios de modoMantenimiento en tiempo real.
// ============================================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { configuracionService } from '@/services/configuracion.service';
import type { ConfiguracionSistema } from '@/types';
import { CONFIG_SISTEMA_DEFAULTS } from '@/types';

// ── Tipos ──────────────────────────────────────────────────
interface ConfiguracionContextType {
  config: ConfiguracionSistema;
  loading: boolean;
  refreshConfig: () => Promise<void>;
  modoMantenimiento: boolean;
}

// ── Context ────────────────────────────────────────────────
const ConfiguracionContext = createContext<ConfiguracionContextType>({
  config: CONFIG_SISTEMA_DEFAULTS,
  loading: true,
  refreshConfig: async () => {},
  modoMantenimiento: false,
});

// ── Provider ───────────────────────────────────────────────
export function ConfiguracionProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ConfiguracionSistema>(CONFIG_SISTEMA_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [modoMantenimiento, setModoMantenimiento] = useState(false);

  const loadConfig = useCallback(async () => {
    try {
      const sistemaConfig = await configuracionService.getSistema();
      setConfig(sistemaConfig);
      setModoMantenimiento(sistemaConfig.sistema?.modoMantenimiento ?? false);
    } catch {
      // Silencioso — usa defaults si falla
      setConfig(CONFIG_SISTEMA_DEFAULTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Carga inicial
    loadConfig();

    // Suscripción en tiempo real SOLO para modoMantenimiento
    const unsub = configuracionService.onModoMantenimientoChange((activo) => {
      setModoMantenimiento(activo);
    });

    return () => unsub();
  }, [loadConfig]);

  const refreshConfig = useCallback(async () => {
    await loadConfig();
  }, [loadConfig]);

  return (
    <ConfiguracionContext.Provider value={{ config, loading, refreshConfig, modoMantenimiento }}>
      {children}
    </ConfiguracionContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────
export function useConfiguracionContext(): ConfiguracionContextType {
  return useContext(ConfiguracionContext);
}
