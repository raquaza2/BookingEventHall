# Grand Aurora Hall Booking App

A responsive hall and venue booking web app built with `Next.js`, `TypeScript`, `Tailwind CSS`, `Prisma`, and `PostgreSQL`.

This project includes:

- A polished public landing page
- A venue details page with amenities, gallery, and rules
- A booking request flow with date and fixed time-slot selection
- A booking confirmation page
- An admin login page
- An admin dashboard for reviewing and managing bookings
- Booking statuses: `pending`, `approved`, and `rejected`

## Tech Stack

- `Next.js` App Router
- `TypeScript`
- `Tailwind CSS`
- `Prisma`
- `PostgreSQL`
- `Zod`

## Features

### Public booking flow

- Browse the venue from the landing page
- View venue details and event information
- Select a preferred booking date
- Choose from fixed event time slots
- Submit a booking request with validation
- View a confirmation page after submission

### Admin flow

- Log in through a protected admin page
- Review incoming booking requests
- Filter bookings by status and date
- Approve or reject requests from the dashboard
- Prevent double-booking of approved date/slot combinations

## Routes

- `/` - Landing page
- `/venue` - Venue details page
- `/book` - Booking request form
- `/booking/confirmation/[id]` - Booking confirmation page
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a local `.env` file based on `.env.example`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
ADMIN_EMAIL="admin@grandaurora.com"
ADMIN_PASSWORD="ChangeMe123!"
SESSION_SECRET="replace-with-a-long-random-secret"
```

### 3. Initialize the database

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Seeded Admin Login

The local seed script creates this admin account by default:

- Email: `admin@grandaurora.com`
- Password: `ChangeMe123!`

You can change these values in your `.env` file before running `npm run db:seed`.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to the PostgreSQL database
- `npm run db:seed` - Seed demo venue and admin data
- `npm run vercel-build` - Generate Prisma client and build for Vercel-style deployment

## Booking Rules

- The app supports a single venue
- Users can request one date and one fixed slot per booking
- New requests are created as `pending`
- Only `approved` bookings block a slot
- `pending` and `rejected` bookings do not block availability
- No payment integration is included

## Verification

The project has been verified with:

```bash
npm run lint
npm run build
```

## Repository Notes

- `.env` is intentionally ignored and should not be committed
- `.env.example` is included for setup
- Prisma is configured for `PostgreSQL`, which is a better fit for hosted deployments than SQLite

## Hosting on Vercel

This project is now prepared for a typical `Vercel + Postgres` deployment flow.

### Recommended deployment setup

1. Create a Postgres database
2. Import the GitHub repository into Vercel
3. Add the required environment variables in Vercel
4. Run the Prisma schema against the hosted database
5. Deploy the app

### Required environment variables

Add these in your Vercel project settings:

- `DATABASE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`

### Suggested Vercel flow

1. Connect your GitHub repository to Vercel
2. Set `DATABASE_URL` to your hosted Postgres connection string
3. Add the admin credentials and session secret
4. Use the default build command or `npm run vercel-build`
5. Run `npx prisma db push` once against the production database
6. Run `npm run db:seed` if you want the default venue and admin record created

### Notes

- The app does not need a custom `vercel.json` file for standard Next.js hosting
- Do not commit production secrets to GitHub
- If you use Vercel preview deployments, consider using a separate preview database so preview schema changes do not affect production
