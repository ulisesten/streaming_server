const jwt = require("../../../../librerias/jwt/jwt.js");
const encrypt = require("../../../../librerias/encrypt/encrypt.js");

class PurchasesDto {
    purchase_new_response(data) {
        if (!data)
        return {
            msg: "Ocurrió un error al registrar compra.",
            success: false,
            error: 1,
        };

        data = data[0];

        return {
            msg: data.msg,
            success: data.success,
            error: data.error
        };
    }

    purchases_get_response(data) {
        if (!data || data[0] == null)
        return {
            msg: "Ocurrió un error al consultar compras.",
            success: false,
            error: 1,
        };

        return {
            msg: data[0].msg,
            success: data[0].success,
            error: data[0].error,
            data: data
        };
    }

    purchase_detail_get_response(data) {
        if (!data)
        return {
            msg: "Ocurrió un error al consultar compra.",
            success: false,
            error: 1,
            data: []
        };

        return {
            msg: data[0].msg,
            success: data[0].success,
            error: data[0].error,
            data: data[0]
        };
    }

    purchase_update_response(data) {
        if (!data)
        return {
            msg: "Ocurrió un error al actualizar al producto.",
            success: false,
            error: 1,
        };

        data = data[0];

        return {
            msg: data.msg,
            success: data.success,
            error: data.error
        };
    }

    purchase_delete_response(data) {
        if (!data)
        return {
            msg: "Ocurrió un error al eliminar el producto.",
            success: false,
            error: 1,
        };

        data = data[0];

        return {
            msg: data.msg,
            success: data.success,
            error: data.error
        };
    }

}

module.exports = new SalesDto();
