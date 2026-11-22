# SouqDZ — Full-Stack E-Commerce Application

Full-stack e-commerce web application connecting a React frontend with a Node.js/Express REST API and MongoDB.

**Student:** Oussama Chatri  
**School:** Higher National School of Advanced Technologies (ENSTA)  
**Module:** Web and Mobile Development (WAMD)  
**Supervised by:** Dr. S. SENHADJI  

---

## Application description

SouqDZ is an e-commerce platform built for the Algerian market. It features:
- Product catalogue with real-time category filtering, search, and sorting (by price, rating, discount).
- Full-stack integration: products are stored in MongoDB and served via Express REST API.
- User authentication with JWT (JSON Web Tokens) for registration and login.
- Protected CRUD operations allowing authenticated users to add, edit, and delete products directly from the frontend.
- Shopping cart and favourites panel with persistent local storage.
- Responsive design with dark/light mode toggle.
- Error handling and loading states for asynchronous API requests.

## Technologies used

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Redux (legacy createStore), Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Authentication | JSON Web Tokens (`jsonwebtoken`), bcryptjs |
| Communication | Fetch API with Vite dev proxy |
| Security | Express rate limiting, CORS |

## Project structure

```
.
├── public/                 # Static assets
├── screenshots/            # UI and testing screenshots
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/db.js            # MongoDB connection
│   │   ├── controllers/            # Route handlers (auth, products)
│   │   ├── middleware/             # JWT auth, rate limiter, error handler
│   │   ├── models/                 # Mongoose schemas (User, Product)
│   │   ├── routes/                 # Express routers
│   │   ├── app.js                  # Express app setup
│   │   ├── seed.js                 # Sample database seeding script
│   │   └── server.js               # Entry point
│   ├── .env.example
│   └── package.json
├── src/                    # React frontend
│   ├── api/                # API client (Fetch API functions)
│   ├── components/         # UI components (Header, ProductGrid, Modals, etc.)
│   ├── data/               # Constants and fallback sample data
│   ├── redux/              # Redux store, actions, reducers, and selectors
│   ├── styles/             # Global CSS styles and variables
│   ├── utils/              # Helper utilities (currency formatter)
│   ├── App.jsx             # Main layout component
│   └── main.jsx            # React root entry point
├── package.json            # Frontend package configuration
├── vite.config.js          # Vite config with API proxy
└── README.md
```

## Database models

### Product Model (`server/src/models/Product.js`)

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | String | Yes | Name of the product (trimmed) |
| `description` | String | Yes | Detailed description |
| `price` | Number | Yes | Price in DZD (minimum 0) |
| `category` | String | Yes | Department/category |
| `imageUrl` | String | Yes | URL to product picture |
| `stock` | Number | Yes | Available stock quantity (minimum 0) |
| `createdAt` / `updatedAt` | Date | Auto | Timestamps handled by Mongoose |

### User Model (`server/src/models/User.js`)

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | String | Yes | Full name |
| `email` | String | Yes | Unique email, stored in lowercase |
| `passwordHash` | String | Yes | Hashed password (excluded by default from queries) |
| `createdAt` / `updatedAt` | Date | Auto | Timestamps handled by Mongoose |

## API endpoints and access requirements

Base URL: `http://localhost:3000/api`

### Authentication Endpoints

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register new user (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Log in user, returns JWT and user profile |

### Product Endpoints

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/products` | Public | Get all products from MongoDB |
| `GET` | `/api/products/:id` | Public | Get a single product by its MongoDB `_id` |
| `POST` | `/api/products` | Protected (JWT) | Add a new product |
| `PUT` | `/api/products/:id` | Protected (JWT) | Update an existing product |
| `DELETE` | `/api/products/:id` | Protected (JWT) | Delete a product from database |

API errors return a JSON response in the format `{ "message": "error description" }` with appropriate HTTP status codes (`400`, `401`, `404`, `409`, `429`, `500`).

## JWT authentication mechanism

1. **User Registration:** The user registers via the frontend modal. The backend hashes the password using `bcryptjs` with 10 salt rounds before persisting it in MongoDB.
2. **User Login:** When logging in, the backend finds the user by email, compares passwords with `bcrypt.compare`, and signs a JSON Web Token containing the user ID (`sub`). The token is signed using `JWT_SECRET` and expires in 1 day.
3. **Frontend Storage:** The token and user profile are saved in Redux state and mirrored into the browser's `localStorage` (`souqdz_token` and `souqdz_user`), ensuring persistent sessions across page reloads.
4. **Protected Requests:** When an authenticated user performs CRUD actions (Add, Edit, Delete), the frontend includes the JWT in the HTTP request headers:
   ```
   Authorization: Bearer <token>
   ```
5. **Backend Verification:** The Express middleware `requireAuth` extracts the bearer token, verifies its signature against `JWT_SECRET`, and attaches the decoded user payload to `req.user`. If the token is missing, invalid, or expired, the server responds with status `401 Unauthorized`.
6. **Logout:** Logging out clears the Redux auth state and removes the stored token from `localStorage`.

## Installation and setup instructions

### Prerequisites

- Node.js (version 18 or higher recommended)
- MongoDB instance (local service or MongoDB Atlas cluster)

### 1. Backend Setup

Open a terminal in the `server` directory:

```bash
cd server
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Configure your environment variables in `server/.env`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/souqdz
JWT_SECRET=your_jwt_secret_key_here
CLIENT_ORIGIN=http://localhost:5173
```

*(If using MongoDB Atlas, replace `MONGODB_URI` with your connection string).*

Seed the database with initial products:

```bash
npm run seed
```

Start the backend server in development mode:

```bash
npm run dev
```

The server runs on `http://localhost:3000`.

### 2. Frontend Setup

In a new terminal window at the project root directory:

```bash
npm install
npm run dev
```

The React frontend starts at `http://localhost:5173`.

Vite is configured to automatically proxy API calls (`/api`) to `http://localhost:3000`, so no manual CORS proxy configuration is required during local development.

## Testing the application

1. **Browsing Products:** Open `http://localhost:5173`. The catalogue loads all products directly from MongoDB. You can filter by category, search by title, and sort by price or rating.
2. **Authentication:**
   - Click "Sign in" in the header.
   - Choose "Register here" to create a new user account.
   - After registration, you are logged in automatically and your name is displayed in the header.
3. **CRUD Operations:**
   - **Add Product:** Once signed in, click "+ Add product" in the header to open the creation modal. Fill in the product details and submit. The new item is saved to MongoDB and immediately displayed.
   - **Edit Product:** Hover over any product card and click the Edit button (pencil icon), or open the product modal and click "Edit product". Modify the fields and click "Save changes".
   - **Delete Product:** Click the Delete button (trash icon) on any product card or in the product modal, confirm the dialog, and the item will be removed from MongoDB and the frontend.
4. **Cart and Favourites:** Products can be added to the shopping cart and saved to favourites as usual.
