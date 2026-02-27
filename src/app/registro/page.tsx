'use client';

// Fuerza renderizado dinámico (evita prerendering sin Firebase credentials)
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getFirebaseAuth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { usuariosService } from '@/services/usuarios.service';
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
  UserPlus,
  Building2,
  Briefcase,
  User,
  CheckCircle2,
} from 'lucide-react';

// ── Esquema de validación ──────────────────────────────────
const registroSchema = z
  .object({
    nombre: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres.')
      .max(80, 'El nombre no puede superar los 80 caracteres.'),
    email: z
      .string()
      .min(1, 'El email es requerido.')
      .email('El email ingresado no es válido.'),
    empresa: z
      .string()
      .max(100, 'La empresa no puede superar los 100 caracteres.')
      .optional()
      .or(z.literal('')),
    cargo: z
      .string()
      .max(80, 'El cargo no puede superar los 80 caracteres.')
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres.')
      .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula.')
      .regex(/[0-9]/, 'Debe contener al menos un número.'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

type RegistroFormValues = z.infer<typeof registroSchema>;

// ── Indicador de fortaleza de contraseña ──────────────────
function getPasswordStrength(password: string): {
  score: number;     // 0-3
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
  if (password.length >= 12 && /[^A-Za-z0-9]/.test(password)) score++;

  if (score === 1) return { score: 1, label: 'Débil', color: 'bg-red-500' };
  if (score === 2) return { score: 2, label: 'Media', color: 'bg-yellow-500' };
  return { score: 3, label: 'Fuerte', color: 'bg-green-500' };
}

// ── Cookie helper ─────────────────────────────────────────
function setSessionCookie() {
  document.cookie = '__session=1; path=/; max-age=3600; SameSite=Lax';
}

// ── Error messages Firebase ───────────────────────────────
function getFirebaseErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'Ya existe una cuenta con este email.',
    'auth/invalid-email': 'El email ingresado no es válido.',
    'auth/weak-password': 'La contraseña es demasiado débil.',
    'auth/network-request-failed': 'Error de red. Verifica tu conexión.',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
  };
  return messages[code] ?? 'Error al crear la cuenta. Intenta nuevamente.';
}

// ── Component ─────────────────────────────────────────────
export default function RegistroPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successName, setSuccessName] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistroFormValues>({
    resolver: zodResolver(registroSchema),
    mode: 'onChange',
  });

  const watchedPassword = watch('password', '');
  const strength = getPasswordStrength(watchedPassword);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const onSubmit = async (values: RegistroFormValues) => {
    setError('');
    setLoading(true);

    try {
      const auth = getFirebaseAuth();

      // 1. Crear usuario en Firebase Auth
      const credential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // 2. Actualizar displayName en el perfil de Auth
      await updateProfile(credential.user, { displayName: values.nombre });

      // 3. Crear documento en Firestore /usuarios/{uid}
      await usuariosService.crearDocumento({
        uid: credential.user.uid,
        nombre: values.nombre,
        email: values.email,
        empresa: values.empresa || undefined,
        cargo: values.cargo || undefined,
        rol: 'tester',
      });

      // 4. Forzar recarga del contexto para que el doc quede disponible
      await refreshUser();

      // 5. Establecer cookie de sesión y redirigir
      setSessionCookie();
      setSuccessName(values.nombre.split(' ')[0]);

      // Pequeña pausa para mostrar el estado de éxito antes del redirect
      await new Promise((r) => setTimeout(r, 800));
      router.push('/dashboard');
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      setError(getFirebaseErrorMessage(firebaseError.code ?? ''));
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
          {/* Badge Beta */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Beta privado — Acceso limitado
          </div>

          <h1 className="text-4xl font-bold leading-tight text-white">
            Únete al<br />
            programa<br />
            <span className="text-primary">beta</span>
          </h1>
          <p className="max-w-md text-lg text-slate-300">
            Sé parte del grupo selecto que está probando Austranet CCO.
            Tu feedback moldea el futuro del producto.
          </p>

          {/* Beneficios */}
          <div className="space-y-3 pt-2">
            {[
              'Acceso completo a todos los módulos',
              'Soporte prioritario durante el beta',
              'Precio especial al lanzamiento oficial',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
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
              <CardTitle className="text-2xl font-bold">Crear cuenta</CardTitle>
              <CardDescription>
                Completa el formulario para acceder al beta de Austranet CCO
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* ── Estado de éxito ── */}
              {successName && (
                <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  ¡Bienvenido, {successName}! Redirigiendo al dashboard…
                </div>
              )}

              {/* ── Error ── */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* ── Formulario ── */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {/* Nombre completo */}
                <div className="space-y-1.5">
                  <Label htmlFor="nombre">Nombre completo <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="nombre"
                      type="text"
                      placeholder="Juan García"
                      className="pl-10"
                      disabled={loading}
                      autoComplete="name"
                      {...register('nombre')}
                    />
                  </div>
                  {errors.nombre && (
                    <p className="text-xs text-destructive">{errors.nombre.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@empresa.com"
                      className="pl-10"
                      disabled={loading}
                      autoComplete="email"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                {/* Empresa y Cargo — fila de 2 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="empresa">Empresa</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="empresa"
                        type="text"
                        placeholder="Acme Corp"
                        className="pl-10"
                        disabled={loading}
                        autoComplete="organization"
                        {...register('empresa')}
                      />
                    </div>
                    {errors.empresa && (
                      <p className="text-xs text-destructive">{errors.empresa.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cargo">Cargo</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="cargo"
                        type="text"
                        placeholder="Gerente TI"
                        className="pl-10"
                        disabled={loading}
                        autoComplete="organization-title"
                        {...register('cargo')}
                      />
                    </div>
                    {errors.cargo && (
                      <p className="text-xs text-destructive">{errors.cargo.message}</p>
                    )}
                  </div>
                </div>

                {/* Contraseña */}
                <div className="space-y-1.5">
                  <Label htmlFor="password">Contraseña <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mín. 8 caracteres"
                      className="pl-10 pr-10"
                      disabled={loading}
                      autoComplete="new-password"
                      {...register('password')}
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
                  {/* Indicador de fortaleza */}
                  {watchedPassword && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                              i <= strength.score ? strength.color : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                      {strength.label && (
                        <p className="text-xs text-muted-foreground">
                          Fortaleza: <span className="font-medium">{strength.label}</span>
                        </p>
                      )}
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirmar contraseña */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirmar contraseña <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repite tu contraseña"
                      className="pl-10 pr-10"
                      disabled={loading}
                      autoComplete="new-password"
                      {...register('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showConfirm
                        ? <EyeOff className="h-4 w-4" />
                        : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Botón submit */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading || !!successName}
                >
                  {loading
                    ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    : <UserPlus className="mr-2 h-4 w-4" />}
                  {loading ? 'Creando cuenta…' : 'Crear cuenta'}
                </Button>
              </form>

              {/* ── Link a login ──── */}
              <p className="text-center text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{' '}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Inicia sesión
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
