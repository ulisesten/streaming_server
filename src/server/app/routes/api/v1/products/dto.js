const jwt = require("../../../../librerias/jwt/jwt.js");
const encrypt = require("../../../../librerias/encrypt/encrypt.js");

/**
 * productos
 * pro_id
 * pro_descipcion
 */


class ProductsDto {
  product_new_response(data) {
    if (!data)
      return {
        msg: "Ocurrió un error al registrar el producto.",
        success: false,
        error: 1,
      };

    data = data[0];

    return {
      msg: data.msg,
      success: data.success,
      error: data.error,
    };
  }

  products_get_response(data) {
    if (!data || data[0] == null)
      return {
        msg: "Ocurrió un error al consultar productos.",
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

  product_detail_get_response(data) {
    if (!data)
      return {
        msg: "Ocurrió un error al consultar producto.",
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

  product_update_response(data) {
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
      error: data.error,
    };
  }

  product_delete_response(data) {
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
      error: data.error,
    };
  }

    products_kart_add_response(data) {
        if (!data)
            return {
              msg: "Ocurrió un error al actualizar el carrito.",
              success: false,
              error: 1,
            };
    
        data = data[0];
    
        return {
            msg: data.msg,
            success: data.success,
            error: data.error,
            data: null
        };
    }
}

module.exports = new ProductsDto();
