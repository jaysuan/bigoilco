const admin = require("firebase-admin");

const validateFirebaseIdToken = async (req, res, next) => {
    if ((!req.headers.authorization || !req.headers.authorization.startsWith("Bearer "))
            && !(req.cookies && req.cookies.__session)) {
        console.error("No Firebase ID token was passed as a Bearer token in the Authorization header.");
        res.status(401).json({
            message: "ID token not present in the Authorization header"
        });
        return;
    }

    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        idToken = req.headers.authorization.split("Bearer ")[1];
    } else if (req.cookies) {
        idToken = req.cookies.__session;
    } else {
        res.status(403).json({
            message: "Invalid Authorization header"
        });
        return;
    }

    try {
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        console.info("Decoded ID Token: ", decodedIdToken);
        req.user = decodedIdToken;
        next();
    } catch (error) {
        console.error("Error while decoding ID token");
        res.status(403).json({
            message: "Error decoding ID token"
        });
        return;
    }
}

const validateRole = (role) => (req, res, next) => {
    if (!req.user) {
        console.error("Error while decoding ID token");
        res.status(403).send("Unauthorized");
    }

    if (req.user.role === role || req.user.role === "Admin") {
        next();
    } else {
        res.status(403).send("Unauthorized");
    }
}

module.exports = {
    validateFirebaseIdToken,
    validateRole
}
