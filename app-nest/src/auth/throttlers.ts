/** Throttler bucket for every `/auth` route except refresh (login, register, logout, me): `THROTTLE_LIMIT` per `THROTTLE_TTL`, per IP. */
export const AUTH_THROTTLER = 'auth'

/**
 * Throttler bucket for `POST /auth/refresh`: `REFRESH_THROTTLE_LIMIT` per `THROTTLE_TTL`, per IP.
 * Every page load refreshes the session, so it must not share the login limit.
 */
export const REFRESH_THROTTLER = 'refresh'
