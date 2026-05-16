# Bitacora Urreta

Fecha de actualizacion: 2026-05-16

## Regla de este archivo

Este documento guarda detalle fino del modulo `urreta`.

Aca corresponde anotar:

- que se hizo en el frontend
- donde quedo el modulo
- que base funcional ya existe
- que validaciones tecnicas pasaron

## 2026-05-14 - scaffold inicial

Se crea el scaffold inicial de `frontend-urreta`.

Incluye:

- estructura Vite + React + TypeScript
- scripts base de build, lint, typecheck y smoke
- placeholder de home del modulo
- build metadata (`app-build.json`)
- service worker simple
- estilos globales iniciales

## 2026-05-15 - primer bloque funcional

Se suma el primer bloque funcional de producto para `urreta`.

Incluye:

- pestana `Productos`
- listado corto inicial de productos visibles
- buscador por nombre de producto
- boton `Editar` por fila
- modal de edicion para cambiar nombre y precio
- persistencia local de productos editados
- el flujo operativo de pedidos ya toma los productos actualizados
- limpieza visual del shell removiendo la tarjeta de metadata en pantalla
- ajuste de `lint` en `service worker`

## Validacion tecnica de ese corte

- `typecheck`: OK
- `lint`: OK
- `test`: OK
- `test:smoke`: OK
- `build`: OK

## 2026-05-15 - ajuste posterior

Sobre el corte anterior se aplicaron ajustes de interfaz y publicacion:

- `Productos` deja de vivir separado como capa aparte
- ahora queda al mismo nivel de navegacion que:
  - `Cliente`
  - `Pedido`
  - `Registro`
- `frontend-urreta` queda preparado como `PWA`
- se agrega `manifest.webmanifest`
- se mejora el `service worker` para navegacion y cache
- se suman iconos reales de la marca
- `index.html` queda con metadata PWA y accesos de instalacion

## Validacion tecnica del ajuste posterior

- `typecheck`: OK
- `lint`: OK
- `test`: OK
- `test:smoke`: OK
- `build`: OK
- `build:gh`: OK

## 2026-05-15 - ajuste visual y nombre final

Se cierra un ajuste corto de marca y lectura visual:

- el naranja general de la app pasa a un tono mas oscuro
- el cambio aplica a botones, tabs, badges, tarjetas y cartel de actualizacion
- la PWA pasa a instalarse con nombre `M.A.`
- el aviso de nueva version queda mas solido:
  - compara `releaseSha`
  - revalida al volver a foco
  - muestra estado `Actualizando...`
  - fuerza `serviceWorker.update()` al cargar

## Validacion tecnica del ajuste visual

- `typecheck`: OK
- `lint`: OK
- `build`: OK

## Donde quedamos

`urreta` ya tiene una base prolija para crecer, pero todavia no conviene endurecer arquitectura de producto antes de definir mejor el flujo real y el contrato de backend.

## 2026-05-16 - Refactor por capas del feature urreta

Se ordena el modulo para no dejar todo el flujo metido en `UrretaHomePage.tsx`.

Incluye:

- separacion de `types`, `data`, `lib`, `hooks`, `components` y `styles`
- hook propio para estado y persistencia local
- componentes separados por paso: cliente, pedido, registro y productos
- modal de edicion de producto separado
- estilos del modulo movidos a `features/urreta/styles/urreta-home.css`

Objetivo:

- dejar una base mantenible para seguir el producto sin mezclar storage, reglas, UI y estilos en un solo archivo
