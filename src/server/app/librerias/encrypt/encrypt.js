/**
 * Encryption and decryption function only
 */


const gost = require("gost-cryptography");
const settings = require("../../core/configuration");
const { d, Q } = gost.ЭЦП.Сгенерировать_ключи();

class EncryptService {
  SECRET = settings.getSecretKey();
  x_vector = [
    0x33206D54, 0x326C6568, 0x20657369, 0x626E7373,
    0x79676120, 0x74746769, 0x65686573, 0x733D2C20
  ];

  
  /**
   * @param data string
   * @returns string firma **/
  sign(data) {
    ///    gost.EDS.firmar
    return gost.ЭЦП.Подписать(data, d);
  }


  /**
   * @param data string datos sin cifrar
   * @param signature string datos cifrados
   * @returns bool **/
  verify(data, signature) {
    ///     gost.EDS.comprobar
    return gost.ЭЦП.Проверить(data, signature, Q);
  }


  /**
   * @brief Encripta con posibilidad de revertir
   * @param data any
   * @returns string retorna un string encriptado que es reversible **/
  reversible_encrypt(data) {
    if(typeof data === 'object') {
      data = JSON.stringify(data);
    }

    ///    gost.encriptacion.proceso_con_reversion
    const token = gost.Шифрование.Гаммование_с_обратной_связью(
      data,
      this.x_vector,
      this.SECRET,
      null,
      false,
    );

    return Buffer.from(token).toString('base64');
  }


  /**
   * @param texto_cifrado string
   * @returns string texto descifrado **/
  decrypt(texto_cifrado) {
    const jsonString = Buffer.from(texto_cifrado, 'base64').toString();
    
    ///    gost.encriptacion.proceso_con_reversion
    const user = gost.Шифрование.Гаммование_с_обратной_связью(
      jsonString,
      this.x_vector,
      this.SECRET,
      null,
      true,
    );
    
    return user;
  }


  /**
   * @param data string, contraseña a encryptar
   * @returns string **/
  hash(data) {
    ///    gost.hash.calcular
    return gost.Хэшевание.Вычислить(data, false).toString(16);
  }
  
}


module.exports = new EncryptService();
