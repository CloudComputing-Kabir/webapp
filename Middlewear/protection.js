const bcrypt = require("bcryptjs");
const database = require("../Util/database");

const protectRoute = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json("Authorisation is missing!");
    }
    const [, encodedAuth] = req.headers.authorization.split(" ");
    const decodedAuth = Buffer.from(encodedAuth, "base64").toString();
    const [username, passwordFromAuth] = decodedAuth.split(":");
    const { userId } = req.params;
    const [rows] = await database.query(
        "SELECT email, password FROM User WHERE id = ?",
        [userId]
    );
    const { username: dbUsername, password: dbPassword } = rows[0];
    if (dbUsername !== username) {
        return res.status(403).json({ msg: "Username does not match." });
    }
    if (!(await bcrypt.compare(passwordFromAuth, dbPassword))) {
        return res.status(403).json({ msg: "Password does not match" });
    }
    next();
};
module.exports = protectRoute;
