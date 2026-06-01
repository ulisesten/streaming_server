//const { path, settings } = require("../../../server.js");
const jwt = require("./jwt.js");
const settings = require("./configuration.js");

class AuthorizationService {

    ACCESS_TOKEN_EXPIRATION_MINUTES = 30;

    verify(req, res, next) {
        const token = req.cookies['access_token'];
        const csrf_token = req.headers['x-csrf-token'];

        if ( !token  || !csrf_token) {
            res.status(401).json({
                success: false,
                error: 1,
                msg: 'No credentials are present.'
            });
            return;
        }

        const auth = jwt.gost_verify(token);
        const csrf_valid = jwt.verify_csrf_token(csrf_token);

        if (!auth || !csrf_valid) {
            res.status(401).json({
                success: false,
                error: 1,
                msg: 'Authentication rejected.'
            });
            return;
        }

        req.user = auth.user;
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

        const access_token = jwt.write_gost_token(req, dao);
        const refresh_token = jwt.write_refresh_token(req, dao);
        const csrf_token = jwt.write_csrf_token(req);

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
            path: '/api/v1',
            maxAge: (settings.getAccessExpirationMinutes?.() || this.ACCESS_TOKEN_EXPIRATION_MINUTES) * 60000
        });

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path: '/api/v1/users/refresh_token',
            maxAge: (settings.getRefreshExpirationDays?.() || 7) * 86400000
        });

        res.cookie('csrf_token', csrf_token, {
            secure: true,
            sameSite: 'Lax',
            path: '/'
        });

        return {
            usu_id: dao["usu_id"],
            usu_nombre: dao["usu_nombre"],
            usu_correo: dao["usu_correo"]
        };

    }

    refresh(req, res, next) {
        const token = req.cookies['refresh_token'];
        const csrf_token = req.headers['x-csrf-token'];

        if ( !token || !csrf_token) {
            res.status(401).json({
                success: false,
                error: 1,
                msg: 'No credentials are present.'
            });
            return;
        }

        //const token = authHeader;

        const auth = jwt.gost_verify(token);
        const csrf_valid = jwt.verify_csrf_token(csrf_token);

        if (!auth || !csrf_valid) {
            res.status(401).json({
                success: false,
                error: 1,
                msg: 'Authentication rejected.'
            });
            return;
        }

        req.user = auth.user;
        req.authorized = true;

        res.cookie('access_token', new_access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
            path: '/api/v1',
            maxAge: (settings.getAccessExpirationMinutes?.() || this.ACCESS_TOKEN_EXPIRATION_MINUTES) * 60000
        });

        res.cookie('csrf_token', csrf_token, {
            secure: true,
            sameSite: 'Lax',
            path: '/'
        });

        next();
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