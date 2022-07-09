const adminAuth = require("../../auth/admin.auth");
const clientAuth = require("../../auth/client.auth");
const errorLogger = require("../../helpers/error_logger");
const validators = require("../../helpers/validators");

const createUser = async (req, res) => {
    const inputIsValid = () => {
        let requiredKeys = ["username", "password", "name", "user_type"];
        let allowedUserTypes = ["admin", "user", "guest"];
        let hasRequiredKeys = validators.hasKeys(req.body, requiredKeys);
        if (
            !hasRequiredKeys ||
            !validators.isNonEmptyString(req.body.username) ||
            !validators.isNonEmptyString(req.body.password) ||
            !validators.isNonEmptyString(req.body.name) ||
            !validators.isNonEmptyString(req.body.user_type) ||
            !allowedUserTypes.includes(req.body.user_type)
        )
            return false;
        return true;
    };
    try {
        if (!inputIsValid()) {
            const response = { success: false, message: "Insufficient/Invalid user data!" };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
        } else {
            const userData = {
                username: req.body.username,
                password: req.body.password,
                name: req.body.name,
                userType: req.body.user_type,
            };
            const createUserResponse = await adminAuth.createUser(userData);
            if (!createUserResponse.success) {
                const response = { success: false, message: createUserResponse.message };
                res.header("Content-Type", "application/json");
                res.status(401).send(JSON.stringify(response, null, 4));
            } else {
                const response = { success: true, user: createUserResponse.data };
                res.header("Content-Type", "application/json");
                res.status(201).send(JSON.stringify(response, null, 4));
            }
        }
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ createUser ~ err", err);
        const response = { success: false, message: err.message };
        res.header("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(response, null, 4));
    }
};

const loginUser = async (req, res) => {
    const inputIsValid = () => {
        let requiredKeys = ["username", "password"];
        let hasRequiredKeys = validators.hasKeys(req.body, requiredKeys);
        if (
            !hasRequiredKeys ||
            !validators.isNonEmptyString(req.body.username) ||
            !validators.isNonEmptyString(req.body.password)
        )
            return false;
        return true;
    };
    try {
        if (!inputIsValid()) {
            const response = { success: false, message: "Insufficient user data!" };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
        } else {
            const email = req.body.username;
            const password = req.body.password;
            const loginResponse = await clientAuth.loginUser({ email, password });
            if (!loginResponse.success) {
                const response = { success: false, message: loginResponse.message };
                res.header("Content-Type", "application/json");
                res.status(401).send(JSON.stringify(response, null, 4));
            } else {
                const response = { success: true, user: loginResponse.data };
                res.header("Content-Type", "application/json");
                res.status(200).send(JSON.stringify(response, null, 4));
            }
        }
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ loginUser ~ err", err);
        const response = { success: false, message: err.message };
        res.header("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(response, null, 4));
    }
};

module.exports = { createUser, loginUser };
