# Urreta - Estado actual del frontend

Fecha de actualizacion: 2026-05-16

## Estado general

`frontend-urreta` hoy se mantiene como base inicial de producto con primeros bloques visibles ya armados.

## Base actual disponible

El modulo ya tiene:

- scaffold Vite + React + TypeScript
- build metadata
- service worker simple
- aviso de actualizacion
- base visual lista para crecer
- `PWA` configurada

## Flujo visible actual

Sobre la base inicial ya quedaron visibles bloques funcionales de producto:

- `Cliente`
- `Pedido`
- `Registro`
- `Productos`

## Estado funcional del corte

Hoy ya existe:

- listado corto inicial de productos visibles
- buscador por nombre de producto
- boton `Editar` por fila
- modal de edicion para cambiar nombre y precio
- persistencia local de productos editados
- flujo operativo de pedidos tomando productos actualizados

## Estado tecnico actual

Hoy el modulo:

- sigue con persistencia local
- no tiene contrato formal de backend definido
- sirve para ordenar la base visual y el flujo inicial del producto

## Marca y experiencia actual

Tambien quedaron bajados ajustes de marca y publicacion:

- tono naranja mas oscuro en la identidad visual
- nombre final de PWA como `M.A.`
- aviso de nueva version mas solido
- metadata e iconos de instalacion ya preparados

## Siguiente paso recomendado

No sumar complejidad estructural grande sin antes confirmar:

1. objetivo exacto del producto
2. flujo principal real
3. entidades que van a vivir en backend
4. si conviene seguir con demo local o pasar a contrato real
