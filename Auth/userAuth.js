const jwt = require("jsonwebtoken")

async function userAuth(req, res, next) {
    try {
        if (!req.cookies.userToken || req.cookies.userToken === "") {
            return res.status(401).json({ msg: "No token provided", error: "Authentication required" });
        }
        
        const user = jwt.verify(req.cookies.userToken, "secret");
        req.userEmail = user.email;
        next();
    } catch (error) {
        console.error("JWT verification error:", error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: "Invalid token", error: "Token is invalid" });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: "Token expired", error: "Token has expired" });
        } else {
            return res.status(500).json({ msg: "Authentication error", error: "Internal server error" });
        }
    }
}

module.exports = userAuth