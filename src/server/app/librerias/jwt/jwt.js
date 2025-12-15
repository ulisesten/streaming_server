const jwt = require("jsonwebtoken");
const encrypt = require("../encrypt/encrypt.js");
const settings = require("../../core/configuration");

class JsonWebToken {
  secret_key = settings.getSecretKey();

  /**
   * @brief Genera un token JWT
   * @param string Datos a codificar
   * @returns
   */

  write_token(data) {
    const credentials = settings.getCredentials();

    const fecha_exp =
      new Date().getTime() + settings.getExpirationDays() * 86400000;

    const payload = {
      id: credentials.usu_id,
      init: new Date().getTime(),
      exp: fecha_exp,
      user: {
        id: credentials.usu_id,
        usu_nombre: credentials.usu_nombre,
        correo: credentials.usu_correo,
      },
    };

    return jwt.sign(payload, this.secret_key, null);
  }

  /**
   * @brief Decodifica un token JWT
   * @param data string, token a decodificar
   * @param cb function, callback
   */
  verify(token, cb) {
    jwt.verify(token, this.secret_key, (err, payload) => {
      if (err) {
        cb(null, err);
        return;
      }

      cb(payload, null);
    });
  }

  /**
   * @brief Genera un token GOST
   * @param req object, datos de la petición http
   * @param data object, Datos a codificar
   * @returns string, datos codificados
   */
  write_gost_token(req, data) {
      const credentials = data;

      const fecha_exp = new Date().getTime() + settings.getExpirationDays() * 86400000;

      const payload = {
          id: credentials.usu_id,
          init: new Date().getTime(),
          exp: fecha_exp,
          user: {
              id: credentials.usu_id,
              usu_nombre: credentials.usu_nombre,
              correo: credentials.usu_correo,
              ip: req.ip,
              user_agent: req.user_agent
          },
      };

      return encrypt.reversible_encrypt(payload);
  }

  /**
   * @brief Decodifica un token GOST
   * @param data string, token a decodificar
   * @returns string
   */
  gost_verify(token) {
    const today = new Date().getTime();
    let decrypted_data = encrypt.decrypt(token);

    /* if(Object.prototype.toString.call(decrypted_data) === "[object Uint8Array]")
      return false; */
      
    const decoded_data = JSON.parse(decrypted_data);

    if (today > decoded_data.exp) return false;

    return decoded_data;
  }

  /**
   * @brief Genera un hash de una contraseña
   * @param password contraseña a encriptar
   * @returns string, hash
   */
  generate_hash(password) {
    return encrypt.reversible_encrypt(password);
  }

  /**
   * @brief verifica la contraseña con el hash
   * @param password contraseña a verificar
   * @param hash hash almacenado de la contraseña
   * @returns bool si la contraseña es correcta retorna true
   */
  gost_hash_verify(password, hash) {
    
    const new_hash = encrypt.hash(password);

    if (hash.length != new_hash.length) return false;

    let i = 0;
    while (i < new_hash.length && hash[i] == new_hash[i]) {
      i += 1;
    }

    if (i != new_hash.length) return false;

    return true;
  }
}

module.exports = new JsonWebToken();

// 30 * 86400000
