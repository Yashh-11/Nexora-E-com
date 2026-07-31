# Nexora E-Commerce Platform

A full-stack e-commerce web application built with React, Vite, Node.js, Express, and MongoDB. Nexora delivers a responsive shopping experience with product browsing, cart management, checkout flow, order tracking, role-based admin access, and inventory stock updates after successful orders.

This project is designed to demonstrate clean frontend presentation, practical backend API structure, and real-world commerce workflows in a professional MERN-style application.

## Project Highlights

- Responsive customer storefront with product catalog, search, category filtering, sorting, and product detail pages.
- Shopping cart with quantity controls, live totals, delivery calculation, and checkout.
- Inventory handling that deducts ordered quantity from the selected product stock.
- Order history for customers and order status management for admin users.
- Authentication-ready flow with signup, login, profile, email verification, and role-based admin route protection.
- Admin studio for managing store activity and product information.
- Professional responsive UI with reusable header, footer, product cards, tables, and dashboard panels.
- MongoDB-backed server with organized routes, controllers, models, and configuration layers.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, React Router, Axios, React Toastify |
| Styling | CSS3, responsive layouts, custom UI system |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | bcryptjs, local user session state |
| Email | Nodemailer SMTP OTP verification |
| Development | ESLint, npm scripts |

## Folder Structure

```text
NODE-PR-2-E-com-main/
├── Client/
│   ├── src/
│   │   ├── api/                 # Axios API configuration
│   │   ├── components/          # Header, footer, protected-route components
│   │   ├── context/             # User, cart, order, and stock state
│   │   ├── data/                # Demo product and order data
│   │   ├── pages/               # Home, product, cart, orders, auth, profile
│   │   └── utils/               # Local storage helpers
│   ├── package.json
│   └── vite.config.js
├── Server/
│   ├── configs/                 # Database connection
│   ├── controllers/             # Request handling logic
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # API route definitions
│   ├── package.json
│   └── index.js
└── README.md
```

## Core Features

### Customer Experience

- Browse featured products with responsive cards and product imagery.
- View complete product details including category, price, description, and current stock.
- Add products to cart and adjust quantities before checkout.
- Place orders and review purchase history.
- See real-time stock updates after checkout.

### Admin Experience

- Access protected admin routes based on user role.
- Review operational order information.
- Update order status through admin controls.
- Manage product-related data through the connected product API structure.

### Inventory Workflow

When a user places an order, the app calculates the purchased quantity for each product and updates the available stock. For example, if a product has `16 in stock` and the customer orders `1`, the product detail and card views display `15 in stock` after checkout.

## API Overview

The backend exposes grouped API routes under `/api`.

| Module | Base Route | Purpose |
| --- | --- | --- |
| User | `/api/user` | Registration, login, profile, verification |
| Product | `/api/product` | Create, read, update, delete products |
| Category | `/api/category` | Category management |
| Cart | `/api/cart` | Cart-related endpoints |
| Admin | `/api/admin` | Admin route group |

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm
- MongoDB connection string
- SMTP credentials, if email OTP verification is required

### 1. Clone the Repository

```bash
git clone <repository-url>
cd NODE-PR-2-E-com-main
```

### 2. Install Dependencies

Install frontend dependencies:

```bash
cd Client
npm install
```

Install backend dependencies:

```bash
cd ../Server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `Server` directory:

```env
PORT=8081
MONGODB_URL=your_mongodb_connection_string
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=your_sender_email
```

For the frontend, create a `.env` file inside the `Client` directory only if the API URL is different from the default:

```env
VITE_API_URL=http://localhost:8081/api
```

### 4. Run the Application

Start the backend server:

```bash
cd Server
npm run dev
```

Start the frontend app in a separate terminal:

```bash
cd Client
npm run dev
```

The frontend runs on the Vite development URL, and the backend runs at:

```text
http://localhost:8081
```

## Available Scripts

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates a production build |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint checks |

### Backend

| Command | Description |
| --- | --- |
| `npm start` | Starts the Express server |
| `npm run dev` | Starts the server with watch mode |

## Development Guidelines

- Keep components focused, reusable, and aligned with the existing UI style.
- Use the API layer for server communication instead of calling endpoints directly inside unrelated logic.
- Keep state updates predictable, especially for cart, order, and inventory flows.
- Validate user-facing flows after changes: product listing, detail page, cart, checkout, orders, and admin access.
- Avoid unnecessary refactoring when making feature-specific updates.
- Keep environment secrets in `.env` files and never commit real credentials.
- Run `npm run build` in the client before sharing production-ready changes.

## Quality Checklist

- Responsive layout across mobile, tablet, and desktop screens.
- Product stock remains accurate after checkout.
- Cart quantity does not exceed available stock.
- Protected admin screens remain role-based.
- API routes follow controller and model separation.
- UI messages are clear and helpful for users.

## Future Improvements

- Add JWT-based session handling for production authentication.
- Add payment gateway integration.
- Add order persistence through a dedicated order model.
- Add automated tests for checkout and inventory workflows.
- Add image upload support for admin product management.
- Add pagination and advanced filters for large catalogs.

## Author

**Yash Chandrani**

Full-stack developer focused on building practical, responsive, and user-friendly web applications with modern JavaScript technologies.

## License

This project is created for learning, portfolio, and demonstration purposes.
