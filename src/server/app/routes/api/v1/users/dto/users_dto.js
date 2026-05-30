//const jwt = require("../../../../../librerias/jwt/jwt.js");
//const encrypt = require("../../../../../librerias/encrypt/encrypt.js");

//const crypto = require('crypto');
//const jwtLib = require("../../../../../librerias/jwt/jwt.js");

class UsersDto {
  user_new_response(data) {
    if (!data)
      return {
        msg: "Ocurrió un error al registrar al usuario.",
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

  users_get_response(data) {
    if (!data || !data[0])
      return {
        msg: "Ocurrió un error al consultar usuarios.",
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

  user_update_response(data) {
    if (!data)
      return {
        msg: "Ocurrió un error al actualizar al usuario.",
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

  user_signin_response(data, password) {
    if (!data) {
      return {
        status: 401,
        response: {
            msg: "El usuario no fue autorizado o no existe.",
            success: false,
            error: 1
        }
      };
    }

    
    

    return {
      status: 200,
      response: {
        msg: 'Inicio de sesión exitoso.',
        success: true,
        error: 0,
        data: {
          usu_id: data["usu_id"],
          usu_nombre: data["usu_nombre"],
          usu_correo: data["usu_correo"],
          //gost_token: data["gost_token"],
          //gost_refresh_token: data["gost_refresh_token"],
          //gost_csrf_token: data["gost_csrf_token"]
        }
      }
    };
  }

  users_refresh_token_response(data) {
    if (!data)
      return {
      status: 401,
      response: {
        msg: "El refresh token no es válido o ha expirado.",
        success: false,
        error: 1,
      }
    };
    
    return {
      status: 200,
      response:{
        msg: "Token renovado exitosamente.",
        success: true,
        error: 0,
        data: {
          user: data.user
        }
      }
    };
  }
}

module.exports = new UsersDto();
