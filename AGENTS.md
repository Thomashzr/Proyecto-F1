# AGENTS.md — Contexto del proyecto

> Reglas para agentes IA (Antigravity CLI, Codex, Claude). Mantener corto y actualizado.
> Si una regla ya no aplica, borrarla — no acumular.

## Stack
- Lenguaje: TypeScript 5.x
- Framework: Vite + React 18
- Package manager: pnpm
- Node/Runtime version: 22.x

## Comandos (usar SIEMPRE estos, no inventar variantes)
- Instalar deps: `pnpm install`
- Dev server: `pnpm dev`
- Tests: `pnpm test`
- Test de un solo archivo: `pnpm test <path>`
- Lint: `pnpm lint`
- Build: `pnpm build`
- Type check: `pnpm typecheck`

## Convenciones de código
- Estilo: <ej. functional components, sin clases>
- Naming: <ej. camelCase para vars, PascalCase para componentes>
- Imports: <ej. paths absolutos desde src/, no relativos largos>
- No usar: <ej. any en TS, default exports>

## Estructura relevante (no listar todo, solo lo no obvio)
- `src/core/` — lógica de negocio, NO tocar sin pedir confirmación explícita
- `src/generated/` — auto-generado, nunca editar a mano
- `.env.example` — referencia de variables de entorno necesarias

## Guardrails / Safety (crítico con auto-continue activado)
- NUNCA hacer `git push --force` sin confirmación explícita del usuario
- NUNCA borrar archivos fuera del directorio de trabajo actual
- NUNCA modificar `src/generated/` ni archivos de configuración de CI/CD
- Antes de instalar una dependencia nueva, preguntar
- Si un test falla, reportar y detenerse — no "arreglar" ocultando o skippeando el test

## Cuando falta contexto
- Si no hay información suficiente para decidir, preguntar en vez de asumir
- No inventar nombres de archivos, funciones o endpoints — verificar que existan antes de referenciarlos

## Definición de "terminado"
- Build pasa sin errores
- Tests pasan
- Lint sin warnings nuevos
