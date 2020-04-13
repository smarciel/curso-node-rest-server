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
    urlDB = 'mongodb+srv://smarciel:cqYkYGivJTymOx1j@cluster0-g8r8e.mongodb.net/cafe';
}

process.env.URL_DB = urlDB;