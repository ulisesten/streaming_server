const { Router } = require("express");
const users = Router();
const usersDto = require("./dto/users_dto.js");
const usersDomain = require("./domain/users_domain.js");
const authService = require("../../../../core/authorization.js");
const jwtLib = require("../../../../core/jwt.js");
const crypto = require("crypto");

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


users.post("/signin", usersDomain.user_signin);

// Endpoint para refresh token
users.post("/refresh_token", authService.refresh, usersDomain.users_refresh_token);


users.get("/:usu_id/address", async function (req, res) {
    const db_res = await usersDomain.users_address_get_one(req);
    res.json(db_res);
});


module.exports = users;