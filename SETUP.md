# Austranet CCO — Guía de Configuración
## GitHub + Firebase

---

## PARTE 1 — Repositorio GitHub

### 1.1 Crear el repositorio en github.com

1. Ve a **https://github.com/new**
2. Completa los campos:
   - **Repository name**: `austranet-cco`
   - **Description**: `Sistema de Gestión de Proyectos CCO - Austranet`
   - **Visibility**: Private (recomendado)
   - **NO** marques "Add a README file"
   - **NO** selecciones .gitignore ni licencia
3. Haz clic en **"Create repository"**

### 1.2 Verificar el .gitignore del proyecto

Asegúrate de que el archivo `.gitignore` en la raíz contenga estas líneas
(si no existen, agrégalas antes de hacer el primer commit):

```
.env.local
.env.*.local
```

### 1.3 Conectar el proyecto local con GitHub

Abre una terminal en `C:\Austranet\austranet-cco` y ejecuta:

```bash
git init
git add .
git commit -m "chore: initial project setup"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/austranet-cco.git
git push -u origin main
```

> Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

---

## PARTE 2 — Proyecto Firebase

### 2.1 Crear el proyecto

1. Ve a **https://console.firebase.google.com/**
2. Clic en **"Crear un proyecto"** (o "Add project")
3. Nombre del proyecto: `austranet-cco`
   - El ID de proyecto se generará automáticamente, ej: `austranet-cco-XXXXX`
   - Puedes personalizarlo, pero una vez creado **no puede cambiarse**
4. **Google Analytics**: puedes desactivarlo (no es necesario para este sistema)
5. Clic en **"Crear proyecto"** → espera que termine → **"Continuar"**

---

### 2.2 Registrar la aplicación Web

1. En la pantalla principal del proyecto, haz clic en el ícono **`</>`** (Web)
2. **App nickname**: `austranet-cco-web`
3. **NO** marques "Firebase Hosting" por ahora
4. Clic en **"Registrar app"**
5. **MUY IMPORTANTE**: Se mostrará un bloque `firebaseConfig` con estos valores:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "austranet-cco-XXXXX.firebaseapp.com",
  projectId: "austranet-cco-XXXXX",
  storageBucket: "austranet-cco-XXXXX.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

> **Copia y guarda estos valores — los necesitarás en el Paso 2.6**

6. Clic en **"Continuar a la consola"**

---

### 2.3 Habilitar Authentication

1. En el menú lateral, ve a **Build → Authentication**
2. Clic en **"Comenzar"** (o "Get started")
3. Ve a la pestaña **"Sign-in method"**
4. Habilita **Correo electrónico/contraseña**:
   - Activa el primer toggle (Email/Password)
   - Deja el segundo toggle (passwordless) desactivado
   - Clic **"Guardar"**
5. Habilita **Google**:
   - Clic en Google → activa el toggle
   - **Email de soporte del proyecto**: usa tu email de Google
   - Clic **"Guardar"**

---

### 2.4 Crear Firestore Database

1. En el menú lateral, ve a **Build → Firestore Database**
2. Clic en **"Crear base de datos"**
3. **Modo de inicio**: selecciona **"Comenzar en modo de producción"**
   (usaremos reglas seguras desde el inicio)
4. **Ubicación**: selecciona la más cercana a tus usuarios
   - Para Chile/Latinoamérica: `southamerica-east1 (São Paulo)` o `us-central`
5. Clic en **"Listo"** y espera a que se cree la base de datos

#### 2.4.1 Configurar las reglas de seguridad de Firestore

Una vez creada la base de datos, ve a la pestaña **"Reglas"** y reemplaza
el contenido con lo siguiente:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Función auxiliar: ¿el usuario está autenticado?
    function isAuthenticated() {
      return request.auth != null;
    }

    // Función auxiliar: ¿el usuario tiene rol admin?
    function isAdmin() {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol == 'admin';
    }

    // Función auxiliar: ¿el usuario tiene alguno de estos roles?
    function hasRole(roles) {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol in roles;
    }

    // USUARIOS — solo admins pueden crear/modificar; todos autenticados pueden leer el suyo
    match /usuarios/{userId} {
      allow read: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      allow create: if isAdmin();
      allow update: if isAdmin() || request.auth.uid == userId;
      allow delete: if isAdmin();
    }

    // ENTIDADES — usuarios autenticados con rol gestor o admin
    match /entidades/{entidadId} {
      allow read: if isAuthenticated();
      allow create, update: if hasRole(['admin', 'gestor', 'analista']);
      allow delete: if isAdmin();
    }

    // PROYECTOS — usuarios autenticados
    match /proyectos/{proyectoId} {
      allow read: if isAuthenticated();
      allow create, update: if hasRole(['admin', 'gestor', 'analista']);
      allow delete: if isAdmin();
    }

    // SRS (Alcance) — vinculados a proyectos
    match /srs/{srsId} {
      allow read: if isAuthenticated();
      allow create, update: if hasRole(['admin', 'gestor', 'analista']);
      allow delete: if isAdmin();
    }

    // Bloquear todo lo demás
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Clic en **"Publicar"**.

