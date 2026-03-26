const jwt = require("../../../../../librerias/jwt/jwt.js");




class UsersService {
  
  
  user_signin(req, dao, password) {

    if (!dao || !dao[0])
      return null;

    dao = dao[0];
    const hash = dao["usu_contrasena"];

    if (!jwt.gost_hash_verify(password, hash)) {
      return null
    }

    return  {
        usu_id: dao["usu_id"],
        usu_nombre: dao["usu_nombre"],
        usu_correo: dao["usu_correo"],
        gost_token: jwt.write_gost_token(req, dao)
    };
    
  }
}

module.exports = new UsersService();