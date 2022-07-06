// https://firebase.google.com/docs/auth/web/start

const firebaseAuth = require("@firebase/auth");
const firebaseApp = require("@firebase/app");
const { FIREBASE_CONFIG } = require("../../config");

const app = firebaseApp.initializeApp(FIREBASE_CONFIG.WEB_APP_CONFIG);
const auth = firebaseAuth.getAuth(app);

const signIn = async (userData) => {
    try {
        const response = await firebaseAuth.signInWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
        );
        return response;
    } catch (err) {
        console.log("DEBUG LOG ~ file: client.auth.js ~ signIn ~ err", err);
    }
};

module.exports = { signIn };
