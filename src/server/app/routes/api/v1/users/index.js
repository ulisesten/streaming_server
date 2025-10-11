const { Router } = require("express");
const users = Router();
const usersDto = require("./dto/users_dto.js");
const usersService = require("./service/users_service.js");
const usersDomain = require("./domain/users_domain.js");
const authService = require("../../../../librerias/authorization/authorization.js");
const sqlEject = require("../../../../librerias/sql_server/sql_eject.js");
const encryptService = require("../../../../librerias/encrypt/encrypt.js");

// www.dominio.com/api/v1/users

users.post("/", async function (req, res) {
    const db_res = await usersDomain.users_new(req);
    res.json(usersDto.user_new_response(db_res));
});

users.put("/:usu_id", async function (req, res) {
    const db_res = await usersDomain.users_update(req);
    res.json(usersDto.user_update_response(db_res));
});

users.get("/", authService.verify ,async function (req, res) {
    const db_res = await usersDomain.users_get();
    res.json(usersDto.users_get_response(db_res));
});

users.post("/signin", async function (req, res) {
    const contrasena = req.body.usu_contrasena;
    const db_res = await usersDomain.user_singin(req);

    const request = {
        ip: req.ip,
        user_agent: req.headers['user-agent']
    };

    const service_response = usersService.user_signin(request, db_res, contrasena);
    res.json(usersDto.user_signin_response(service_response));
});


users.get("/:usu_id/address", async function (req, res) {
    const db_res = await usersDomain.users_address_get_one(req);
    res.json(db_res);
});


module.exports = users;