const jwt = require("../../../../../librerias/jwt/jwt.js");

class UsersService {
  

  user_signin(req, sql_data, password) {
    if (!sql_data || !sql_data[0])
      return null;

    sql_data = sql_data[0];
    const hash = sql_data["usu_contrasena"];

    if (!jwt.gost_hash_verify(password, hash)) {
      return null
    }

    return  {
        usu_id: sql_data["usu_id"],
        usu_nombre: sql_data["usu_nombre"],
        usu_correo: sql_data["usu_correo"],
        gost_token: jwt.write_gost_token(req, sql_data)
    };
  }
}

module.exports = new UsersService();