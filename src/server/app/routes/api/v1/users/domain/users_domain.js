const encryptService = require("../../../../../librerias/encrypt/encrypt.js");
const sqlEject = require("../../../../../librerias/sql_server/sql_eject.js");

class UsersDomain {
    async users_new(req) {
        const body = req.body;

        const hashed_password = encryptService.hash(body.usu_contrasena);

        const parametros = {
            tipoRegistro: "USUARIO_REGISTRAR",
            usu_nombre: body.usu_nombre,
            usu_ape_paterno: body.usu_ape_paterno,
            usu_ape_materno: body.usu_ape_materno,
            usu_correo: body.usu_correo,
            usu_contrasena: hashed_password,
        };

        return sqlEject.store_eject("procUsersProc", parametros, "soda_stream");
    }

    async users_update(req) {
        const body = req.body;

        const parametros = {
            tipoRegistro: "USUARIO_ACTUALIZAR",
            usu_nombre: body.usu_nombre,
            usu_ape_paterno: body.usu_ape_paterno,
            usu_ape_materno: body.usu_ape_materno,
            usu_correo: body.usu_correo,
        };

        return sqlEject.store_eject("procUsersProc",parametros,"soda_stream");
    }

    async users_get() {
        const parametros = {
            tipoConsulta: "USUARIOS_CONS",
        };
      
        //console.log(encryptService.decrypt("44uK6IGt44usY0wEOxvji5zogLnKq+iBt+OAiQDjgLLogJnji5/ogbzji6XogbPjgIYZOuiBnsuUMculdAYcOeiBn8qV"))
      
        return sqlEject.store_eject( "procUsersCons", parametros, "soda_stream" );
    }

    async user_singin(req) {
        const body = req.body;

        const parametros = {
            tipoConsulta: "USUARIO_SIGN_IN_CONS",
            usu_correo: body.usu_correo
        };

        const result = sqlEject.store_eject( "procUsersCons", parametros, "soda_stream" );

        return result;
    }
    
    async users_address_get_one(req) {
        const body = req.body;

        return {
            /* dir_calle: 'Bolivar',
            dir_num_exterior: '615',
            dir_colonia: 'La Pimienta',
            dir_ciudad: 'Valles',
            dir_estado: 'San Luis Potosí',
            dir_cp: 79068 */
        }
    }
}

module.exports = new UsersDomain();