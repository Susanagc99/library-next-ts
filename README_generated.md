# Library Next (library-next-ts)

A small Next.js + TypeScript example project for a library/dashboard web app. This repository contains a simple frontend using Next.js (pages), Tailwind-like utilities (via Tailwind CSS config), HeroUI components, and a lightweight mock backend using API routes and Mongoose models for data persistence.

---

## What this web app does

- Provides a landing page and a dashboard (`/dashboard`) for managing or viewing library-related data.
- Includes API routes under `src/pages/api` for authors and books to serve JSON and simulate backend endpoints.
- Uses Mongoose models (in `src/database/models`) and a small DB helper in `src/lib/db.ts` for connecting to MongoDB when required.
- Demonstrates usage of HeroUI component provider and global CSS via `src/styles/globals.css`.

## Main features

- Next.js pages-based routing
- TypeScript throughout the codebase
- Global styles and Tailwind-like utilities (configured in `globals.css`)
- API routes for authors and books (example data storage via Mongoose)
- Small dashboard UI for demonstration

## Technologies & tools

- Next.js 15 (Turbopack)
- React 19
- TypeScript
- Tailwind / PostCSS (configured in project)
- Mongoose (for MongoDB models)
- HeroUI (`@heroui/react`) for UI components
- ESLint for linting

## Project structure (important files)

- `src/pages` - Next.js pages and API routes
- `src/styles/globals.css` - Global styles and Tailwind config entries
- `src/lib` - DB helper and id generator
- `src/database/models` - Mongoose models for `authors` and `books`
- `src/services` - small service helpers used by the app

## Requirements

- Node.js (recommended v18+)
- npm (or pnpm/yarn)
- (Optional) MongoDB instance if you want to persist data using Mongoose

## Setup and run (Windows PowerShell)

Install dependencies:

```powershell
npm install
```

Run development server (with Turbopack):

```powershell
npm run dev
```

Build for production:

```powershell
npm run build
```

Start the production server:

```powershell
npm start
```

Lint the project:

```powershell
npm run lint
```

## Environment variables

If you want to connect to a MongoDB database, create a `.env.local` file at the project root with:

```
MONGODB_URI="your-mongodb-connection-string"
```

The project includes `src/lib/db.ts` and Mongoose models that will read from `process.env.MONGODB_URI` if present.


---

# Versión en Español

# Library Next (library-next-ts)

Proyecto de ejemplo con Next.js y TypeScript para una pequeña aplicación web tipo biblioteca/tablero. Este repositorio contiene un frontend sencillo usando Next.js (páginas), utilidades tipo Tailwind (configuradas vía PostCSS/Tailwind), componentes de HeroUI y un backend ligero con rutas API y modelos Mongoose para persistencia.

---

## Qué hace esta web

- Presenta una página de inicio y un dashboard (`/dashboard`) para gestionar o visualizar datos relacionados con una librería.
- Incluye rutas API en `src/pages/api` para autores y libros que sirven JSON y simulan endpoints de backend.
- Usa modelos de Mongoose (en `src/database/models`) y un helper de BD en `src/lib/db.ts` para conectar con MongoDB si se requiere.
- Demuestra el uso de HeroUI con `HeroUIProvider` y estilos globales en `src/styles/globals.css`.

## Funcionalidades principales

- Ruteo basado en páginas de Next.js
- Código en TypeScript
- Estilos globales y utilidades tipo Tailwind
- Rutas API para `authors` y `books` (ejemplo con Mongoose)
- UI de dashboard de ejemplo

## Tecnologías y herramientas

- Next.js 15 (Turbopack)
- React 19
- TypeScript
- Tailwind / PostCSS
- Mongoose (para MongoDB)
- HeroUI (`@heroui/react`)
- ESLint

## Estructura del proyecto (archivos importantes)

- `src/pages` - Páginas y rutas API de Next.js
- `src/styles/globals.css` - Estilos globales y configuración de utilidades
- `src/lib` - Helper de base de datos y generador de IDs
- `src/database/models` - Modelos Mongoose para `authors` y `books`
- `src/services` - Servicios usados por la app

## Requisitos

- Node.js (recomendado v18+)
- npm (o pnpm/yarn)
- (Opcional) Instancia de MongoDB si quieres persistencia con Mongoose

## Instalación y ejecución (Windows PowerShell)

Instalar dependencias:

```powershell
npm install
```

Ejecutar en desarrollo (Turbopack):

```powershell
npm run dev
```

Construir para producción:

```powershell
npm run build
```

Iniciar servidor de producción:

```powershell
npm start
```

Ejecutar linter:

```powershell
npm run lint
```

## Variables de entorno

Si quieres conectar a una base de datos MongoDB, crea un archivo `.env.local` en la raíz del proyecto con:

```
MONGODB_URI="tu-cadena-de-conexión-mongodb"
```

Los helpers en `src/lib/db.ts` y los modelos leerán `process.env.MONGODB_URI` si está presente.