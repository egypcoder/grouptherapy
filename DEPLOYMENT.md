# GroupTherapy - Vercel Deployment Guide

This guide covers deploying the GroupTherapy record label website to Vercel.

## Prerequisites

- Node.js 18 or later
- npm or yarn
- Vercel account
- PostgreSQL database (Vercel Postgres, Supabase, Neon, or similar)

## Project Structure

```
grouptherapy/
├── api/                    # Vercel serverless functions
│   └── index.ts           # Main API handler
├── client/                 # React frontend (Vite)
│   ├── src/
│   └── index.html
├── server/                 # Express server code
│   ├── app.ts             # Express app factory
│   ├── index.ts           # Local development entry
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data storage layer
├── shared/                 # Shared code (schemas, types)
├── dist/                   # Build output
│   └── public/            # Static frontend assets
├── vercel.json            # Vercel configuration
└── package.json
```

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jack77422/grouptherapy.git
   cd grouptherapy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:5000

## Build for Production

```bash
npm run build
```

This creates:
- `dist/public/` - Static frontend assets
- `dist/index.cjs` - Compiled server bundle

Test the production build locally:
```bash
npm start
```

## Vercel Deployment

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure the following settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

### Environment Variables on Vercel

Add these environment variables in the Vercel dashboard (Project Settings > Environment Variables):

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Random string for session encryption |
| `NODE_ENV` | No | Set to `production` (auto-set by Vercel) |
| `SPOTIFY_CLIENT_ID` | No | Spotify API client ID |
| `SPOTIFY_CLIENT_SECRET` | No | Spotify API client secret |
| `CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | No | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | Cloudinary API secret |

### Database Setup

#### Using Vercel Postgres

1. In Vercel Dashboard, go to Storage
2. Create a new Postgres database
3. Connect it to your project
4. The `DATABASE_URL` will be automatically set

#### Using External PostgreSQL (Supabase, Neon, etc.)

1. Create a PostgreSQL database on your provider
2. Get the connection string
3. Add it as `DATABASE_URL` in Vercel environment variables

### Running Migrations

After deployment, run database migrations:

```bash
# Local
npm run db:push

# Or connect to production database
DATABASE_URL="your-production-url" npx drizzle-kit push
```

## Architecture on Vercel

- **Frontend**: Static files served from Vercel's CDN (`dist/public/`)
- **API**: Serverless function at `/api/*` (handles all backend routes)
- **Routing**: SPA routing handled via `vercel.json` rewrites

### How It Works

1. Static frontend assets are served directly from Vercel's CDN
2. API requests to `/api/*` are routed to the serverless function
3. The serverless function runs the Express app in a serverless context
4. Client-side routes (SPA) fall back to `index.html`

## Troubleshooting

### Build Errors

**TypeScript errors:**
```bash
npm run check
```

**Vite build issues:**
- Ensure all path aliases are correctly configured in `vite.config.ts`
- Check for missing dependencies

### API Not Working

1. Check Vercel function logs in the dashboard
2. Verify environment variables are set
3. Ensure API routes start with `/api/`

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Check if your IP is whitelisted (if using external DB)
3. Ensure SSL is enabled: add `?sslmode=require` to connection string

### 404 on Page Refresh

The `vercel.json` should handle this. Verify the rewrites configuration:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Performance Optimization

- Enable Vercel Analytics for performance monitoring
- Use Vercel Edge Caching for static assets
- Consider Edge Functions for latency-sensitive endpoints

## Security Checklist

- [ ] Environment variables are set (not committed to git)
- [ ] SESSION_SECRET is a strong random string
- [ ] Database connection uses SSL
- [ ] Admin credentials are changed from defaults
- [ ] Rate limiting is configured for API endpoints

## Support

For issues specific to this project, please open a GitHub issue.
For Vercel-related questions, see [Vercel Documentation](https://vercel.com/docs).
