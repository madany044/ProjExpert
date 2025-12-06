const request = require('supertest');
const express = require('express');

// Minimal smoke test placeholder - extend to start a real server
const app = express();
app.get('/health', (req, res) => res.json({ ok: true }));

describe('backend smoke', () => {
  it('health check', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
