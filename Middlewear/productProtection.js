// const bcrypt = require("bcryptjs");
// const User = require("../Models/user");
// const Product = require("../Models/product");

// const protectProductRoute = async (req, res, next) => {
//     if (!req.headers.authorization) {
//         return res.status(401).json("Authorisation is missing!");
//     }
//     const [, encodedAuth] = req.headers.authorization.split(" ");
//     const decodedAuth = Buffer.from(encodedAuth, "base64").toString();
//     const [productID] = decodedAuth.split(":");

//     const { prodId } = req.params;//


//     const PRODUCTID = await Product.findOne({ 
//         where: {
//             productId: prodId//
//         }
//     });

//     const { productId: product } = PRODUCTID 

//     if (productID == product) {
//         return res.status(204).json({ msg: "Product deleted!" });
//     }
//     else {
//         return res.status(400).json({ message: "Unauthorised to delete a product" });
//     }
//     next();
// };
// module.exports = protectProductRoute;

const bcrypt = require("bcryptjs");
const Product = require("../Models/product");
const User = require("../Models/user");


const protectProductRoute = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Authorization is missing." });
  }

  const [, encodedAuth] = req.headers.authorization.split(" ");
  const decodedAuth = Buffer.from(encodedAuth, "base64").toString();
  const [productID] = decodedAuth.split(":");

  const { prodId } = req.params;

  const product = await Product.findOne({
    where: {
      productId: prodId
    }
  });

  const PRODUCTID = product.productId;
  console.log("PRODUCTID: ++", PRODUCTID);

  const OWNER_ID = product.owner_user_id;
  console.log("OWNER_ID: ++", OWNER_ID);

  req.OWNERID = OWNER_ID;

  //User Auth:


  const [, encodedAuthh] = req.headers.authorization.split(" ");
  const decodedAuthh = Buffer.from(encodedAuthh, "base64").toString();
  const [username, passwordFromAuth] = decodedAuthh.split(":");
  const user_ID = OWNER_ID;

  const USERID = await User.findOne({
    where: {
      id: user_ID
    }
  })

  const { username: userName, password: password } = USERID;

  if (userName !== username) {
    return res.status(403).json({ msg: "Username does not match." });
  }
  if (!(await bcrypt.compare(passwordFromAuth, password))) {
    return res.status(403).json({ msg: "Password does not match" });
  }
  // next();


  //User Auth:


  if (!product) {
    return res.status(401).json({ error: "Product not found." });
  }

  if (productID == product.productId) {
    return res.status(204).json({ message: "authorized to delete product." });
  }

  next();
};

module.exports = protectProductRoute;

