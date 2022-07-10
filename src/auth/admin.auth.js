// https://firebase.google.com/docs/admin/setup

const firebaseAdmin = require("firebase-admin");
const firebaseConfig = require("../../firebase.config");
const errorLogger = require("../helpers/error_logger");

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseConfig.FIREBASE.ADMIN),
});

const createUser = async (userData) => {
    try {
        const adminAuth = firebaseAdmin.auth();
        const data = {
            disabled: false,
            emailVerified: true,
            email: userData.username,
            password: userData.password,
            displayName: userData.name,
        };
        const createUserResponse = await adminAuth.createUser(data);
        const userUid = createUserResponse.uid;
        await adminAuth.setCustomUserClaims(userUid, {
            access: userData.userType,
        });
        return {
            success: true,
            data: {
                uid: createUserResponse.uid,
                name: createUserResponse.displayName,
                username: createUserResponse.email,
            },
        };
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: admin.auth.js ~ createUser ~ err", err);
        return {
            success: false,
            message: err.message,
        };
    }
};

const verifyUser = async (idToken) => {
    try {
        let claims = await firebaseAdmin.auth().verifyIdToken(idToken);
        return {
            success: true,
            accessClaim: claims.access,
        };
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: admin.auth.js ~ verifyUser ~ err", err);
        return {
            success: false,
            message: err.message,
        };
    }
};

module.exports = { createUser, verifyUser };
