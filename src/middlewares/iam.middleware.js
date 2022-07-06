const adminAuth = require("../auth/admin.auth");

const verifyAccess = (allowed) => {
    return async (req, res, next) => {
        /* const bearerToken = req.headers["authorization"].split(" ")[1];
        if (bearerToken) {
            const accessClaim = await adminAuth.verifyUser(bearerToken);
            allowed.includes(accessClaim) ? next() : res.send({ msg: "Unauthorized!" });
        } else {
            res.send({ msg: "Unauthorized!" });
        } */
        req.accessClaim = "guest";
        next();
    };
};

module.exports = { verifyAccess };
