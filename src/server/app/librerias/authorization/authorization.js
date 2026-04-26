//const { path, settings } = require("../../../server.js");
const jwt = require("../jwt/jwt.js");
const settings = require("../../core/configuration.js");

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

        if (!auth ) {
            res.json({
                success: false,
                error: 1,
                msg: 'Authentication rejected.'
            });
            return;
        }

        req.user = auth;
        req.authorized = true;

        next();
    }

    user_signin(req, res, dao) {
        const password = req.body['usu_contrasena'];

        if (!dao || !dao[0])
            return null;

        dao = dao[0];
        const hash = dao["usu_contrasena"];

        if (!jwt.gost_hash_verify(password, hash)) {
            return null
        }

        /* const csrf_token = crypto.randomBytes(24).toString('hex');
        const local_storage_token = crypto.randomBytes(32).toString('hex');
        const refresh_token = jwtLib.write_refresh_token(data); */
        const access_token = jwt.write_gost_token(req, dao);
        const refresh_token = jwt.write_refresh_token(req, dao);
        const csrf_token = jwt.write_csrf_token(req);

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
            path: '/api/v1',
            maxAge: (settings.getAccessExpirationMinutes?.() || 15) * 60000
        });

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path: '/api/v1/users/refresh_token',
            maxAge: (settings.getRefreshExpirationDays?.() || 7) * 86400000
        });

        return {
            usu_id: dao["usu_id"],
            usu_nombre: dao["usu_nombre"],
            usu_correo: dao["usu_correo"],
            gost_token: access_token,
            gost_refresh_token: refresh_token,
            gost_csrf_token: csrf_token
        };

    }

    /**
     * @deprecated 
     */
    authorize(req, res, next) {
        const authHeader = req.headers['authorization'];
        const authCookie = req.cookies['access_token'];
        const token = null;

        if (!authHeader && !authCookie) {
            res.json({
                success: false,
                error: 1,
                msg: 'No credentials are present.'
            });
            return;
        }

        if (authHeader && !authHeader.startsWith('Bearer ')) {
            res.json({
                success: false,
                error: 1,
                msg: 'No valid token.'
            });
            return;
        }

        
        token = authHeader? authHeader.split(' ')[1] : authCookie;
        
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