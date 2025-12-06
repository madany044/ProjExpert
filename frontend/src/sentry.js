// Optional client-side Sentry initialization for production monitoring
if (process.env.REACT_APP_SENTRY_DSN) {
  try {
    const Sentry = require('@sentry/react');
    const { BrowserTracing } = require('@sentry/tracing');
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: parseFloat(process.env.REACT_APP_SENTRY_TRACES_SAMPLE_RATE || '0.05')
    });
    console.log('Frontend Sentry initialized');
  } catch (err) {
    console.warn('Failed to init frontend Sentry', err.message);
  }
}
