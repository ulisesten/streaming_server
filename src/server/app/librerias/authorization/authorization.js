const jwt = require("../jwt/jwt.js");

class AuthorizationService {

    verify(req, res, next) {
        const authHeader = req.headers['authorization'];

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            res.json({
                success: false,
                error: 1,
                msg: 'No credentials are present.'
            });
            return;
        }

        const token = authHeader.split(' ')[1];

        let auth = jwt.gost_verify(token);

        if( !auth
            ||
            req.ip !== auth.user['ip'] 
            ||
            req.headers['user-agent'] !== auth.user['user_agent']
        ) {
            auth = null;
        }

        if(!auth) {
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

    /**
     * @deprecated 
     */
    authorize(req, res, next) {
        const authHeader = req.headers['authorization'];

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            res.json({
                success: false,
                error: 1,
                msg: 'No credentials are present.'
            });
            return;
        }

        const token = authHeader.split(' ')[1];
        let auth = jwt.gost_verify(token);

        if( req.ip !== auth.user['ip'] ) {
            auth = null;
        }

        if(!auth) {
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