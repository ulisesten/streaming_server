const express = require('express');
const router = express.Router();

// Importar dominio de releases
const ReleasesDomain = require('./domain/releases_domain');

// Rutas para releases
router.get('/releases', ReleasesDomain.getAllReleases);

module.exports = router;
