const { Router } = require("express");
const products = Router();
const productsDto = require("./dto.js");
const productsDomain = require('./domain.js');
//const authService = require("../../../../librerias/authorization/authorization.js");
const sqlEject = require("../../../../librerias/sql_server/sql_eject.js");
//const encryptService = require("../../../../librerias/encrypt/encrypt.js");


products.post("/", async function (req, res) {
    const body = req.body;

    const parametros = {
        tipoRegistro: "PRODUCTO_GUARDAR",
        pro_nombre: body.pro_nombre,
        pro_descripcion: body.pro_descripcion,
        pro_com_precio: body.pro_com_precio,
        pro_ven_precio: body.pro_ven_precio,
        pro_cod_barras: body.pro_cod_barras,
        pro_imagenes: body.pro_imagenes
    };

    const db_res = await sqlEject.store_eject(
        "procProductsProc",
        parametros,
        "hereli_api",
    );

    res.json(productsDto.product_new_response(db_res));
});


products.put("/:pro_id", async function (req, res) {
    const body = req.body;

    const parametros = {
        tipoRegistro: "PRODUCTO_ACTUALIZAR",
        pro_nombre: body.pro_nombre,
        pro_descripcion: body.pro_descripcion,
        pro_com_precio: body.pro_com_precio,
        pro_ven_precio: body.pro_ven_precio,
        pro_cod_barras: body.pro_cod_barras,
        pro_images: body.pro_images
    };

    const db_res = await sqlEject.store_eject(
        "procProductsProc",
        parametros,
        "hereli_api",
    );
    res.json(productsDto.product_update_response(db_res));
});


products.get("/", async function (req, res) {
    const parametros = {
        tipoConsulta: "PRODUCTOS_CONS"
    };

    const db_res = await sqlEject.store_eject(
        "procProductsCons",
        parametros,
        "hereli_api",
    );
    res.json(productsDto.products_get_response(db_res));
});

products.get("/search", async function (req, res) {
    const params = req.query
    //console.log(params)
    const parametros = {
        tipoConsulta: "PRODUCTOS_BUSCAR",
        pro_nombre: params.pro_nombre,
        pro_descripcion: params.pro_descripcion,
        /*pro_com_precio: '',
        pro_ven_precio: '',
        pro_est_ganancia: '',
        pro_cod_barras: ''*/
    };

    const db_res = await sqlEject.store_eject(
        "procProductsCons",
        parametros,
        "hereli_api",
    );
    res.json(productsDto.products_get_response(db_res));
});

products.get("/:pro_id", async function (req, res) {
    const parametros = {
        tipoConsulta: "PRODUCTO_DETALLES_CONS",
        pro_id: req.params.pro_id
    };

    const db_res = await sqlEject.store_eject(
        "procProductsCons",
        parametros,
        "hereli_api",
    );
    res.json(productsDto.product_detail_get_response(db_res));
});


products.delete("/:pro_id", async function (req, res) {
    const body = req.body;

    const parametros = {
        tipoConsulta: "USUARIO_ELIMINAR",
        //pro_id: body.usu_corre
    };

    const db_res = await sqlEject.store_eject("procProductsCons",parametros,"hereli_api");

    res.json(productsDto.product_delete_response(db_res));
});


products.post("/:pro_id/kart/:usu_id", async function (req, res) {
    const db_res = productsDomain.products_kart_add(req);
    res.json(productsDto.products_kart_add_response(db_res));
});


module.exports = products;