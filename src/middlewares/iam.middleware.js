const adminAuth = require("../auth/admin.auth");

const verifyAccess = (allowed) => {
    return async (req, res, next) => {
        try {
            if (!req.headers["authorization"]) {
                const response = { success: false, message: "Provide bearer (id) token!" };
                res.header("Content-Type", "application/json");
                res.status(400).send(JSON.stringify(response, null, 4));
                return;
            }
            const bearerToken = req.headers["authorization"].split(" ")[1];
            const verifyUserResponse = await adminAuth.verifyUser(bearerToken);
            if (!verifyUserResponse.success) {
                const response = { success: false, message: verifyUserResponse.message };
                res.header("Content-Type", "application/json");
                res.status(401).send(JSON.stringify(response, null, 4));
            } else if (allowed.includes(verifyUserResponse.accessClaim)) {
                req.accessClaim = verifyUserResponse.accessClaim;
                next();
            } else {
                const response = { success: false, message: "Unauthorized!" };
                res.header("Content-Type", "application/json");
                res.status(403).send(JSON.stringify(response, null, 4));
            }
        } catch (err) {
            errorLogger("DEBUG LOG ~ file: iam.middleware.js ~ return ~ err", err);
            const response = { success: false, message: err.message };
            res.header("Content-Type", "application/json");
            res.status(500).send(JSON.stringify(response, null, 4));
        }
    };
};

module.exports = { verifyAccess };
