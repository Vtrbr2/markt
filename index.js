const express = require('express');
const { PORT, ALLOWED_ORIGINS } = require('./config');

const authRoutes = require('./routes/auth');
const roomsRoutes = require('./routes/rooms');
const sedRoutes = require('./routes/sed');
const leiaspRoutes = require('./routes/leiasp');

const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin || '';
  const allowed = ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin);

  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS.includes('*') ? '*' : origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, x-api-realm, x-api-platform, if-none-match');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: '2mb' }));

// Ordem importa.
app.use('/', authRoutes);
app.use('/', leiaspRoutes);
app.use('/', roomsRoutes);
app.use('/sed', sedRoutes);

app.get('/', (_req, res) => {
  res.json({ status: 'online', service: 'Cryptitys server' });
});

app.get('/ping', (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Cryptitys server rodando em http://localhost:${PORT}`);
});
