import { z } from 'zod';

// Helper para validar RUT chileno
export function validarRut(rut: string): boolean {
    if (!rut || rut.length < 8) return false;

    const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i]) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : String(dvEsperado);

    return dv === dvCalculado;
}

// Formatear RUT
export function formatRut(value: string): string {
    const rutLimpio = value.replace(/[^0-9kK]/g, '');
    if (rutLimpio.length <= 1) return rutLimpio;

    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);

    let cuerpoFormateado = '';
    for (let i = cuerpo.length - 1, j = 0; i >= 0; i--, j++) {
        if (j > 0 && j % 3 === 0) {
            cuerpoFormateado = '.' + cuerpoFormateado;
        }
        cuerpoFormateado = cuerpo[i] + cuerpoFormateado;
    }

    return `${cuerpoFormateado}-${dv.toUpperCase()}`;
}

// Schemas comunes
export const rutSchema = z.string()
    .min(8, 'RUT muy corto')
    .refine(validarRut, 'RUT inválido');

export const emailSchema = z.string()
    .email('Email inválido');

export const phoneSchema = z.string()
    .regex(/^(\+?56)?[9][0-9]{8}$/, 'Formato: +56912345678 o 912345678')
    .optional()
    .or(z.literal(''));

export const fechaSchema = z.date({
    required_error: 'Fecha requerida',
    invalid_type_error: 'Fecha inválida',
});
