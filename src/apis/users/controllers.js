const adminAuth = require("../../auth/admin.auth");
const clientAuth = require("../../auth/client.auth");
const errorLogger = require("../../helpers/error_logger");
const validators = require("../../helpers/validators");

const createUser = async (req, res) => {
    const validateInput = () => {
        let requiredKeys = ["username", "password", "name", "user_type"];
        let allowedUserTypes = ["admin", "user", "guest"];
        let hasRequiredKeys = validators.hasKeys(req.body, requiredKeys);
        if (!hasRequiredKeys) return [false, "Insufficient data to perform request!"];
        if (
            !validators.isNonEmptyString(req.body.username) ||
            !validators.isNonEmptyString(req.body.password) ||
            !validators.isNonEmptyString(req.body.name) ||
            !validators.isNonEmptyString(req.body.user_type)
        )
            return [false, "Invalid user data!"];
        if (!allowedUserTypes.includes(req.body.user_type)) return [false, "Invalid user type!"];
        return [true, ""];
    };
    try {
        const validateInputResponse = validateInput();
        if (!validateInputResponse[0]) {
            const response = { success: false, message: validateInputResponse[1] };
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
    const validateInput = () => {
        let requiredKeys = ["username", "password"];
        let hasRequiredKeys = validators.hasKeys(req.body, requiredKeys);
        if (!hasRequiredKeys) return [false, "Insufficient data to perform request!"];
        if (
            !validators.isNonEmptyString(req.body.username) ||
            !validators.isNonEmptyString(req.body.password)
        )
            return [false, "Invalid user data!"];
        return [true, ""];
    };
    try {
        const validateInputResponse = validateInput();
        if (!validateInputResponse[0]) {
            const response = { success: false, message: validateInputResponse[1] };
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
