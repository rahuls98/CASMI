const adminAuth = require("../auth/admin.auth");

const verifyAccess = (allowed) => {
    return (req, res, next) => {
        if (req.body.idToken) {
            const accessClaim = adminAuth.verifyUser(req.body.idToken);
            allowed.includes(accessClaim) ? next() : res.send({ msg: "Unauthorized!" });
        } else {
            res.send({ msg: "Unauthorized!" });
        }
    };
};

module.exports = { verifyAccess };
