# SouqDZ Backend

Backend for the SouqDZ e-commerce application built in TD-TP 2.

**Student:** Oussama Chatri

The frontend still runs as before. This project adds the Node.js/Express REST API that stores products and users in MongoDB, authenticates users with JWT, protects product write operations, and limits repeated requests.

## Technologies

- Node.js and Express.js
- MongoDB with Mongoose
- JSON Web Tokens (`jsonwebtoken`)
- Password hashing with `bcryptjs`
- OAuth 2.0 / OpenID Connect token verification with `jose`
- Rate limiting with `express-rate-limit`
- CORS and dotenv

## Project structure

```
server/
  src/
    config/db.js
    controllers/authController.js
    controllers/productController.js
    middleware/auth.js
    middleware/error.js
    middleware/rateLimit.js
    models/Product.js
    models/User.js
    routes/authRoutes.js
    routes/productRoutes.js
    app.js
    seed.js
    server.js
  .env.example
  package.json
```

## Database models

**Product**

| Field | Type | Notes |
| --- | --- | --- |
| name | String | required |
| description | String | required |
| price | Number | required, cannot be negative |
| category | String | required |
| imageUrl | String | required |
| stock | Number | required, cannot be negative |

Timestamps (`createdAt`, `updatedAt`) are added automatically.

**User**

| Field | Type | Notes |
| --- | --- | --- |
| name | String | required |
| email | String | required, unique, stored in lowercase |
| passwordHash | String | required, bcrypt hash, excluded from queries by default |

## API endpoints

Base URL: `http://localhost:3000/api`

### Authentication

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Log in and receive a JWT | Public |

### Products

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| GET | `/api/products` | Retrieve all products | Public |
| GET | `/api/products/:id` | Retrieve one product | Public |
| POST | `/api/products` | Create a product | JWT required |
| PUT | `/api/products/:id` | Update a product | JWT required |
| DELETE | `/api/products/:id` | Delete a product | JWT required |

Responses use JSON. Errors use the shape `{ "message": "..." }`.

Status codes used: `200`, `201`, `400`, `401`, `404`, `409`, `429` and `500`.

## Authentication

1. `POST /api/auth/register` receives `name`, `email` and `password`. The password is hashed with bcrypt before the user is stored. A duplicate email returns `409 Conflict`.
2. `POST /api/auth/login` verifies the email and password and returns a JWT:
   ```json
   { "token": "..." }
   ```
3. The token is signed with `JWT_SECRET`, uses `HS256`, contains the user id in `sub`, and expires after one day.
4. Protected requests must send:
   ```
   Authorization: Bearer <JWT_TOKEN>
   ```
5. The authentication middleware verifies the token. A missing, invalid or expired token returns `401 Unauthorized`.
6. If an OAuth 2.0/OIDC provider is configured, the same middleware also accepts access tokens issued by that provider after checking the signature, issuer and audience.

## OAuth 2.0 testing with Postman

The API can validate OAuth 2.0 access tokens that are JWTs, for example tokens from Keycloak, Auth0 or Azure AD. Set these variables in `.env`:

```
OAUTH_ISSUER=https://your-provider/issuer
OAUTH_AUDIENCE=your-api-audience
OAUTH_JWKS_URI=https://your-provider/.well-known/jwks.json
```

In Postman:

1. Create an OAuth 2.0 client in the provider and note the client ID.
2. Open the Authorization tab of a protected request, select **OAuth 2.0**.
3. Choose the **Authorization Code (with PKCE)** flow.
4. Set the authorization URL, token URL, client ID and redirect URI exactly as registered with the provider.
5. Request the token and let Postman attach it to the request.
6. Send `POST /api/products`, `PUT /api/products/:id` or `DELETE /api/products/:id`. A valid token is accepted and an invalid one returns `401`.

## Rate limiting

- All `/api` routes: 100 requests per 15 minutes per IP.
- `POST /api/auth/login`: 5 requests per 15 minutes per IP.
- When a limit is exceeded the API returns `429 Too Many Requests`.

## Installation and running

Requirements: Node.js 20.19+, MongoDB (local or Atlas).

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/souqdz
JWT_SECRET=some_long_random_value
CLIENT_ORIGIN=http://localhost:5173
```

For MongoDB Atlas, use the connection string from the Atlas dashboard, for example:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/souqdz?retryWrites=true&w=majority
```

Add your machine's IP address to the Atlas access list.

Populate the database with sample products:

```bash
npm run seed
```

Start the API:

```bash
npm run dev
```

Production start:

```bash
npm start
```

The API listens on `http://localhost:3000`. The React frontend is started separately from the repository root with `npm run dev`.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| PORT | No | API port, defaults to 3000 |
| MONGODB_URI | Yes | MongoDB or Atlas connection string |
| JWT_SECRET | Yes | Secret used to sign local JWTs |
| CLIENT_ORIGIN | No | Allowed CORS origin, defaults to `http://localhost:5173` |
| OAUTH_ISSUER | No | OIDC issuer, enables OAuth2 token support |
| OAUTH_AUDIENCE | No | Expected audience in OAuth2 access tokens |
| OAUTH_JWKS_URI | No | Provider JWKS URL used to verify token signatures |

`.env` is excluded by `.gitignore`. Only `.env.example` is committed.
