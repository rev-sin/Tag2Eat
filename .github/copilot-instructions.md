# Copilot Instructions for Tag2Eat

## Project Overview
Tag2Eat is a Next.js application for online food ordering, bootstrapped with `create-next-app`. The codebase uses the Next.js App Router and TypeScript. Key features include cart management, menu display, order creation, and Razorpay payment integration.

## Architecture & Key Components
- **App Structure**: Main logic is under `src/app/`.
  - `layout.tsx` and `globals.css` define global styles and layout.
  - `page.tsx` is the main landing page.
  - `api/` contains serverless functions for order creation and payment (`create-order/route.ts`, `razorpay/order/route.ts`).
  - `components/` holds UI components: `Cart.tsx`, `CartTable.tsx`, `CheckoutButton.tsx`, `MenuTable.tsx`.
  - `onboard/` and `review-cart/` are feature-specific pages.
- **State Management**: Cart state is managed via Jotai atoms in `lib/cartAtoms.ts` and custom hooks in `lib/useCartStore.ts`.
- **External Services**: Supabase client in `lib/supabaseClient.ts` for backend data; Razorpay integration for payments.
- **Types**: Shared types for cart and menu in `types/`.

## Developer Workflows
- **Start Dev Server**: Use `pnpm dev` (preferred), or `npm/yarn/bun dev`.
- **Edit Main Page**: Modify `src/app/page.tsx`.
- **API Routes**: Update logic in `src/app/api/` for backend endpoints.
- **Styling**: Use global styles in `globals.css` and component-level CSS modules if added.

## Patterns & Conventions
- **TypeScript**: All source files use TypeScript. Prefer explicit types for props and state.
- **App Router**: Use file-based routing under `src/app/`.
- **State**: Use Jotai for cart state; avoid React Context for cart.
- **API Integration**: Use Supabase for data, Razorpay for payments. API keys/configs should be managed via environment variables (see `example.env`).
- **Component Structure**: Keep UI logic in `components/`, business logic in `lib/`.

## Integration Points
- **Supabase**: See `lib/supabaseClient.ts` for setup and usage.
- **Razorpay**: Payment flow handled in `api/razorpay/order/route.ts`.
- **Cart**: Atoms and hooks in `lib/cartAtoms.ts` and `lib/useCartStore.ts`.

## Examples
- To add a new API route: create a folder under `src/app/api/` and add a `route.ts` file.
- To add a new page: create a folder under `src/app/` and add a `page.tsx` file.
- To update cart logic: modify atoms/hooks in `lib/cartAtoms.ts` or `lib/useCartStore.ts`.

## References

## Database Schema Reference

Tag2Eat uses a PostgreSQL schema with the following tables:

- **users**: Stores user info (id, clerk_id, rf_id, full_name, email, phone)
- **carts**: One cart per user, references users
- **cart_items**: Items in a cart, references carts and menu
- **menu**: Menu items (id, name, price, available)
- **orders**: Orders placed by users, references users
- **order_items**: Items in an order, references orders and menu
- **order_status**: Tracks status of each order

### Example Table Definitions

```sql
CREATE TABLE public.users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  clerk_id text NOT NULL UNIQUE,
  rf_id text UNIQUE,
  full_name text,
  email text UNIQUE,
  phone text UNIQUE
);

CREATE TABLE public.menu (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  available boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);
```

Refer to this section for backend, API, and integration tasks involving database access.

----
If any section is unclear or missing, please provide feedback for further refinement.