---

### 2.5 Crear el primer usuario administrador

El sistema autentica usuarios contra Firebase Auth **y** busca su perfil en
Firestore. Debes crear el usuario en ambos lugares.

#### Paso A — Crear usuario en Firebase Authentication

1. Ve a **Build → Authentication → pestaña "Users"**
2. Clic en **"Agregar usuario"**
3. Ingresa:
   - **Email**: tu email de administrador (ej: `admin@austranet.cl`)
   - **Password**: una contraseña segura (mínimo 8 caracteres)
4. Clic en **"Agregar usuario"**
5. **Copia el UID** que aparece en la columna "User UID" (es una cadena como
   `abc123XYZ...` de aprox. 28 caracteres)

#### Paso B — Crear documento de usuario en Firestore

1. Ve a **Build → Firestore Database**
2. Clic en **"+ Iniciar colección"**
3. **ID de colección**: `usuarios`
4. Clic en **"Siguiente"**
5. **ID del documento**: pega el **UID** copiado en el Paso A
6. Agrega los siguientes campos (todos tipo `string` salvo `activo`):

| Campo       | Tipo    | Valor                        |
|-------------|---------|------------------------------|
| `nombre`    | string  | Tu nombre completo           |
| `email`     | string  | tu-email@dominio.com         |
| `rol`       | string  | `admin`                      |
| `activo`    | boolean | `true`                       |

7. Clic en **"Guardar"**

---

### 2.6 Configurar variables de entorno en el proyecto

1. En el directorio `C:\Austranet\austranet-cco`, crea el archivo **`.env.local`**
   (copia de `.env.example`) con los valores del Paso 2.2:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=austranet-cco-XXXXX.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=austranet-cco-XXXXX
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=austranet-cco-XXXXX.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123...
```

2. **Nunca** subas `.env.local` a GitHub (ya está en `.gitignore`).

---

### 2.7 Verificar que todo funciona

```bash
npm run dev
```

Navega a `http://localhost:3000`. Deberías poder:
- Ver la pantalla de login
- Ingresar con el email y contraseña del administrador creado
- Acceder al dashboard del sistema

---

## PARTE 3 — Lo que debes entregarme para la integración

Una vez completados los pasos anteriores, proporciónameesta información:

### 3.1 Datos de Firebase

```
Project ID    : austranet-cco-XXXXX
Auth Domain   : austranet-cco-XXXXX.firebaseapp.com
API Key       : AIzaSy...
App ID        : 1:XXXXXXXXXX:web:XXXXXX
Messaging ID  : XXXXXXXXXX
Storage Bucket: austranet-cco-XXXXX.appspot.com
```

> ⚠️ Solo comparte esto en un canal privado/seguro, nunca en el chat público.
> Estas claves son para el frontend (NEXT_PUBLIC_*), pero igual deben protegerse.

### 3.2 URL del repositorio GitHub

```
https://github.com/TU_USUARIO/austranet-cco
```

### 3.3 Confirmaciones de configuración

Confírmame que:
- [ ] Firebase Authentication está activo con Email/Password (y Google opcional)
- [ ] Firestore está creado en modo producción con las reglas del Paso 2.4.1
- [ ] El primer usuario administrador existe en Auth Y en la colección `usuarios`
- [ ] `.env.local` está creado localmente y `npm run dev` levanta sin errores
- [ ] El repositorio está en GitHub y el primer push fue exitoso

---

## PARTE 4 — Próximos pasos (post-integración)

Una vez que me entregues los datos, yo me encargaré de:

1. **Verificar** la conexión Firebase en el proyecto
2. **Activar** el middleware de autenticación (actualmente comentado)
3. **Implementar** el servicio de creación/lectura de entidades en Firestore
4. **Crear** el seed script para datos de prueba iniciales
5. **Configurar** GitHub Actions para CI/CD automático

---

*Guía generada para Austranet CCO v0.1.0*
