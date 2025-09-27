# Copilot Instructions for Tag2Eat

## Project Overview
- **Framework:** Next.js (App Router)
- **Package Manager:** pnpm (also supports npm, yarn, bun)
- **Main Directories:**
  - `src/app/`: Application pages, API routes, global styles
  - `src/components/`: React components for UI
  - `src/lib/`: State management and custom hooks
  - `src/types/`: TypeScript type definitions
  - `public/`: Static assets

## Architecture & Patterns
- **App Router:** Pages and API routes are organized under `src/app/` using Next.js conventions.
- **State Management:** Uses Jotai (`cartAtoms.ts`) and custom hooks (`useCartStore.ts`) for cart state.
- **Type Safety:** All data models (cart, menu) are defined in `src/types/` and should be imported for type safety.
- **Component Structure:** UI logic is separated into table and button components (`CartTable.tsx`, `MenuTable.tsx`, `CheckoutButton.tsx`).
- **API Integration:** API routes (e.g., `create-order`, `razorpay/order`) are under `src/app/api/` and follow Next.js route handler patterns.

## Developer Workflow
- **Start Dev Server:**
  ```zsh
  pnpm dev
  # or npm/yarn/bun dev
  ```
- **Edit Pages:** Modify files in `src/app/` (e.g., `page.tsx`).
- **Hot Reload:** Changes auto-update in browser.
- **Environment Variables:** Example config in `example.env`.
- **Type Checking:**
  ```zsh
  pnpm typecheck
  ```
- **Linting:**
  ```zsh
  pnpm lint
  ```

## Conventions & Tips
- **Use TypeScript types from `src/types/` for all data models.**
- **State logic for cart is centralized in `src/lib/cartAtoms.ts` and `src/lib/useCartStore.ts`.**
- **API routes should use Next.js route handler signatures.**
- **Global styles are in `src/app/globals.css`.**
- **Font optimization uses Next.js built-in font loader.**
- **No custom test or build scripts detected; use Next.js defaults.**

## Integration Points
- **Razorpay:** Payment integration via API route (`src/app/api/razorpay/order/route.ts`).
- **Vercel:** Deployment recommended; see README for details.

## Examples
- **Cart State Usage:**
  ```tsx
  import { useCartStore } from "@/lib/useCartStore";
  const { cart, addItem } = useCartStore();
  ```
- **Type Usage:**
  ```ts
  import type { Cart } from "@/types/cart";
  ```
- **API Route Handler:**
  ```ts
  export async function POST(req: Request) { /* ... */ }
  ```

---

If any conventions or workflows are unclear, please ask for clarification or examples from the codebase.