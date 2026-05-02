const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.register = async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return next(new ApiError(400, "Username and password can not be empty"));
    }

    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.register({ username, password });
        if (!user) {
            return next(new ApiError(400, "Username already exists"));
        }
        return res.send({ message: "Register successfully", user });
    } catch (error) {
        return next(new ApiError(500, "An error occurred while registering"));
    }
};

exports.login = async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return next(new ApiError(400, "Username and password can not be empty"));
    }

    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.login({ username, password });
        if (!user) {
            return next(new ApiError(401, "Invalid username or password"));
        }
        return res.send({ message: "Login successfully", user });
    } catch (error) {
        return next(new ApiError(500, "An error occurred while logging in"));
    }
};
