const express = require('express');
const { PORT, ALLOWED_ORIGINS } = require('./config');

// ─── Rotas ───────────────────────────────────────────────────────────────────
const authRoutes   = require('./routes/auth');
const roomsRoutes  = require('./routes/rooms');
const sedRoutes    = require('./routes/sed');
const leiaspRoutes = require('./routes/leiasp');

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
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

// ─── Body parser ──────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Rotas montadas ───────────────────────────────────────────────────────────
// Ordem importa: auth antes do wildcard /sed/*
app.use('/', authRoutes);       // POST /sed/login, POST /sed/credenciais/api/ValidarToken, POST /registration/edusp/token
app.use('/', roomsRoutes);      // GET  /room/*, /tms/*, /survey/*, /achievement/*, /mas/*
app.use('/sed', sedRoutes);     // GET|POST /sed/* → proxy SED (tudo que sobrou)
app.use('/', leiaspRoutes);     // GET  /leiasp/handoff

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/ping', (_req, res) => res.json({ ok: true }));

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Cryptitys server rodando em http://localhost:${PORT}`);
});
