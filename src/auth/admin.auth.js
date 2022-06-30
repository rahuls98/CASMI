// https://firebase.google.com/docs/admin/setup

const firebaseAdmin = require("firebase-admin");
const { FIREBASE_CONFIG } = require("../../config");
var serviceAccount = require(FIREBASE_CONFIG.SERVICE_ACCOUNT_KEY_FILE);

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});

const listUsers = () => {
    firebaseAdmin
        .auth()
        .listUsers(10)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
};

const createUser = (userData) => {
    firebaseAdmin
        .auth()
        .createUser({
            email: userData.email,
            emailVerified: true,
            password: userData.password,
            displayName: userData.name,
            disabled: false,
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
};

const setUserClaims = () => {
    firebaseAdmin
        .auth()
        .setCustomUserClaims("gwy7EXs1YJP6bD3Iilyz1gmMOLs1", { admin: null })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
};

const verifyUser = (idToken) => {
    firebaseAdmin
        .auth()
        .verifyIdToken(idToken)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
};

module.exports = { listUsers, createUser, setUserClaims, verifyUser };
