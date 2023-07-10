const route = require("express").Router();

const userController = require("../controllers/user.controller");

route.get("/details", userController.getUser);

route.post("/details", userController.addUser);

route.get("/details/:id", userController.getGroupUser);
route.put("/details/:id", userController.updateUser);
route.delete("/details/:id", userController.deleteUser);



module.exports = route;