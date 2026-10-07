# Crust & Co. API

Express and MongoDB backend for the pizza ordering app.

## Run locally

1. Install MongoDB and start it, or update `MONGODB_URI` in `.env` to use a MongoDB Atlas connection string.
2. Set `JWT_SECRET` to a long random value and configure the admin credentials in `.env` before provisioning an administrator.
3. From this directory run `npm install`, then `npm run dev`.
4. In another terminal run `npm run admin:create` once. The command creates or promotes the account named by `ADMIN_EMAIL`; change the placeholder admin password first.
5. Start the React app with `npm --prefix ../vite-project run dev`. Vite proxies `/api` requests to port 5000.

The API seeds the existing starter menu, managed categories, and editable homepage copy when their collections are empty. Cash-on-delivery orders start `pending`. Demo card checkout recognizes a number ending in `4242` as approved and one ending in `0002` as declined; other card fields remain in the browser. No card number, expiry, or CVV is sent to the API or stored. Set `CLIENT_ORIGIN` to a comma-separated list of allowed frontend origins when needed.

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `POST /api/auth/register`, `POST /api/auth/login` | Public | Create account or issue a JWT (administrators use login too) |
| `GET /api/users/me`, `PATCH /api/users/me` | Signed in | View or update the current profile |
| `/api/pizzas` | Public reads; admin writes | Search with `?search=...`, filter with `?category=...`, and manage products |
| `GET /api/pizzas/admin/all` | Admin | List all products, including unavailable products |
| `GET /api/categories` | Public | List active menu categories |
| `/api/content` | Public read; admin write | Get or edit Hero, About, and Offer content |
| `POST /api/contact` | Public | Save a customer contact message |
| `/api/cart` | Signed in | Get, add, update, remove, or clear the user's cart |
| `POST /api/orders`, `GET /api/orders/mine`, `GET /api/orders/active` | Signed in | Place an order or view history and active deliveries |
| `POST /api/orders/:id/demo-payment` | Order owner | Retry a failed demo-card payment using only a demo outcome token |
| `/api/reviews` | Public reads; signed-in writes | List and submit 1-5 star pizza reviews |
| `/api/admin/dashboard`, `/api/admin/users`, `/api/admin/orders` | Admin | Dashboard metrics and user/order management |
| `PATCH /api/admin/orders/:id/status`, `PATCH /api/admin/orders/:id/payment` | Admin | Update delivery or payment status (`pending`/`paid`) |
| `/api/admin/categories`, `/api/admin/reviews`, `/api/admin/content`, `/api/admin/contact-messages` | Admin | Manage categories, moderate reviews/messages, and edit homepage content |

Admin UI: open `/admin/login`; customer accounts are rejected. Customer profile, current deliveries, payment status, order history, and purchased pizzas are available at `/account`.

Send protected requests with `Authorization: Bearer <token>`. Order totals are recalculated from current database prices; delivery costs $3.50 below a $35 subtotal and is free otherwise. Paid sales reports include paid orders only. User passwords are hashed with bcrypt.