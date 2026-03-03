# cotizacionesUPC

Proyecto web de **Sistema de Cotizaciones** hecho con React + TypeScript + Vite.

## 1) Requisitos

- Node.js 20+
- npm 10+

## 2) Estructura mínima para que funcione

En la raíz deben existir, como mínimo:

- `package.json`
- `index.html`
- `src/`
- (opcional) `public/`

> Si solo tienes `src.zip` y `public.zip`, asegúrate de extraerlos dentro de la **misma carpeta raíz del proyecto**.

## 3) ¿Dónde ejecutar `npm install`?

En la **carpeta raíz del proyecto**, es decir, donde está el archivo `package.json`.

Ejemplo en terminal:

```bash
cd ruta/a/cotizacionesUPC
npm install
npm run dev
```

## 4) Cómo abrir la app

Después de `npm run dev`, Vite mostrará un link local como:

- `http://localhost:5173`

Abre ese link en tu navegador.

## 5) Si falla la instalación

- Verifica que tienes internet y permisos a `https://registry.npmjs.org`
- Revisa proxy corporativo / firewall
- Ejecuta:

```bash
npm config get registry
```

Debe devolver:

```text
https://registry.npmjs.org/
```
