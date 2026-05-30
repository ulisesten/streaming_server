const { reject } = require("../../../../../core/errors.js");
const encryptService = require("../../../../../core/encrypt.js");
const sqlEject = require("../../../../../librerias/sql_server/sql_eject.js");
const jwtLib = require("../../../../../core/jwt.js");
const authService = require("../../../../../core/authorization.js"); /// IGNORE
const users = require("../index.js");
const usersDto = require("../dto/users_dto.js");

class UsersDomain {
    normalize_email(email) {
        if (typeof email !== "string") {
            return email;
        }

        return email.trim().toLowerCase();
    }

    async users_new(req) {
        const body = req.body;

        const hashed_password = encryptService.hash(body.usu_contrasena);
        const normalized_email = this.normalize_email(body.usu_correo);

        const parametros = {
            tipoRegistro: "USUARIO_REGISTRAR",
            usu_nombre: body.usu_nombre,
            usu_ape_paterno: body.usu_ape_paterno,
            usu_ape_materno: body.usu_ape_materno,
            usu_correo: normalized_email,
            usu_contrasena: hashed_password,
        };

        return sqlEject.store_eject("procUsersProc", parametros, "soda_stream");
    }

    async users_update(req) {
        const body = req.body;
        const normalized_email = this.normalize_email(body.usu_correo);

        const parametros = {
            tipoRegistro: "USUARIO_ACTUALIZAR",
            usu_nombre: body.usu_nombre,
            usu_ape_paterno: body.usu_ape_paterno,
            usu_ape_materno: body.usu_ape_materno,
            usu_correo: normalized_email,
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

    /// Inicio de sesión de usuario
    async user_signin(req, res) {
        try {
            const body = req.body;
            const normalized_email = this.normalize_email(body.usu_correo);

            const parametros = {
                tipoConsulta: "USUARIO_SIGN_IN_CONS",
                usu_correo: normalized_email
            };

            const dao = await sqlEject.store_eject( "procUsersCons", parametros, "soda_stream" );
            const service_response = authService.user_signin(req, res, dao);
            const dto_response = usersDto.user_signin_response(service_response);

            res.status(dto_response.status).json(dto_response.response);
        } catch (error) {
            console.error("Error en user_signin:", error);
            reject(res, 500, 'Error al procesar el inicio de sesión');
        }
    }
    
    async users_address_get_one(req) {
        const body = req.body;

        return {}
    }

    async users_refresh_token(req, res) {
        try {
            const user = req.user;
            const authorized = req.authorized;

            if (!authorized) {
                reject(res, 401, "Usuario no autorizado");
                return;
            }
            
            const dto_response = usersDto.users_refresh_token_response({user: user});

            res.status(dto_response.status).json(dto_response.response);
        } catch (error) {
            console.error("Error en users_refresh_token:", error);
            reject(res, 500, 'Error al procesar el refresh token');
        }
    }
}

module.exports = new UsersDomain();
