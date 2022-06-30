const clientAuth = require("../../auth/client.auth");

const login = (req, res) => {
    console.log(req.body);
    //const email = req.body.email;
    //const password = req.body.password;
    console.log(req.body?.email, req.body?.password);
    res.send({ msg: "OK!" });
    /* clientAuth.signIn({
        email,
        password,
    }); */
};

module.exports = { login };
