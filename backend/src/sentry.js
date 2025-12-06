/**
 * Optional Sentry initialization for backend error monitoring.
 * Set SENTRY_DSN in production environment to enable.
 */
if (process.env.SENTRY_DSN) {
  try {
    const Sentry = require('@sentry/node');
    const Tracing = require('@sentry/tracing');
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1')
    });
    console.log('Sentry initialized');
  } catch (err) {
    console.warn('Failed to initialize Sentry', err.message);
  }
}
