Authorization Modes & Testing Guide

Overview

This document explains the three authorization modes used across the app and provides commands and steps to test them locally.

Authorization Modes

1) Guest / Optional (optionalAuth)
- Purpose: Allow public (non-authenticated) access to read-only public resources while still letting the server attach user info if a valid JWT is provided.
- Behavior: If request has a valid `Authorization: Bearer <token>` header, `req.user` is populated. If token is missing or invalid, request proceeds as a guest (no 401). Use-case: product listings, product details, search results, public collections.

2) Authenticated / Protected (protect)
- Purpose: Require an authenticated user for operations that change user-specific data or perform protected operations.
- Behavior: If no JWT or invalid token, responds with 401. `req.user` is available when successful.
- Use-case: Add to Cart, Checkout/purchase logging, modifying user data, creating orders.

3) Admin-only (adminOnly)
- Purpose: Restrict access to administrative operations.
- Behavior: Requires `protect` first (authenticated), then validates `req.user.role === 'admin'`. If not admin, responds with 403.
- Use-case: Product add/update/delete, viewing aggregate histories, admin dashboards.

Quick Local Testing

Prerequisites
- Backend running (`cd backend` then `npm run dev`).
- Frontend running (`cd frontend` then `npm start`).
- MongoDB connection configured in `.env` (MONGO_URI) and JWT secret set (JWT_SECRET).

1) Guest access (optionalAuth)
- Test: GET product listing without token

curl example (PowerShell - single quotes must be escaped differently; use double quotes for JSON headers where needed):

```powershell
# public GET - should succeed without token
curl http://localhost:5000/api/products
```

- Test: GET single product without token
```powershell
curl http://localhost:5000/api/products/<productId>
```

If you supply a token, the server will attach `req.user` and handlers can use it.

2) Protected route (protect)
- Test: Add to cart needs auth

```powershell
# Replace <token> and <productId>
curl -X POST http://localhost:5000/api/cart/add -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d "{ \"productId\": \"<productId>\", \"quantity\": 1 }"
```

- Without token you should get 401:
```powershell
curl -X POST http://localhost:5000/api/cart/add -H "Content-Type: application/json" -d "{ \"productId\": \"<productId>\", \"quantity\": 1 }"
```

3) Admin-only (adminOnly)
- Test: Access product history (admin only)

```powershell
curl -H "Authorization: Bearer <admin_token>" http://localhost:5000/api/history/products
```

- With a non-admin token you should get 403.

Frontend Testing Steps

1. Guest flows
- Open the frontend in a browser without logging in.
- Visit `/shop` and confirm product listing loads.
- Click "Add to cart" as guest — you should see the login prompt modal (or redirect, depending on page).

2. Authenticated flows
- Register/login to get a token stored in `localStorage` as `token` (the app does this already).
- Click Add to cart; it should add via API.
- Visit `/checkout` after login — checkout page works and place order creates a purchase log.

3. Admin flows
- Log in as an admin account (role set to `admin` in user document).
- Visit admin pages and access product & user history endpoints.

Notes
- The front-end uses the `AuthPromptModal` to prompt guests to login when they attempt actions that require authentication (add-to-cart, wishlist additions). Checkout still requires login and will redirect if token is missing.
- If you want server-side wishlist persistence, I can add a `Wishlist` model and routes protected by `protect` for create/delete operations and `optionalAuth` for reading a wishlist (so guests see an empty wishlist or a prompt).

Next steps (optional)
- Implement server-side wishlist (model, routes, frontend wiring)
- Add automated tests (supertest + Jest) for the backend endpoints

