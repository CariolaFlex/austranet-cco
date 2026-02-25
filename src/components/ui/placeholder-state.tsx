'use client';

import React from 'react';
import Link from 'next/link';
import { Construction, ArrowLeft, Sparkles, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PlaceholderStateProps {
  title?: string;
  subtitle?: string;
  moduleName?: string;
  icon?: React.ElementType;
  showBackButton?: boolean;
  className?: string;
}

export function PlaceholderState({
  title = 'Módulo en Desarrollo',
  subtitle = 'Esta funcionalidad se migrará a la arquitectura Azure en la siguiente fase.',
  moduleName,
  icon: Icon = Construction,
  showBackButton = true,
  className,
}: PlaceholderStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[60vh] p-8 text-center',
        className
      )}
    >
      {/* Animated icon container */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
          <Icon className="h-10 w-10 text-primary" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold tracking-tight">
        {title}
      </h2>

      {/* Module name badge */}
      {moduleName && (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          {moduleName}
        </div>
      )}

      {/* Subtitle */}
      <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
        {subtitle}
      </p>

      {/* Azure architecture badge */}
      <div className="mt-6 flex items-center gap-2 rounded-lg border bg-card/50 px-4 py-2 text-xs text-muted-foreground">
        <Shield className="h-3.5 w-3.5 text-blue-500" />
        <span>Próximamente: Integración con Azure AI + GraphRAG</span>
      </div>

      {/* Back button */}
      {showBackButton && (
        <Link href="/dashboard" className="mt-8">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
        </Link>
      )}
    </div>
  );
}
