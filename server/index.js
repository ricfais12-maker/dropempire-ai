import express from 'express';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dbDir = path.join(rootDir, 'data');
fs.mkdirSync(dbDir, { recursive: true });

const db = new sqlite3.Database(path.join(dbDir, 'dropempire.db'));
const app = express();
const PORT = process.env.PORT || 3001;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback';

const productCatalog = [
  { id: 'p1', name: 'GlowLift Pro', category: 'Beauty', supplierCost: 9.5, recommendedPrice: 29.99, margin: 68, trend: 92, saturation: 31, competition: 44, demand: 91, estimatedSales: 2840, rating: 4.8, shippingDays: 5, tikTok: 91, instagram: 88, metaAds: 85, winningScore: 94, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80' },
  { id: 'p2', name: 'HydraCore Bottle', category: 'Wellness', supplierCost: 12.2, recommendedPrice: 34.99, margin: 66, trend: 85, saturation: 42, competition: 47, demand: 86, estimatedSales: 2670, rating: 4.7, shippingDays: 4, tikTok: 89, instagram: 81, metaAds: 84, winningScore: 90, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80' },
  { id: 'p3', name: 'SmartFlex Mat', category: 'Fitness', supplierCost: 18, recommendedPrice: 59.99, margin: 70, trend: 82, saturation: 38, competition: 46, demand: 82, estimatedSales: 2350, rating: 4.7, shippingDays: 6, tikTok: 84, instagram: 86, metaAds: 80, winningScore: 88, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80' },
  { id: 'p4', name: 'NestPulse Lamp', category: 'Home', supplierCost: 17, recommendedPrice: 49.99, margin: 65, trend: 80, saturation: 35, competition: 41, demand: 78, estimatedSales: 2140, rating: 4.6, shippingDays: 5, tikTok: 80, instagram: 84, metaAds: 83, winningScore: 86, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' },
  { id: 'p5', name: 'BreezeDesk Mini', category: 'Lifestyle', supplierCost: 22, recommendedPrice: 69, margin: 69, trend: 88, saturation: 29, competition: 39, demand: 85, estimatedSales: 2875, rating: 4.9, shippingDays: 7, tikTok: 88, instagram: 90, metaAds: 87, winningScore: 92, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80' },
];

function createDefaultGame(capital = 10000) {
  return {
    capital,
    availableCash: capital,
    revenue: 0,
    cogs: 0,
    adSpend: 0,
    refunds: 0,
    otherExpenses: 150,
    netProfit: 0,
    roas: 0,
    followers: 420,
    fame: 24,
    storeValue: Math.round(capital * 1.6),
    day: 1,
    stats: {
      visitors: 1800,
      customers: 0,
      conversionRate: 2.4,
      followers: 420,
      fame: 24,
      growth: 1,
    },
    store: {
      name: 'Empire Nova',
      logo: 'DE',
      colors: { primary: '#8b5cf6', accent: '#22c55e' },
      homepage: 'Build the next generation of premium products.',
      shipping: '3-5 giorni',
    },
    storeProducts: [],
    productCatalog,
    campaigns: [],
    contentItems: [],
    orders: [],
    financeHistory: [{ label: 'Starting capital', amount: capital, date: new Date().toISOString() }],
    statsData: [
      { name: 'Day 1', sales: 0, profit: 0, visitors: 1200, advertising: 120, followers: 420 },
      { name: 'Day 2', sales: 35, profit: 8, visitors: 1450, advertising: 140, followers: 440 },
      { name: 'Day 3', sales: 50, profit: 12, visitors: 1700, advertising: 165, followers: 470 },
      { name: 'Day 4', sales: 70, profit: 18, visitors: 1950, advertising: 190, followers: 520 },
    ],
  };
}

function runSQL(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function getSQL(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
}

async function initDB() {
  await runSQL(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, google_id TEXT, email TEXT, name TEXT, picture TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP)`);
  await runSQL(`CREATE TABLE IF NOT EXISTS game_state (user_id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id))`);
}

async function getGameStateForUser(userId) {
  const row = await getSQL('SELECT * FROM game_state WHERE user_id = ?', [userId]);
  if (!row) return null;
  try { return JSON.parse(row.data); } catch { return null; }
}

async function saveGameState(userId, game) {
  const payload = JSON.stringify(game);
  const existing = await getSQL('SELECT * FROM game_state WHERE user_id = ?', [userId]);
  if (existing) {
    await runSQL('UPDATE game_state SET data = ?, updated_at = ? WHERE user_id = ?', [payload, new Date().toISOString(), userId]);
    return;
  }
  await runSQL('INSERT INTO game_state (user_id, data, updated_at) VALUES (?, ?, ?)', [userId, payload, new Date().toISOString()]);
}

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(session({ secret: process.env.SESSION_SECRET || 'dropempire-secret', resave: false, saveUninitialized: false, cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const row = await getSQL('SELECT * FROM users WHERE id = ?', [id]);
    if (!row) return done(null, null);
    done(null, {
      id: row.id,
      google_id: row.google_id,
      email: row.email,
      name: row.name,
      picture: row.picture,
    });
  } catch (error) {
    done(error, null);
  }
});

if (googleClientId && googleClientSecret) {
  passport.use(new GoogleStrategy({ clientID: googleClientId, clientSecret: googleClientSecret, callbackURL }, async (accessToken, refreshToken, profile, done) => {
    try {
      const googleId = profile.id;
      const email = profile.emails?.[0]?.value || `${profile.displayName}@google.local`;
      const existing = await getSQL('SELECT * FROM users WHERE google_id = ?', [googleId]);
      if (existing) {
        return done(null, { id: existing.id, google_id: existing.google_id, email: existing.email, name: existing.name, picture: existing.picture });
      }
      const user = { id: `google-${Date.now()}`, google_id: googleId, email, name: profile.displayName || 'Google User', picture: profile.photos?.[0]?.value || '' };
      await runSQL('INSERT INTO users (id, google_id, email, name, picture, created_at) VALUES (?, ?, ?, ?, ?, ?)', [user.id, user.google_id, user.email, user.name, user.picture, new Date().toISOString()]);
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

function getSafeUser(user) {
  return { id: user.id, name: user.name, email: user.email, picture: user.picture };
}

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/api/auth/google', (req, res, next) => {
  if (!googleClientId || !googleClientSecret) return res.redirect('/api/auth/mock-google');
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

app.get('/api/auth/google/callback', (req, res, next) => {
  if (!googleClientId || !googleClientSecret) return res.redirect('/api/auth/mock-google');
  passport.authenticate('google', { failureRedirect: '/', successRedirect: '/' })(req, res, next);
});

app.get('/api/auth/mock-google', async (req, res) => {
  const user = {
    id: `demo-${Date.now()}`,
    google_id: `demo-${Date.now()}`,
    email: `demo-${Date.now()}@dropempire.local`,
    name: 'Demo Founder',
    picture: '',
  };
  const existing = await getSQL('SELECT * FROM users WHERE email = ?', [user.email]);
  if (!existing) {
    await runSQL('INSERT INTO users (id, google_id, email, name, picture, created_at) VALUES (?, ?, ?, ?, ?, ?)', [user.id, user.google_id, user.email, user.name, user.picture, new Date().toISOString()]);
  }
  req.login(user, (error) => {
    if (error) return res.status(500).json({ error: 'Mock login failed' });
    return res.redirect('/');
  });
});

app.get('/api/auth/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
    req.session.destroy(() => res.redirect('/'));
  });
});

app.get('/api/me', async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) return res.json({ user: null, game: null });
  const user = getSafeUser(req.user);
  const game = (await getGameStateForUser(user.id)) || createDefaultGame(10000);
  return res.json({ user, game });
});

app.post('/api/onboard', ensureAuth, async (req, res) => {
  const capital = Number(req.body.capital || 10000);
  const user = getSafeUser(req.user);
  const game = createDefaultGame(capital);
  await saveGameState(user.id, game);
  return res.json({ user, game });
});

app.post('/api/game', ensureAuth, async (req, res) => {
  const user = getSafeUser(req.user);
  const game = req.body.game;
  if (!game) return res.status(400).json({ error: 'Missing game payload' });
  await saveGameState(user.id, game);
  return res.json({ game });
});

app.get('/api/game', ensureAuth, async (req, res) => {
  const user = getSafeUser(req.user);
  const game = (await getGameStateForUser(user.id)) || createDefaultGame(10000);
  return res.json({ game });
});

app.use(express.static(path.join(rootDir, 'dist')));
app.get('*', (req, res) => {
  const indexFile = path.join(rootDir, 'dist', 'index.html');
  if (fs.existsSync(indexFile)) return res.sendFile(indexFile);
  return res.send('DropEmpire AI server is running.');
});

async function boot() {
  await initDB();
  app.listen(PORT, () => console.log(`DropEmpire AI server running on http://localhost:${PORT}`));
}

boot();
