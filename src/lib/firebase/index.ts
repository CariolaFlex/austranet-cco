// ============================================================
// Austranet CCO - Firebase Exports
// ============================================================
// NOTA: auth y db NO se pre-inicializan aquí para evitar errores
// durante SSR (Next.js prerendering). Usar getFirebaseAuth() y
// getFirestoreDb() directamente desde componentes cliente.

export * from './config';
export * from './auth';
export * from './firestore';
