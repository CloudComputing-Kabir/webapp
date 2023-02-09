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

  if (!product) {
    return res.status(401).json({ error: "Product not found." });
  }

  if (productID == product.productId) {
    return res.status(204).json({ message: "authorized to delete product." });
  }

  next();
};

module.exports = protectProductRoute;

