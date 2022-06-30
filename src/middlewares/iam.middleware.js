const adminAuth = require("../auth/admin.auth");

const verifyAccess = (allowedTypes) => {
    return (req, res, next) => {
        /* if (idToken) {
            const accessType = adminAuth.verifyUser(req.body.accessType)
            switch (accessType) {
                case 'admin': break;
                case 'programmatic': break;
                case 'guest': break;
            } 
            next();
        } else if (apiKey) {
            verify API key
            next();
        } else {
            res.send({ msg: "Unauthorized!" });
        } */

        console.log(allowedTypes);
        res.send({ msg: "Unauthorized!" });
    };
};

module.exports = { verifyAccess };
