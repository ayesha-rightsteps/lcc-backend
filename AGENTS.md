# AGENTS.md — lcc-backend

> Read `../AGENT.md` first — understand who you are, how you speak to Ayesha, and the cross-cutting rules.
> Read `../sessions/` next — understand where the project currently stands.
> This file governs everything inside `lcc-backend/`. It overrides general instinct. Follow it exactly.

This file provides guidance to AI agents (Antigravity, Claude, etc.) when working with code in this repository.
You are a senior architect, developer, and engineer. Write production-grade code with zero shortcuts.

## Commands

```bash
npm run dev          # Start with nodemon (auto-reload on src/ changes)
npm start            # Production start
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier format src/**/*.js
```

No test runner is configured.

## Architecture

Node.js + Express 5 + MongoDB (Mongoose), ES Modules (`"type": "module"`).

### Module structure

Every feature is a self-contained module under `src/modules/<name>/`:

```
src/modules/<name>/
  controllers/<name>.controller.js
  services/<name>.service.js
  routes/<name>.route.js
  validations/<name>.schema.js
  index.js   ← exports { <name>Routes }
```

All routes registered in `src/router/index.js` under `/v1`.

Current modules: `health`.

### Adding a new module checklist

1. Create `src/modules/<name>/` with controller, service, route, validations, index.js
2. Create `src/models/<name>.model.js`
3. Register in `src/router/index.js`

### Request lifecycle

```
Express → rate limiter → helmet/cors → requestId middleware
→ /v1 router → authenticate → isAdmin
→ validateRequest(zodSchema) → controller → service
```

### Shared utilities (`src/shared/index.js`)

Single import point for everything cross-cutting:

```js
import {
  httpResponse, httpError, responseMessage,
  asyncHandler, errorHandler,
  validateRequest, authenticate, isAdmin,
  logger,
  generateTokens, verifyAccessToken, verifyRefreshToken, setCookieOptions,
  hashPassword, comparePassword,
  EApplicationEnvironment,
} from '../../../shared/index.js';
```

### Auth middleware chain

Always applied in this order on protected routes:

```js
router.post('/route', authenticate, validateRequest(schema), controller);
router.post('/admin-route', authenticate, isAdmin, validateRequest(schema), controller);
```

- `authenticate` — verifies JWT Bearer token, attaches `req.user` (full User doc minus password)
- `isAdmin` — checks `req.user.role === 'admin'`

### Config files

```
src/config/index.js     ← all env vars, single source of truth
src/config/databases.js ← MongoDB connect/disconnect/health
src/config/email.js     ← Resend email client (initializeEmail, getEmailClient, sendEmail)
src/config/otp.js       ← getOTP (returns 123456 in dev), sendOTP
```

## Coding conventions

### Exports

```js
const foo = () => {};
export { foo };

export default mongoose.model('Name', schema);

export const mySchema = z.object({});
```

### No comments — ever

Zero inline comments. Zero block comments. Zero JSDoc. No `//`. No `/* */`. Nothing.
Name things clearly enough that comments are never needed.

### Error throwing in services

```js
const error = new Error('Human readable message');
error.statusCode = 404;
throw error;
```

### Controller pattern

`asyncHandler` wraps the async function. You still write `try/catch` inside — always.

```js
const doSomething = asyncHandler(async (req, res) => {
  try {
    const result = await someService(req.user._id, req.body);
    logger.info('Done', { userId: req.user._id, requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Success'), result);
  } catch (error) {
    logger.error('Failed', { stack: error.stack, requestId: req.requestId, error: error.message });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

export { doSomething };
```

### Routes — GET and POST only

No PUT, PATCH, or DELETE routes. Ever.

```js
router.get('/list', authenticate, validateRequest(schema, 'query'), controller);
router.post('/create', authenticate, validateRequest(schema), controller);
```

### Naming conventions

| Type | Pattern | Example |
|---|---|---|
| Service | `<verb><Resource>Service` | `getUserService` |
| Controller | `<verb><Resource>` | `getUser` |
| Schema | `<verb><Resource>Schema` | `createUserSchema` |
| Enum | `E` prefix | `EUserRole` |
| File | `<name>.<type>.js` | `user.controller.js` |

### httpResponse — never double-wrap

`httpResponse` puts its 4th argument directly into `data`. Never nest it.

```js
const result = await getUsersService(req.user._id, req.query);
return httpResponse(req, res, 200, responseMessage.custom('Users fetched'), result);
```

```js
const user = await getUserService(userId);
return httpResponse(req, res, 200, responseMessage.custom('User fetched'), { user });
```

```js
return httpResponse(req, res, 200, responseMessage.custom('...'), { data: { user } });
```

The third example is wrong. Never do it.

Always use `responseMessage.custom('...')` — never a raw string as the message argument.

### Pagination pattern

```js
const [total, items] = await Promise.all([
  Model.countDocuments(filter),
  Model.find(filter).select('field1 field2').skip(skip).limit(limit).lean(),
]);

return { items, pagination: { total, page, limit, hasNextPage: skip + items.length < total } };
```

Controller reads page as: `parseInt(req.query.page, 10) || 1`.

### Soft deletes

Never hard delete. Set `isActive: false`. Every query filters `isActive: true`.

## MongoDB standards — non-negotiable

- Always `.select()` — never fetch fields not needed
- Always `.lean()` on read-only queries
- Always `Promise.all` for independent parallel queries
- Never query inside a loop — use `$in`, `populate`, or aggregate
- Every field used in a `find`/`findOne` filter must have an index on the model
- Connection pool: `maxPoolSize: 10` in `src/config/databases.js` — do not change

### Model schema requirements

Every model must have:

```js
isActive: { type: Boolean, default: true }
{ timestamps: true }
```

Every model must have a compound index on its primary scoping field + `isActive`:

```js
schema.index({ userId: 1, isActive: 1 });
```

## ESLint

Flat config (`eslint.config.js`). Rules:
- `max-len`: 100 chars
- `no-param-reassign`: on — always use intermediate variables
- Model files (`**/models/**/*.js`) need `no-invalid-this: off` at the END of the config array — flat config last rule wins, do not move it

## Dev environment

- OTP in development is always `123456` (`src/config/otp.js`)
- JWT: access token 24h, refresh token 7d — stateless, no Redis
- Body limit: 10mb
- MongoDB URL in `MONGODB_URL` env var — required on startup
- Email via Resend (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`) — optional, service degrades gracefully if not set
