# Shoppers — Pre-Production Audit & Implementation Plan

> **Date:** June 2025  
> **Scope:** Full-stack audit of backend (Spring Boot 4.0.3) + frontend (React 19 + Vite 7.3.1)  
> **Goal:** Production-readiness checklist — fixes, improvements, missing features  

---

## Table of Contents

1. [CRITICAL — Security Fixes](#1-critical--security-fixes)
2. [HIGH — Production Configuration](#2-high--production-configuration)
3. [HIGH — Bug Fixes](#3-high--bug-fixes)
4. [MEDIUM — Performance Improvements](#4-medium--performance-improvements)
5. [MEDIUM — Data Integrity & Reliability](#5-medium--data-integrity--reliability)
6. [LOW — Code Quality & Cleanup](#6-low--code-quality--cleanup)
7. [MISSING FEATURES — E-commerce Essentials](#7-missing-features--e-commerce-essentials)
8. [NICE-TO-HAVE — Enhancements](#8-nice-to-have--enhancements)
9. [File-by-File Findings Index](#9-file-by-file-findings-index)

---

## 1. CRITICAL — Security Fixes

### 1.1 Hardcoded Secrets in `application.properties`
**File:** `src/main/resources/application.properties`  
**Issue:** All secrets (Supabase DB password, Cloudinary API key/secret, Razorpay key/secret, JWT signing secret) are committed in plain text.  
**Fix:**  
- Move ALL secrets to environment variables.  
- Use `${ENV_VAR_NAME}` placeholders in `application.properties`:
  ```properties
  spring.datasource.password=${DB_PASSWORD}
  cloudinary.api_secret=${CLOUDINARY_SECRET}
  razorpay.key_secret=${RAZORPAY_SECRET}
  jwt.secret=${JWT_SECRET}
  ```
- Provide a `.env.example` file documenting required variables.  
- Add `application.properties` to `.gitignore` or use Spring profiles (`application-prod.properties`).

### 1.2 Weak / Default JWT Secret
**File:** `src/main/java/org/example/ecomproj/security/JwtUtil.java`  
**Issue:** Default fallback secret is `shoppers-dev-secret-key-minimum-256-bits-long-for-hs256`. If the env var is unset, this weak key is used in production.  
**Fix:**  
- Remove the default fallback. Fail fast on startup if `jwt.secret` is not configured.  
- Generate a cryptographically random 256-bit+ secret for production.

### 1.3 Seeded User Passwords in Source Code
**File:** `src/main/java/org/example/ecomproj/config/DataInitializer.java`  
**Issue:** Admin password (`admin123`) and demo password (`demo123`) are hardcoded. These accounts auto-create on first run.  
**Fix:**  
- Read seed passwords from environment variables or remove auto-seeding in production profile.  
- At minimum, force password change on first login or disable DataInitializer in prod.

### 1.4 Demo Credentials Shown in Frontend
**Files:** `shoppers-frontend/src/components/auth/LoginModal.jsx`, `RegisterModal.jsx`  
**Issue:** Placeholder text shows demo credentials (`admin@shoppers.com / admin123`).  
**Fix:** Remove placeholder hints for demo accounts. These are fine for dev but must not ship to production.

### 1.5 `spring-boot-devtools` in Production Build
**File:** `pom.xml`  
**Issue:** `spring-boot-devtools` dependency is included. It enables hot-reload, exposes debug endpoints, and degrades security/performance.  
**Fix:** Remove the dependency entirely, or configure it with `<scope>runtime</scope>` and `<optional>true</optional>` (Spring Boot auto-disables it in packaged JARs, but explicit removal is safer).

### 1.6 Razorpay Test Keys Committed  
**File:** `src/main/resources/application.properties`  
**Issue:** Razorpay test key ID (`rzp_test_...`) and secret are in source code. For production, live keys must be used and must NOT be in the repo.  
**Fix:** Move to environment variables. Use test keys only in dev profile.

---

## 2. HIGH — Production Configuration

### 2.1 `spring.jpa.hibernate.ddl-auto=update`
**File:** `src/main/resources/application.properties`  
**Issue:** `update` mode auto-alters database schema on startup. In production, this can cause data loss or unexpected migrations.  
**Fix:** Change to `validate` (or `none`) for production. Use Flyway or Liquibase for controlled schema migrations.

### 2.2 CORS Configuration — Limited Origins
**File:** `src/main/java/org/example/ecomproj/config/SecurityConfig.java`  
**Issue:** CORS allows `localhost:5173`, `localhost:4173`, and `*.vercel.app`. Production domain is not included.  
**Fix:**  
- Add your actual production domain (e.g., `https://shoppers.yourdomain.com`).  
- Ideally, read allowed origins from environment variables:
  ```java
  @Value("${cors.allowed-origins}")
  private String[] allowedOrigins;
  ```

### 2.3 Frontend API Base URL Uses Vite Proxy
**File:** `shoppers-frontend/src/api/axiosInstance.js`  
**Issue:** `baseURL: '/api'` depends on Vite's dev proxy (`vite.config.js` proxies `/api` to `localhost:8080`). In production (static build), there's no proxy — API calls will fail.  
**Fix:**  
- Use an environment variable: `baseURL: import.meta.env.VITE_API_URL || '/api'`  
- Set `VITE_API_URL` in production `.env` (e.g., `https://api.shoppers.yourdomain.com/api`).

### 2.4 `.env` File Has Stale Stripe Key
**File:** `shoppers-frontend/.env`  
**Issue:** Contains `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_PLACEHOLDER` — project uses Razorpay, not Stripe.  
**Fix:** Remove the Stripe entry. Add `VITE_API_URL` and `VITE_RAZORPAY_KEY_ID` instead.

### 2.5 Razorpay SDK Loaded from CDN Without SRI
**File:** `shoppers-frontend/index.html`  
**Issue:** `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>` has no `integrity` or `crossorigin` attribute.  
**Fix:** Add Subresource Integrity (SRI) hash if Razorpay provides one, or at minimum add `crossorigin="anonymous"`.

### 2.6 About page tech stack info is outdated
**File:** `shoppers-frontend/src/pages/About.jsx`  
**Issue:** Lists "H2 Database" and "Spring Boot 3". Project actually uses Supabase PostgreSQL and Spring Boot 4.0.3.  
**Fix:** Update tech stack descriptions to match actual stack.

---

## 3. HIGH — Bug Fixes

### 3.1 Unused Variable in AuthController
**File:** `src/main/java/org/example/ecomproj/controller/AuthController.java` (line ~52)  
**Issue:** `Long userId = ...` is assigned but never used. Compiler warning.  
**Fix:** Remove the unused variable or use it if intended.

### 3.2 Unsafe Type Casting in PaymentController
**File:** `src/main/java/org/example/ecomproj/controller/PaymentController.java`  
**Issue:** `Long.valueOf(request.get("orderId").toString())` — if `orderId` is null or non-numeric, throws NPE or NumberFormatException with no meaningful error message.  
**Fix:**  
- Validate the request body. Use a DTO with `@NotNull Long orderId` instead of raw `Map<String, Object>`.  
- Add try-catch with proper 400 Bad Request response.

### 3.3 Payment Verify Endpoint — orderId Mismatch 
**File:** `src/main/java/org/example/ecomproj/controller/PaymentController.java`  
**Issue:** Checkout.jsx sends `order_id` as `String(order.id)` but the verify endpoint does `Long.valueOf(request.get("order_id").toString())`. Works but fragile — no type-safe DTO.  
**Fix:** Create a `PaymentVerifyRequest` DTO with proper types and validation.

### 3.4 `markHelpful` Has No Authentication or Rate-Limiting
**File:** `src/main/java/org/example/ecomproj/controller/ReviewController.java`  
**Issue:** `PUT /api/reviews/{id}/helpful` increments the helpful count with no auth check. Any anonymous user (or bot) can spam this endpoint repeatedly.  
**Fix:**  
- Require authentication (already should be enforced by SecurityConfig, but endpoint matches `/api/**`).  
- Track which users have marked helpful (many-to-many relation) to prevent duplicate votes.

### 3.5 `updateProduct` May Not Preserve All Image URLs
**File:** `src/main/java/org/example/ecomproj/service/ProductService.java`  
**Issue:** When updating a product, the method receives a new `Product` object via `@RequestPart`. If the frontend doesn't send `imageUrl2`–`imageUrl5`, they get overwritten to `null`.  
**Fix:** In `updateProduct`, merge incoming fields with existing product. Only overwrite image URLs if the incoming value is non-null.

### 3.6 ProductDetail fetches ALL products for "Related" section
**File:** `shoppers-frontend/src/pages/ProductDetail.jsx`  
**Issue:** `Promise.all([getProductById(id), getAllProducts()])` — loads the entire product catalog on every product page just to show 3 related items.  
**Fix:** Add a backend endpoint `GET /api/products/{id}/related?limit=6` that returns related products by category, or use the existing search endpoint with category filter.

### 3.7 Checkout Page — Submit Button Outside Form
**File:** `shoppers-frontend/src/pages/Checkout.jsx`  
**Issue:** The submit button is inside a sticky div within the grid. It has `type="submit"` which works because it's inside the `<form>`. This is fine but the form wraps around the grid layout — on very long pages, keyboard "Enter" won't always trigger correct submit. Minor but worth noting.  
**Fix:** Consider explicit `onClick={handleSubmit}` on the button as a safety net.

---

## 4. MEDIUM — Performance Improvements

### 4.1 ProductController Returns Raw Entity
**File:** `src/main/java/org/example/ecomproj/controller/ProductController.java`  
**Issue:** Returns `Product` entity directly, which includes `@Version` field, `imageData` (if any), Hibernate proxy metadata. Couples API response to database schema.  
**Fix:** Create `ProductDTO` or `ProductResponse` record with only the needed fields. Map entity → DTO in service layer.

### 4.2 Navbar Loads ALL Products on Mount for Search
**File:** `shoppers-frontend/src/components/layout/Navbar.jsx`  
**Issue:** On every page load, Navbar calls `getAllProducts()` to build the search suggestion list. With 50 products this is fine; with 10,000 products it's a disaster.  
**Fix:**  
- Use debounced search-as-you-type that hits `GET /api/products/search?keyword=...` API.  
- Only fetch suggestions after user types 2+ characters.  
- Add a `GET /api/products/suggestions?q=...&limit=8` lightweight endpoint returning only id+name+category+imageUrl.

### 4.3 Home Page Loads ALL Products at Once
**File:** `shoppers-frontend/src/pages/Home.jsx`  
**Issue:** `getAllProducts()` fetches the entire product catalog. No pagination.  
**Fix:** Implement server-side pagination: `GET /api/products?page=0&size=20`. Add infinite scroll or "Load More" on frontend.

### 4.4 No API Response Caching
**Issue:** Every page navigation re-fetches data. No HTTP cache headers, no stale-while-revalidate, no React Query / SWR.  
**Fix (recommended):**  
- Add `Cache-Control` headers to GET endpoints (`max-age=60` for product list).  
- Consider React Query or SWR for client-side caching, deduplication, and background refetch.

### 4.5 Images Not Optimized
**Issue:** Product images served directly from Cloudinary URLs without transformation parameters. No lazy loading of off-screen images in grids (some have `loading="lazy"`, some don't).  
**Fix:**  
- Append Cloudinary transformation params: `?w=400&q=auto&f=auto` for thumbnails.  
- Ensure all `<img>` tags in grids have `loading="lazy"`.

---

## 5. MEDIUM — Data Integrity & Reliability

### 5.1 Fake Ratings & Sold Counts in Frontend
**Files:** `ProductCard.jsx`, `ProductInfo.jsx`, `SellerCard.jsx`, `SearchResults.jsx`  
**Issue:** Ratings, review counts, and sold counts are deterministically faked based on `product.id` math (e.g., `4.5 + ((product.id * 3) % 5) / 10`). Customer-facing pages show fabricated data.  
**Fix:**  
- Calculate real average rating and review count from the `reviews` table. Add fields `avgRating` and `reviewCount` to ProductDTO, computed from database.  
- Track real sold count (sum of completed order items). Add `soldCount` field.  
- Until implemented, show "No ratings yet" instead of fake data.

### 5.2 Seller Card Shows Fake Seller Data
**File:** `shoppers-frontend/src/components/product/SellerCard.jsx`  
**Issue:** Seller name, location, rating, and chat reply rate are hardcoded/faked. No seller model exists in the backend.  
**Fix:** Either implement a Seller/Vendor model or remove the SellerCard component and replace with a static "Sold by Shoppers" badge.

### 5.3 Order Cancel — Stock Restoration Race Condition
**File:** `src/main/java/org/example/ecomproj/service/OrderService.java`  
**Issue:** `cancelOrder()` restores stock by iterating order items and incrementing `stockQuantity`. This method isn't wrapped in explicit `@Transactional` at the repository level — stock restoration could partially fail, leaving inconsistent state.  
**Fix:** Ensure `cancelOrder()` has proper `@Transactional` annotation (it currently does inherit from the service class scope, but verify and add explicit rollback handling for stock restoration failures).

### 5.4 No Optimistic Lock Retry on Order Placement
**File:** `src/main/java/org/example/ecomproj/service/OrderService.java`  
**Issue:** `placeOrder()` uses `@Version` for optimistic locking on product stock deduction. If two users buy the last item simultaneously, one gets `OptimisticLockingFailureException` — but there's no retry logic.  
**Fix:** Add a retry mechanism (Spring `@Retryable` or manual retry loop) for stock deduction, or use pessimistic locking with `SELECT FOR UPDATE`.

### 5.5 Cart Stored in localStorage Only
**File:** `shoppers-frontend/src/context/CartContext.jsx`  
**Issue:** Cart is only in `localStorage`. If user logs in on another device, cart is empty. If product goes out of stock while in cart, user isn't notified until checkout.  
**Fix (nice-to-have):** Implement server-side cart for authenticated users. Validate cart items against current stock at checkout time (backend already does this, but frontend should show warnings).

---

## 6. LOW — Code Quality & Cleanup

### 6.1 Empty Test File
**File:** `src/test/java/org/example/ecomproj/EcomProjApplicationTests.java`  
**Issue:** Only has an empty `contextLoads()` test. Zero test coverage.  
**Fix:** Add unit tests for:  
  - Service layer (OrderService, ProductService, AuthService)  
  - Controller layer (MockMvc integration tests)  
  - Repository layer (custom queries)  
  - Security (JWT generation/validation)

### 6.2 Unused Import in Home.jsx
**File:** `shoppers-frontend/src/pages/Home.jsx`  
**Issue:** `getProductImage` is imported twice (line 4 and line 5) and `getProductImage` from `productApi` might not be used directly in `Home.jsx` (it's used in `MiniProductCard`).  
**Fix:** Clean up duplicate imports.

### 6.3 Contact Form Has No Backend
**File:** `shoppers-frontend/src/pages/Contact.jsx`  
**Issue:** Contact form submission is simulated with `setTimeout`. No email is sent.  
**Fix:** Either connect to a real backend endpoint / email service (EmailJS, SendGrid) or clearly label it as "demo" in the UI.

### 6.4 "Chat" Button in ProductInfo is Non-Functional
**File:** `shoppers-frontend/src/components/product/ProductInfo.jsx`  
**Issue:** Chat button exists but does nothing. No chat functionality implemented.  
**Fix:** Remove the chat button or add a "Coming Soon" tooltip. Or replace with a link to the Contact page.

### 6.5 "Follow" and "Visit Store" Buttons Are Non-Functional
**File:** `shoppers-frontend/src/components/product/SellerCard.jsx`  
**Issue:** Buttons rendered but no onClick handlers.  
**Fix:** Remove or wire up to actual functionality.

### 6.6 ESLint Config Not Verified
**File:** `shoppers-frontend/eslint.config.js`  
**Issue:** ESLint is configured but no CI/CD runs it. Potential lint errors may exist.  
**Fix:** Run `npm run lint` and fix any issues before production deploy.

### 6.7 `data.sql` Loaded via Custom DataInitializer (Not Spring's Standard Mechanism)
**File:** `src/main/java/org/example/ecomproj/config/DataInitializer.java`  
**Issue:** Reads `data.sql` manually, splits by `;`, and executes via `JdbcTemplate`. Spring Boot has built-in `data.sql` initialization.  
**Fix:** Consider using Spring Boot's standard `spring.sql.init.mode=always` or, better, conditional check + Flyway migration. Current approach works but is fragile (e.g. fails if SQL contains `;` inside strings).

---

## 7. MISSING FEATURES — E-commerce Essentials

These are features that a production e-commerce platform should typically have:

### 7.1 Password Reset / Forgot Password  
**Status:** Not implemented  
**Impact:** Users who forget their password have no recovery path.  
**Fix:** Add `POST /api/auth/forgot-password` → sends email with reset token → `POST /api/auth/reset-password` with token + new password.

### 7.2 Email Verification on Registration  
**Status:** Not implemented  
**Impact:** Anyone can register with a fake email.  
**Fix:** Send verification email on register, require email confirmation before allowing orders.

### 7.3 Order Confirmation / Shipping Notification Emails  
**Status:** Not implemented  
**Impact:** Users don't receive any email after placing an order.  
**Fix:** Integrate email service (SendGrid, AWS SES, SMTP) to send order confirmations and shipping updates.

### 7.4 Admin User Management  
**Status:** Not implemented  
**Impact:** Admin has no way to view/manage registered users, reset passwords, or ban abusive users.  
**Fix:** Add `GET /api/admin/users`, `PUT /api/admin/users/{id}/role`, etc.

### 7.5 Product Pagination & Server-Side Filtering  
**Status:** Not implemented (all products fetched client-side)  
**Impact:** Will not scale beyond a few hundred products.  
**Fix:** Add `GET /api/products?page=0&size=20&category=X&sort=price,asc` with Spring Data Pageable.

### 7.6 Proper API Error Responses  
**Status:** Partially implemented — some endpoints return raw exception messages  
**Impact:** Inconsistent error format. Frontend gets different shapes (string, object, 500 HTML).  
**Fix:** Add a `@RestControllerAdvice` global exception handler that returns consistent JSON:
```json
{ "error": "VALIDATION_ERROR", "message": "...", "timestamp": "..." }
```

### 7.7 Rate Limiting  
**Status:** Not implemented  
**Impact:** API is vulnerable to brute-force login attempts and DDoS.  
**Fix:** Add rate limiting (Spring Cloud Gateway, Bucket4j, or nginx-level rate limits).

### 7.8 Input Sanitization / XSS Protection  
**Status:** Partial — React escapes JSX output, but user-submitted review content is rendered as-is.  
**Impact:** Stored XSS via review titles/bodies if any raw HTML rendering is added later.  
**Fix:** Sanitize user input on the backend before persisting. Add Content-Security-Policy headers.

### 7.9 HTTPS Enforcement  
**Status:** Not configured  
**Impact:** Credentials and tokens transmitted in plain text over HTTP.  
**Fix:** Configure SSL/TLS on deployment platform. Add `server.ssl.*` properties or use a reverse proxy (Nginx/Caddy) with Let's Encrypt.

### 7.10 Logging & Monitoring  
**Status:** Minimal (`console.error` in frontend, default Spring logging)  
**Impact:** No visibility into production errors, performance metrics, or user behavior.  
**Fix:**  
- Backend: Configure structured logging (Logback + JSON appender), integrate with ELK/CloudWatch.  
- Frontend: Add error tracking (Sentry, LogRocket).  
- Add Spring Actuator endpoints for health/metrics (already on classpath but not configured).

### 7.11 Coupon / Discount System  
**Status:** Not implemented  
**Impact:** No promotional discount mechanism.  
**Fix:** Add Coupon entity (code, discountType, discountValue, expiresAt, usageLimit) + apply-coupon API.

### 7.12 Delivery Charge Logic  
**Status:** Hardcoded "Free" in frontend. Backend doesn't calculate shipping.  
**Impact:** No revenue from delivery; can't offer conditional free shipping (e.g., "Free on orders over ₹999").  
**Fix:** Add delivery charge calculation logic in backend based on order total, location, etc.

---

## 8. NICE-TO-HAVE — Enhancements

### 8.1 Product Image Compression Before Upload  
Currently, images are uploaded as-is to Cloudinary. Add client-side compression or Cloudinary transformation on upload.

### 8.2 Social Login (Google/GitHub OAuth)  
Allow users to register/login via Google or GitHub to reduce friction.

### 8.3 Wishlist Sync Across Devices  
Currently, wishlist syncs to backend when authenticated, but local → server merge on login could have duplicates. Harden the sync logic.

### 8.4 Order Invoice PDF Generation  
Generate downloadable PDF invoices for orders.

### 8.5 Product Review Moderation  
Allow admin to approve/reject reviews before they're visible.

### 8.6 Real-time Notifications (WebSocket)  
Notify users of order status changes in real-time.

### 8.7 Search Autocomplete with Backend  
Replace the current "load all products and filter" approach in Navbar with a proper backend search-suggestions endpoint.

### 8.8 SEO / Meta Tags  
Add `react-helmet-async` for dynamic `<title>`, `<meta description>`, Open Graph tags per page. Currently, all pages share the same `<title>` from `index.html`.

### 8.9 Accessibility (a11y) Audit  
Run axe-core or Lighthouse accessibility audit. Several buttons lack `aria-label`, focus states may be inconsistent.

### 8.10 PWA / Service Worker  
Add a service worker for offline support, app install prompt, and push notifications.

### 8.11 Admin Dashboard Analytics  
Add revenue charts, order trends, top products, conversion metrics to the admin dashboard.

### 8.12 Size/Variant Selection Wired to Backend  
Currently `ProductInfo.jsx` shows size selector for Clothing/Shoes but the selected size is never sent with the cart/order. No variant/SKU model exists in the backend.

---

## 9. File-by-File Findings Index

| # | File | Findings |
|---|------|----------|
| 1 | `application.properties` | §1.1 secrets, §1.6 Razorpay keys, §2.1 ddl-auto, §2.2 CORS |
| 2 | `pom.xml` | §1.5 devtools |
| 3 | `SecurityConfig.java` | §2.2 CORS origins |
| 4 | `JwtUtil.java` | §1.2 weak JWT secret |
| 5 | `DataInitializer.java` | §1.3 seed passwords, §6.7 manual SQL loading |
| 6 | `AuthController.java` | §3.1 unused variable |
| 7 | `PaymentController.java` | §3.2 unsafe casting, §3.3 no DTO |
| 8 | `ReviewController.java` | §3.4 markHelpful no auth/rate-limit |
| 9 | `ProductController.java` | §4.1 returns raw entity |
| 10 | `ProductService.java` | §3.5 updateProduct image overwrite |
| 11 | `OrderService.java` | §5.3 cancel stock race, §5.4 no optimistic lock retry |
| 12 | `EcomProjApplicationTests.java` | §6.1 empty tests |
| 13 | `axiosInstance.js` | §2.3 API base URL |
| 14 | `.env` | §2.4 stale Stripe key |
| 15 | `index.html` | §2.5 no SRI on Razorpay CDN |
| 16 | `LoginModal.jsx` | §1.4 demo credentials in placeholder |
| 17 | `RegisterModal.jsx` | §1.4 demo credentials in placeholder |
| 18 | `Navbar.jsx` | §4.2 loads all products for search |
| 19 | `Home.jsx` | §4.3 no pagination, §6.2 duplicate import |
| 20 | `ProductDetail.jsx` | §3.6 fetches all products for related |
| 21 | `ProductCard.jsx` | §5.1 fake ratings/sold counts |
| 22 | `ProductInfo.jsx` | §5.1 fake ratings, §6.4 non-functional chat |
| 23 | `SellerCard.jsx` | §5.2 fake seller data, §6.5 non-functional buttons |
| 24 | `SearchResults.jsx` | §5.1 fake rating in filters |
| 25 | `Contact.jsx` | §6.3 no backend for form |
| 26 | `About.jsx` | §2.6 outdated tech stack info |
| 27 | `Checkout.jsx` | §3.7 submit button positioning |
| 28 | `CartContext.jsx` | §5.5 localStorage-only cart |
| 29 | `vite.config.js` | §2.3 dev proxy only |

---

## Deployment Checklist Summary

Before going live, at minimum complete these items:

- [ ] **§1.1** Move all secrets to environment variables
- [ ] **§1.2** Generate strong JWT secret, remove fallback
- [ ] **§1.3** Disable/secure seed accounts in production  
- [ ] **§1.4** Remove demo credential hints from login UI
- [ ] **§1.5** Remove `spring-boot-devtools` from pom.xml
- [ ] **§1.6** Move Razorpay keys to env vars, switch to live keys
- [ ] **§2.1** Change `ddl-auto` to `validate` or `none`
- [ ] **§2.2** Add production domain to CORS
- [ ] **§2.3** Configure production API URL in frontend
- [ ] **§2.4** Clean up `.env` — remove Stripe, add API URL
- [ ] **§2.6** Update About page tech stack text
- [ ] **§3.1** Fix unused variable in AuthController
- [ ] **§3.2** Add DTO + validation for PaymentController
- [ ] **§5.1** Replace fake ratings with real data (or show "No ratings")
- [ ] **§7.6** Add global exception handler for consistent error responses
- [ ] **§7.9** Ensure HTTPS is configured on deployment platform

---

*This document is for planning only. No code changes have been made. Awaiting instruction before implementation.*
