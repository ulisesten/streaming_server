const { Router } = require("express");
const users = Router();
const usersDto = require("./dto/users_dto.js");
const usersDomain = require("./domain/users_domain.js");
const authService = require("../../../../core/authorization.js");
const jwtLib = require("../../../../core/jwt.js");
const crypto = require("crypto");
const { reject } = require("../../../../core/errors.js");

// www.dominio.com/api/v1/users

users.post("/", async function (req, res) {
    const db_res = await usersDomain.users_new(req);
    res.json(usersDto.user_new_response(db_res));
});

users.put("/:usu_id", async function (req, res) {
    const db_res = await usersDomain.users_update(req);
    res.json(usersDto.user_update_response(db_res));
});

users.get("/", authService.verify, async function (req, res) {
    const db_res = await usersDomain.users_get();
    res.json(usersDto.users_get_response(db_res));
});


users.post("/signin", usersDomain.user_signin.bind(usersDomain));

// Endpoint para refresh token
users.post("/refresh_token", authService.refresh.bind(authService), usersDomain.users_refresh_token.bind(usersDomain));


users.get("/info", authService.verify, async function (req, res) {
    if (!req.user) {
        reject(res, 401, "No autorizado");
    }

    const user_info = {
        usu_id: req.user.usu_id,
        usu_nombre: req.user.usu_nombre,
        usu_correo: req.user.correo
    }

    const info = {
        msg: "Información del usuario obtenida exitosamente.",
        success: true,
        error: 0,
        data: user_info
    }
    
    res.status(200).json(info);
});


module.exports = users;
