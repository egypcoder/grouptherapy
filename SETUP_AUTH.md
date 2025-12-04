
# Authentication Setup Guide

## Quick Start

1. **Copy environment variables**:
```bash
cp .env.example .env
```

2. **Edit `.env` and set secure values**:
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePasswordHere123!
ADMIN_EMAIL=admin@yourdomain.com
SESSION_SECRET=generate_a_random_secret_key_here
```

3. **Create the initial admin user**:
```bash
npm run seed-admin
```

4. **Start the application**:
```bash
npm run dev
```

5. **Login at**: `/admin/login` with your credentials

## Using Replit Secrets

For production deployment on Replit, use the Secrets tool instead of `.env`:

1. Open the Secrets tab in Replit
2. Add the following secrets:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD` (use a strong password!)
   - `ADMIN_EMAIL`
   - `SESSION_SECRET` (generate a random string)
   - `BCRYPT_SALT_ROUNDS` (default: 10)

3. Run the seed script to create the admin user

## Security Features

✅ **Implemented**:
- Database-stored credentials (bcrypt hashed)
- Rate limiting (5 failed attempts = 15 min lockout)
- Session-based authentication with expiry
- Environment variable configuration
- IP tracking for login attempts
- HTTPS in production (automatic on Replit)

## Changing Admin Password

To change the admin password:

1. Update `ADMIN_PASSWORD` in your `.env` or Replit Secrets
2. Delete the existing admin user from the database
3. Run `npm run seed-admin` again

## Migration to PostgreSQL

Currently using in-memory storage. To migrate to PostgreSQL:

1. Provision PostgreSQL database in Replit
2. Run database migrations: `npx drizzle-kit push`
3. Update `server/storage.ts` to use Drizzle ORM instead of in-memory maps
4. Run seed script to create admin user in database
