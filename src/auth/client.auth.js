// https://firebase.google.com/docs/auth/web/start

const firebaseAuth = require("@firebase/auth");
const firebaseApp = require("@firebase/app");
const firebaseConfig = require("../../firebase.config");
const errorLogger = require("../helpers/error_logger");

const app = firebaseApp.initializeApp(firebaseConfig.FIREBASE.CLIENT);
const auth = firebaseAuth.getAuth(app);

const loginUser = async (userData) => {
    try {
        const signInResponse = await firebaseAuth.signInWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
        );
        return {
            success: true,
            data: {
                uid: signInResponse.user.uid,
                name: signInResponse.user.displayName,
                username: signInResponse.user.email,
                id_token: signInResponse._tokenResponse.idToken,
            },
        };
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: client.auth.js ~ signIn ~ err", err);
        return {
            success: false,
            message: err.message,
        };
    }
};

module.exports = { loginUser };
