const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../src/services/cloudinary', () => {
  return {
    uploader: {
      upload_stream: (opts, cb) => {
        const { Writable } = require('stream');
        const w = new Writable({ write(chunk, enc, next) { next(); } });
        // when stream ends, simulate Cloudinary response
        w.on('finish', () => cb(null, { secure_url: 'https://res.cloudinary.com/demo/image/upload/v1/projxpert/test.png', public_id: 'projxpert/test123' }));
        return w;
      },
      destroy: async (public_id) => ({ result: 'ok' })
    }
  };
});

const app = require('../src/app');

describe('Uploads API', () => {
  it('uploads a file and returns url', async () => {
    const token = jwt.sign({ id: 'testuser', role: 'user' }, process.env.JWT_SECRET || 'devsecret');
    const res = await request(app)
      .post('/api/uploads')
      .set('Cookie', [`projxpert_session=${token}`])
      .attach('file', Buffer.from('hello'), 'test.png');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('url');
    expect(res.body).toHaveProperty('public_id');
  });
});
