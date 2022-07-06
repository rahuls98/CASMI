const clientAuth = require("../../auth/client.auth");
const errorLogger = require("../../helpers/error_logger");

const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const loginResponse = await clientAuth.signIn({ email, password });
        res.send({ success: true, data: loginResponse });
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ login ~ err", err);
    }
};

module.exports = { login };
