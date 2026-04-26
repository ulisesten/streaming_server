const express = require('express');
const router = express.Router();

// Importar dominio de series
const SeriesDomain = require('./domain/series_domain');

// Rutas para series
router.get(     '/'     , SeriesDomain.getAllSeries);
//router.get(     '/:id'  , SeriesDomain.getSeriesById);
router.post(    '/'     , SeriesDomain.createSeries);
//router.put(     '/:id'  , SeriesDomain.updateSeries);
//router.delete(  '/:id'  , SeriesDomain.deleteSeries);

module.exports = router;