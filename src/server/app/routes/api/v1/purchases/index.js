const { Router } = require('express');
const purchases = Router();
const sqlEject = require('../../../../librerias/sql_server/sql_eject.js');
const purchasesDomain = require('./domain.js');
const purchasesDto = require('./dto.js');

purchases.post('/', async function(req, res){
    const db_res = purchasesDomain.sale_new(req, res);
    res.json( purchasesDto.purchase_new_response(db_res) );
});

purchases.put('/:usu_id', async function(req, res){
    
    const body = req.body;

    const parametros = {
        tipoRegistro: 'COMPRA_ACTUALIZAR',
        usu_nombre: body.usu_nombre,
        usu_ape_paterno: body.usu_ape_paterno,
        usu_ape_materno: body.usu_ape_materno,
        usu_correo: body.usu_correo,
    }

    const db_res = await sqlEject.store_eject('procUsersProc', parametros, 'hereli_api');
    res.json( purchasesDto.user_update_response(db_res) );

});

purchases.get('/', async function(req, res){
    
    const body = req.body;

    const parametros = {
        tipoRegistro: 'COMPRA_CONSULTA'
    }

    const db_res = await sqlEject.store_eject('procUsersProc', parametros, 'hereli_api');
    res.json( purchasesDto.user_update_response(db_res) );

});

module.exports = purchases;