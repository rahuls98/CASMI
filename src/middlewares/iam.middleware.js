const adminAuth = require("../auth/admin.auth");

const verifyAccess = (allowed) => {
    return async (req, res, next) => {
        try {
            const bearerToken = req.headers["authorization"].split(" ")[1];
            if (!bearerToken) throw new Error("");

            const accessClaim = await adminAuth.verifyUser(bearerToken);
            if (allowed.includes(accessClaim)) {
                req.accessClaim = accessClaim;
                next();
            } else {
                res.status(403).send({ success: false, message: "Unauthorized!" });
            }
        } catch (err) {
            res.status(401).send({ success: false, message: "Unauthorized!" });
        }
    };
};

module.exports = { verifyAccess };
