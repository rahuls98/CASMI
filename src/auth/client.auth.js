// https://firebase.google.com/docs/auth/web/start

const firebaseAuth = require("@firebase/auth");
const firebaseApp = require("@firebase/app");
const { FIREBASE_CONFIG } = require("../../config");

const app = firebaseApp.initializeApp(FIREBASE_CONFIG.WEB_APP_CONFIG);
const auth = firebaseAuth.getAuth(app);

/* const signUp = (userData) => {
    firebaseAuth
        .createUserWithEmailAndPassword(auth, userData.email, userData.password)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
}; */

const signIn = async (userData) => {
    firebaseAuth
        .signInWithEmailAndPassword(auth, userData.email, userData.password)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    try {
    } catch {}
};

module.exports = { signIn };
