const express = require('express');
const router = express.Router();

// Importar dominio de temporadas
const SeasonsDomain = require('./domain/seasons_domain');

// Rutas para temporadas
router.get(     '/'     , SeasonsDomain.getAllSeasons);
router.post(    '/'     , SeasonsDomain.createSeason);
router.get(     '/series/:ser_id' , SeasonsDomain.getSeasonsBySeriesId);

module.exports = router;
