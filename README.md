# Bienestar y Convivencia — Backend API

API REST con **Node.js 20**, **Express**, **MongoDB Atlas (Mongoose)**, **JWT (roles)** y validaciones con **express-validator**.

## Requisitos
- Node.js 20+
- MongoDB Atlas (o MongoDB local)
- Variables de entorno (ver `.env.example`)

## Instalación
```bash
npm install
cp .env.example .env
# edita MONGO_URI y JWT_SECRET en .env
npm run dev
```

Servidor dev: `http://localhost:4000`

## Scripts
- `npm run dev` — nodemon
- `npm start` — producción
- `npm test` — Jest (pruebas básicas)

## Rutas base
Todas bajo `/api`.
- Auth: `/auth/register`, `/auth/login`, `/auth/me`
- Users: `/users`, `/users/:id`
- Events: `/events` (GET con filtros `category`, `dateFrom`, `location`, `page`, `limit`, `sort`), CRUD admin, `/:id/register`, `/:id/unregister`
- Routes (movilidad): `/routes` CRUD básico, `/:id/join`, `/:id/leave`
- Resources: `/resources` (solo `visible=true`), CRUD admin

## Criterios de aceptación (checklist)
- [x] Arranca en `http://localhost:4000` (`npm run dev`)
- [x] Filtros Events y Users operativos
- [x] Register/Unregister en Events
- [x] Join/Leave en Routes
- [x] Resources solo visibles en listado
- [x] Rutas admin requieren rol `admin`
- [x] Errores 401/403/404/409 con formato estándar
- [x] README + OpenAPI básico

## OpenAPI
Archivo `openapi.json` incluido (básico).
