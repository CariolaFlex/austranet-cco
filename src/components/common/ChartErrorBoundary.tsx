'use client'

/**
 * ChartErrorBoundary — M4 · Sprint M4-S07
 * Error boundary para gráficos y visualizaciones.
 * Captura errores de render y muestra un mensaje amigable con botón Reintentar.
 */

import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  /** Nombre descriptivo del gráfico para el mensaje de error */
  nombre?: string
  /** Altura mínima del placeholder de error (px). Default 200. */
  minHeight?: number
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ChartErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[ChartErrorBoundary] "${this.props.nombre ?? 'Gráfico'}":`, error, info)
  }

  reset = () => this.setState({ hasError: false, error: null })

  render() {
    if (this.state.hasError) {
      return (
        <Card style={{ minHeight: this.props.minHeight ?? 200 }}>
          <CardContent className="flex flex-col items-center justify-center h-full gap-3 py-8 text-center">
            <AlertTriangle className="h-7 w-7 text-amber-500" />
            <div>
              <p className="font-medium text-sm">
                Error al renderizar {this.props.nombre ?? 'el gráfico'}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {this.state.error?.message ?? 'Error desconocido'}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={this.reset}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      )
    }
    return this.props.children
  }
}
