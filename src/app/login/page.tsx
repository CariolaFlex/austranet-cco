'use client';

// Fuerza renderizado dinámico (evita prerendering sin Firebase credentials)
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Network,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Chrome,
} from 'lucide-react';

// ── Cookie helper ─────────────────────────────────────────
// Marca de sesión para el middleware de Next.js.
// La validación real de identidad la realiza Firebase en cada operación.
function setSessionCookie() {
  document.cookie = '__session=1; path=/; max-age=3600; SameSite=Lax';
}

// ── Error messages ────────────────────────────────────────
function getErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/invalid-email': 'El email ingresado no es válido.',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
    'auth/user-not-found': 'No existe una cuenta con ese email.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
    'auth/popup-closed-by-user': 'Inicio de sesión cancelado.',
    'auth/invalid-credential': 'Email o contraseña incorrectos.',
    'auth/network-request-failed': 'Error de red. Verifica tu conexión.',
  };
  return messages[code] ?? 'Error de autenticación. Intenta nuevamente.';
}

// ── Component ─────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [mode, setMode] = useState<'login' | 'reset'>('login');

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      setSessionCookie();
      router.push('/dashboard');
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      setError(getErrorMessage(firebaseError.code ?? ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setSessionCookie();
      router.push('/dashboard');
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      setError(getErrorMessage(firebaseError.code ?? ''));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      setError(getErrorMessage(firebaseError.code ?? ''));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* ── Panel izquierdo — Branding ─────────────────────── */}
      <div className="relative hidden overflow-hidden bg-slate-950 p-12 lg:flex lg:w-1/2 lg:flex-col lg:justify-between">
        {/* Glow decorativo */}
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Network className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-white">
            Austranet<span className="text-primary ml-0.5">CCO</span>
          </span>
        </div>

        {/* Hero */}
        <div className="relative z-10 space-y-5">
          <h1 className="text-4xl font-bold leading-tight text-white">
            Gestión de Proyectos<br />
            de Software<br />
            <span className="text-slate-400">Profesional</span>
          </h1>
          <p className="max-w-md text-lg text-slate-300">
            Administra clientes, proveedores y proyectos en un solo lugar.
            Documenta requisitos y controla el alcance con estándar IEEE 830.
          </p>
          <div className="flex gap-10 pt-2">
            <div>
              <p className="text-3xl font-bold text-white">3</p>
              <p className="text-sm text-slate-400">Módulos integrados</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">SRS</p>
              <p className="text-sm text-slate-400">Estándar IEEE 830</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">MoSCoW</p>
              <p className="text-sm text-slate-400">Priorización</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-slate-500">
          © 2026 Austranet. Todos los derechos reservados.
        </p>
      </div>

      {/* ── Panel derecho — Formulario ──────────────────────── */}
      <div className="flex w-full items-center justify-center bg-muted/30 p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Logo móvil */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Network className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">
              Austranet<span className="text-primary ml-0.5">CCO</span>
            </span>
          </div>

          <Card className="border shadow-sm">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold">
                {mode === 'login' ? 'Iniciar sesión' : 'Recuperar contraseña'}
              </CardTitle>
              <CardDescription>
                {mode === 'login'
                  ? 'Ingresa tus credenciales para acceder al sistema'
                  : 'Te enviaremos un enlace para restablecer tu contraseña'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Error */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Confirmación de reset enviado */}
              {resetSent && mode === 'reset' && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
                  Enlace enviado. Revisa tu bandeja de entrada.
                </div>
              )}

              {/* ── Formulario de login ──── */}
              {mode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        disabled={loading}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Contraseña</Label>
                      <button
                        type="button"
                        onClick={() => { setMode('reset'); setError(''); }}
                        className="text-xs text-primary hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        disabled={loading}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword
                          ? <EyeOff className="h-4 w-4" />
                          : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading
                      ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      : <ArrowRight className="mr-2 h-4 w-4" />}
                    Iniciar sesión
                  </Button>
                </form>
              ) : (
                /* ── Formulario de reset ── */
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="reset-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        disabled={loading}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enviar enlace de recuperación
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => { setMode('login'); setResetSent(false); setError(''); }}
                  >
                    Volver al login
                  </Button>
                </form>
              )}

              {/* ── Google login ──────────── */}
              {mode === 'login' && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        O continúa con
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    <Chrome className="mr-2 h-4 w-4" />
                    Google
                  </Button>

                  {/* Link a registro */}
                  <p className="text-center text-sm text-muted-foreground">
                    ¿No tienes cuenta?{' '}
                    <Link
                      href="/registro"
                      className="font-medium text-primary hover:underline"
                    >
                      Regístrate
                    </Link>
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
