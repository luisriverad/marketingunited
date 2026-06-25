# Marketing United · Suite de Inteligencia de Negocio

Plataforma de inteligencia de negocio para **Marketing United**, construida con **Vite + React + TypeScript**. Una sola aplicación con **tres módulos grandes e independientes**, cada uno con sus propias pestañas internas.

> **Powered by AXON B2B** · Light mode · Marca Marketing United (negro tinta `#0B0B0C` + lima eléctrico `#D3FF00`).

## Los tres módulos

| # | Módulo | Tema | Pestañas internas |
|---|--------|------|-------------------|
| 01 | **Presupuesto 2026** | Diagnóstico del presente | Resumen, Estado de resultados, Profit First, Unit Economics, Business Drivers, Modelo comercial, Modelo operativo Kaizen, Capacidad HH |
| 02 | **Rumbo al 2030** | Plan estratégico a futuro | Rumbo, Portafolio, Financiero, Comercial, Operativo, Talento, Tecnología · IA |
| 03 | **Empresa Antifrágil** | Blindaje de riesgo (Taleb) | Las 9 prácticas + Sistema Antifrágil 2030 |

Cada módulo conserva su estado y reactividad al cambiar entre ellos. Las celdas de captura (verde claro + letra azul) son editables y recalculan el modelo en vivo.

## Arranque

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción -> dist/
npm run preview  # previsualizar el build
```

## Arquitectura

```
src/
  main.tsx                 punto de entrada React
  App.tsx                  shell: barra de módulos + 3 hosts
  styles/theme.css         sistema de diseño AXON (tokens, layout, componentes)
  components/
    ModuleBar.tsx          barra superior con los 3 módulos grandes
    ModuleHost.tsx         frontera React que monta cada controlador de módulo
  modules/
    budget2026.ts          MÓDULO 01 — controlador autónomo (estado + cálculo + render)
    roadmap2030.ts         MÓDULO 02 — controlador autónomo
    antifragile.ts         MÓDULO 03 — controlador autónomo
```

**Patrón.** El shell (`App.tsx`) es React puro: renderiza la barra de módulos y monta los tres controladores vía `ModuleHost`. Cada módulo (`src/modules/*.ts`) es un controlador autónomo que inyecta su propio layout y corre su motor reactivo (estado mutable, funciones de cálculo y render por vista), con todo el manejo de eventos delegado a su nodo raíz. Esto mantiene cada módulo **100% independiente** y permite refactorizarlos uno por uno a componentes JSX dentro de Cursor sin afectar a los demás.

### Cómo extender en Cursor

- **Editar contenido o cálculos de un módulo:** abre su archivo en `src/modules/`. El estado por defecto vive en `DEFAULTS`, los cálculos en las funciones `c*()`, y cada vista en una función `v*()`.
- **Agregar una pestaña:** añade el `<a data-v="...">` al sidebar (en `BODY`), una entrada en `META` (título/subtítulo) y en `RENDER` (función de vista).
- **Migrar una vista a JSX:** reemplaza la función `v*()` por un componente React y renderízalo dentro del host del módulo; el resto del módulo sigue funcionando igual.

## Convenciones de marca

- Footer siempre: **Powered by AXON B2B**.
- Light mode en todo el tablero.
- Cifras financieras en MDP (millones de pesos); convenciones de EE. UU. (trillion/billion) sin convertir.
- Celdas de captura editables: fondo verde claro `#EEFFDB` + texto azul `#0070C0`.
