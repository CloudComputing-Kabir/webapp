const bcrypt = require("bcryptjs");
const User = require("../Models/user");

const protectRoute = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json("Authorisation is missing!");
    }
    const [, encodedAuth] = req.headers.authorization.split(" ");
    const decodedAuth = Buffer.from(encodedAuth, "base64").toString();
    const [username, passwordFromAuth] = decodedAuth.split(":");
    const { userId } = req.params;

    const USERID = await User.findOne({
        where: {
            id: userId
        }
    })

    const { username: userName, password: password } = USERID;

    if (userName !== username) {
        return res.status(403).json({ msg: "Username does not match." });
    }
    if (!(await bcrypt.compare(passwordFromAuth, password))) {
        return res.status(403).json({ msg: "Password does not match" });
    }
    next();
};
module.exports = protectRoute;
