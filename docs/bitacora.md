# Bitacora Urreta

## 2026-05-14

Se crea el scaffold inicial de `frontend-urreta`.

Incluye:

- estructura Vite + React + TypeScript
- scripts base de build, lint, typecheck y smoke
- placeholder de home del modulo
- build metadata (`app-build.json`)
- service worker simple
- estilos globales iniciales

## 2026-05-15

Se suma el primer bloque funcional de producto para `Urreta`.

Incluye:

- nueva pestana `Productos`
- listado corto inicial de productos visibles
- buscador por nombre de producto
- boton `Editar` por fila
- modal de edicion para cambiar:
  - nombre
  - precio
- persistencia local de productos editados
- el flujo operativo de pedidos ya toma los productos actualizados
- limpieza visual del shell removiendo la tarjeta de metadata en pantalla
- ajuste de `lint` en `service worker`

## PF

- `typecheck`: OK
- `lint`: OK
- `test`: OK
- `test:smoke`: OK
- `build`: OK
