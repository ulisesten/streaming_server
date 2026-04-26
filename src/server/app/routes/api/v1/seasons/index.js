const express = require('express');
const router = express.Router();

// Importar dominio de temporadas
const SeasonsDomain = require('./domain/seasons_domain');

// Rutas para temporadas
router.get(     '/'     , SeasonsDomain.getAllSeasons);
router.post(    '/'     , SeasonsDomain.createSeason);

module.exports = router;