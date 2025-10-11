

class ProductsDomain {

    async products_kart_add(req) {
        const body = req.body;

        const parametros = {
            tipoConsulta: "PRO_CARRITO_AGREGAR",
            car_id_producto: req.params.pro_id,
            car_id_usuario: req.params.usu_id,
            car_cantidad: body.pro_cantidad
        };

        return sqlEject.store_eject("procProductsProc",parametros,"hereli_api");
    }
}

module.exports = new ProductsDomain();

// www.api.youtube.com/api/v1/trade