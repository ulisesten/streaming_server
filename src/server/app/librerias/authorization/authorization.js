const jwt = require("../jwt/jwt.js");

class AuthorizationService {

    verify(req, res, next) {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.json({
                success: false,
                error: 1,
                msg: 'No credentials are present.'
            });
            return;
        }

        const token = authHeader.split(' ')[1];

        let auth = jwt.gost_verify(token);

        if (!auth || req.headers['user-agent'] !== auth.user['user_agent']) {
            res.json({
                success: false,
                error: 1,
                msg: 'Authentication rejected.'
            });
        }

        req.user = auth;
        req.authorized = true;

        next();
    }

    user_signin(req, dao) {
        const password = req.body.usu_contrasena;

        if (!dao || !dao[0])
            return null;

        dao = dao[0];
        const hash = dao["usu_contrasena"];

        if (!jwt.gost_hash_verify(password, hash)) {
            return null
        }

        return {
            usu_id: dao["usu_id"],
            usu_nombre: dao["usu_nombre"],
            usu_correo: dao["usu_correo"],
            gost_token: jwt.write_gost_token(req, dao)
        };

    }

    /**
     * @deprecated 
     */
    authorize(req, res, next) {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.json({
                success: false,
                error: 1,
                msg: 'No credentials are present.'
            });
            return;
        }

        const token = authHeader.split(' ')[1];
        let auth = jwt.gost_verify(token);

        if (req.ip !== auth.user['ip']) {
            auth = null;
        }

        if (!auth) {
            res.json({
                success: false,
                error: 1,
                msg: 'Authentication error.'
            });
            req.authorized = false;
            req.user = null; // Si no se encuentra el token, asignamos null
            return;
        }

        req.user = auth;
        req.authorized = true;

        next();
    }
}

module.exports = new AuthorizationService();