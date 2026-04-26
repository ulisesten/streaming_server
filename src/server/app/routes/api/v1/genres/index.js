const express = require('express');
const router = express.Router();

// Importar dominio de géneros
const GenresDomain = require('./domain/genres_domain');

// Rutas para géneros
router.get('/', GenresDomain.getAllGenres);
router.post('/', GenresDomain.createGenre);

module.exports = router;
