const sqlEject = require('../../../../librerias/sql_server/sql_eject.js');
const usersDto = require('./dto.js');

class PurchasesDomain {
    purchase_new = async function(req, res){

        const body = req.body;

        const parametros = {
            tipoRegistro: "COMPRA_REGISTRAR",
            ven_id_usuario: body.ven_id_usuario,
            ven_id_carrito: body.ven_id_carrito,
            ven_total: body.ven_total
        }
        
        return sqlEject.store_eject('procPurchasesProc', parametros, 'hereli_api');
    };


    purchase_update =  async function(req, res){
        
        const body = req.body;

        const parametros = {
            tipoRegistro: 'COMPRA_ACTUALIZAR',
            usu_nombre: body.usu_nombre,
            usu_ape_paterno: body.usu_ape_paterno,
            usu_ape_materno: body.usu_ape_materno,
            usu_correo: body.usu_correo,
        }

        const db_res = await sqlEject.store_eject('procPurchasesProc', parametros, 'hereli_api');
        return usersDto.purchase_update_response(db_res);

    };

    purchases_get = async function(req, res){
        
        const body = req.body;

        const parametros = {
            tipoRegistro: 'COMPRAS_CONSULTA'
        }

        const db_res = await sqlEject.store_eject('procPurchasesProc', parametros, 'hereli_api');
        return usersDto.purchase_update_response(db_res);

    };
}

module.exports = new PurchasesDomain();