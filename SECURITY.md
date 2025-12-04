
# Security Guidelines

## Authentication

This application uses a database-backed authentication system with the following security features:

### Features Implemented

1. **Database-stored credentials**: Admin credentials are stored in the database with bcrypt-hashed passwords
2. **Rate limiting**: Login attempts are tracked and limited to prevent brute force attacks
3. **Session management**: Secure session tokens with 24-hour expiration
4. **Environment variables**: Sensitive configuration stored in environment variables

### Rate Limiting

- Maximum failed login attempts: 5 (configurable via `MAX_LOGIN_ATTEMPTS`)
- Lockout duration: 15 minutes (configurable via `LOCKOUT_DURATION_MINUTES`)
- Failed attempts are tracked per username

### Setup Instructions

1. **Set environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env and set secure values
   ```

2. **Create initial admin user**:
   ```bash
   npm run seed-admin
   ```

3. **For production deployment**:
   - Set strong `ADMIN_PASSWORD` and `SESSION_SECRET`
   - Configure PostgreSQL database connection
   - Enable HTTPS (handled automatically by Replit deployment)
   - Consider implementing 2FA for additional security

### Password Requirements

When creating admin users, ensure passwords:
- Are at least 12 characters long
- Include uppercase, lowercase, numbers, and symbols
- Are unique and not reused from other services

### Production Deployment

When deploying on Replit:
1. HTTPS is automatically enabled for all deployments
2. Set all environment variables in the Secrets tool
3. Never commit `.env` file to version control
4. Regularly rotate admin passwords and session secrets
5. Monitor login attempts for suspicious activity

### Future Enhancements

Consider implementing:
- Two-factor authentication (2FA)
- Password reset functionality
- Email notifications for suspicious login attempts
- IP-based blocking for repeated failed attempts
- Audit logging for admin actions
