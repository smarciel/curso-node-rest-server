// =========================
// Puerto
// =========================
process.env.PORT = process.env.PORT || 3000;

// =========================
// Entorno
// =========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =========================
// Base de datos
// =========================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URL_DB = urlDB;

// =========================
// Fecha expiración token
// =========================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// =========================
// SEED de autentiación
// =========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// =========================
// Google CLIENT ID
// =========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '799940673193-f6006bvu6vl14tnd0932k6bdq69qgm4i.apps.googleusercontent.com'