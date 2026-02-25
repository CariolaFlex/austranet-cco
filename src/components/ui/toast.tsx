'use client';

import * as React from 'react';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// ==========================================
// TIPOS
// ==========================================

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

// ==========================================
// CONTEXT
// ==========================================

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// ==========================================
// PROVIDER
// ==========================================

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove después del duration
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = React.useCallback((title: string, description?: string) => {
    addToast({ type: 'success', title, description });
  }, [addToast]);

  const error = React.useCallback((title: string, description?: string) => {
    addToast({ type: 'error', title, description, duration: 7000 });
  }, [addToast]);

  const warning = React.useCallback((title: string, description?: string) => {
    addToast({ type: 'warning', title, description });
  }, [addToast]);

  const info = React.useCallback((title: string, description?: string) => {
    addToast({ type: 'info', title, description });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// ==========================================
// CONTAINER
// ==========================================

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

// ==========================================
// TOAST ITEM
// ==========================================

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  const borderColors = {
    success: 'border-l-green-500',
    error: 'border-l-red-500',
    warning: 'border-l-yellow-500',
    info: 'border-l-blue-500',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border border-l-4 bg-white p-4 shadow-lg dark:bg-gray-800',
        'animate-in slide-in-from-right-full duration-300',
        borderColors[toast.type]
      )}
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-900 dark:text-white">{toast.title}</p>
        {toast.description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{toast.description}</p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium text-primary hover:underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ==========================================
// HOOK SIMPLIFICADO (sin context)
// ==========================================

let toastFunctions: ToastContextType | null = null;

export function setToastFunctions(fns: ToastContextType) {
  toastFunctions = fns;
}

export const toast = {
  success: (title: string, description?: string) => toastFunctions?.success(title, description),
  error: (title: string, description?: string) => toastFunctions?.error(title, description),
  warning: (title: string, description?: string) => toastFunctions?.warning(title, description),
  info: (title: string, description?: string) => toastFunctions?.info(title, description),
};

// ==========================================
// SONNER-LIKE API (alternativa simple)
// ==========================================

interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class Toaster {
  private listeners: ((toast: Toast) => void)[] = [];
  
  subscribe(listener: (toast: Toast) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emit(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).substr(2, 9);
    this.listeners.forEach((listener) => listener({ ...toast, id }));
  }

  success(title: string, options?: ToastOptions) {
    this.emit({ type: 'success', title, ...options });
  }

  error(title: string, options?: ToastOptions) {
    this.emit({ type: 'error', title, duration: 7000, ...options });
  }

  warning(title: string, options?: ToastOptions) {
    this.emit({ type: 'warning', title, ...options });
  }

  info(title: string, options?: ToastOptions) {
    this.emit({ type: 'info', title, ...options });
  }
}

export const toaster = new Toaster();
