const express = require('express');
const db = require('../Util/database');
const bcrypt = require('bcrypt');
const Product = require('../Models/product');
const User = require('../Models/user');
const Image = require('../Models/image');
const sequelize = require('../Util/databaseSequelize');
const { get, all, param } = require('../Routes/userRoutes');
const crypto = require('crypto');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
dotenv.config();



const randomImageName = (bytes = 6) => crypto.randomBytes(bytes).toString('hex');

//Start of User Routes:

//Create User function:
const userCreate = async (req, res, next) => {
    const { first_name, last_name, password, username } = req.body;

    if (!first_name || !last_name || !username || !password) {
        throw new Error("Please fill all the fields to add a User");
    }

    let existingUser;
    try {
        existingUser = await User.findOne({ where: { username } })
    }
    catch (error) {
        console.log(error);
    }

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    else {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                console.log(err);
                return;
            }

            // Hash the password:
            bcrypt.hash(password, salt, (err, hashedPassword) => {
                if (err) {
                    console.log(err);
                    return;
                }
                User.create({
                    first_name, last_name, password: hashedPassword, username
                })
                    .then((result) => {
                        console.log(result);
                        return res.status(201).json({ message: "User Created", result: result });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        });
    }
}
//Create User function:

//Get a single user:
const userGetAccount = async (req, res, next) => {
    const { userId } = req.params;
    let getUser;
    try {
        getUser = await User.findAll({
            where: {
                id: userId
            }
        })
    }
    catch (error) {
        console.log(error);
    }
    const { id, first_name, last_name, username, createdAt, updatedAt } = getUser[0];


    if (!getUser) {
        return res.status(400).json({ message: "No user found" });
    }
    else {
        return res.status(200).json({
            message: `User with id:${userId} found`,
            user: { id, first_name, last_name, username, createdAt, updatedAt }
        });

    }
}
//Get a single user:

//Get All Users Function:
const getAllUsers = async (req, res, next) => {
    await db.query('SELECT * from User').then((result) => {
        // const { email, firstName, lastName } = result;
        if (!result) {
            throw new Error('Empty Database!');
        }
        else {
            //Do not return password:
            res.status(200).json(result);
        }
    }).catch((error) => {
        console.log(error);
    });
}
//Get All Users Function:


//Get Users Function:
const getUsers = async (req, res, next) => {
    await db.query('SELECT * from User').then((result) => {
        const { email, firstName, lastName } = result;
        if (!result) {
            throw new Error('Empty Database!');
        }
        else {
            //Do not return password:
            res.status(200).json(result);
        }
    }).catch((error) => {
        console.log(error);
    });
}
//Get Users Function:

//Update User:
const userUpdate = async (req, res, next) => {
    const { first_name, last_name, password } = req.body;
    const { userId } = req.params;
    let existingUser;
    try {
        existingUser = await User.findOne({
            where: {
                id: userId
            }
        })
    }
    catch (error) {
        console.log(error);
    }
    if (!existingUser) {
        throw new Error("Invalid User, cant update details");
    }
    else {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                console.log(err);
                return;
            }
            // Hash the password:
            bcrypt.hash(password, salt, (err, hashedPassword) => {
                if (err) {
                    console.log(err);
                    return;
                }
                User.update({
                    first_name: first_name, last_name: last_name, password: hashedPassword, updatedAt: new Date()
                }, {
                    where: {
                        id: userId
                    }
                })
                    .then((result) => {
                        return res.status(201).json({ message: "User Updated sucessfully", result: result })
                    })
                    .catch(err => console.log(err));
            });
        });
    }
}
//Update User:

//End of User Routes:


//Product Routes:

//Get Products:
const getProducts = async (req, res, next) => {
    const { idProduct, name, description, sku, manufacturer, quantity } = req.body
    await db.query("SELECT * FROM Product")
        .then((result) => {
            if (result.length == 0) {
                throw new Error("Empty Database!");
            }
            else {
                res.status(200).json({ message: "List of Product", result });
            }
        })
        .catch((error) => {
            console.log(error)
        });
}
//Get Products:

//Add product function:
const addProduct = (req, res, next) => {

    const { name, description, sku, manufacturer, quantity } = req.body; //Extract data from body

    const { userId } = req.params; //Extract user id from parameter

    //Condition:
    if (!name || !description || !sku || !manufacturer) {
        throw new Error("Please fill all the fields"); //Throw error if all fields are filled
    }
    else {
        db.execute("INSERT INTO Product (name, description, sku, manufacturer, quantity, owner_user_id) VALUES (?, ?, ?, ?, ?, ?)", [name, description, sku, manufacturer, quantity, userId])
            .then((result) => {
                res.status(201).json({ message: "Product added", result: result });
            })
            .catch((error) => {
                console.log(error);
            })
    }
}
//Add product function:

//Update Product function:

const updateProduct = async (req, res, next) => {
    const { name, description, sku, manufacturer, quantity } = req.body;
    const { productId, userId } = req.params;

    const [storedId] = await db.query(`SELECT idProduct, owner_user_id FROM Product WHERE idProduct = ${productId} AND owner_user_id = ${userId}`);
    console.log(storedId);

    if (storedId.length == 0) {
        throw new Error("Invalid product or user");
    }
    else if (!name || !description || !sku || !manufacturer || !quantity) {
        throw new Error("Please fill all fields to update the product.");
    }
    else {
        db.query(`UPDATE Product SET name="${name}", description="${description}", sku="${sku}", manufacturer="${manufacturer}", quantity=${quantity}, date_last_updated=NOW() WHERE idProduct=${productId}`)
            .then((result) => {
                res.status(201).json({ message: "Product Updated", result: result });
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
//Update Product function:

//Delete Product function:
const deleteProduct = async (req, res, next) => {
    const { productId, userId } = req.params;
    const [isProduct] = await db.query(`SELECT * FROM Product where idProduct = ${productId} AND owner_user_id = ${userId}`);

    if (!isProduct) {
        throw new Error("Unable to delete Product! Invalid Userid or ProductId");
    }
    else {
        db.query(`DELETE from Product WHERE idProduct= ? AND owner_user_id = ?`, [productId, userId])
            .then((result) => {
                res.status(204).json({ message: "Product deleted", result: result });
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
//Delete Product function:

//************************************ *//

//Test Create Product:
const createProduct = async (req, res, next) => {
    // const { userId } = req.params;
    const { name, description, sku, maufacturer, quantity } = req.body;
    const USER_ID = req.USER_KI_ID;
    console.log("USERKI ID FROM CREATE PRODUCT CONTROLLER:", USER_ID);

    try {
        if (!name || !description || !sku || !maufacturer || !quantity) {
            return res.status(400).json({ message: "Please fill all the required fields" });
        } else if (quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than zero" });
        }

        const existingProduct = await Product.findOne({
            where: {
                sku
            }
        });
        if (existingProduct) {
            return res.status(400).json({ message: "A product with this SKU already exists" });
        }

        const newProduct = await Product.create({
            name,
            description,
            sku,
            maufacturer,
            quantity,
            owner_user_id: USER_ID,
        });

        return res.status(201).json({ message: "Product created", result: newProduct });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to create product" });
    }
};
//Test Create Product:

//Sequelize Update Product - PUT METHOD:
const productUpdate = async (req, res, next) => {
    const { name, description, sku, maufacturer, quantity } = req.body;
    const OWNER_ID = req.OWNERID;
    console.log("OWNERID FROM USERCONTROLLER:", OWNER_ID);
    const { prodId, userId } = req.params;
    if (!name || !description || !sku || !maufacturer || !quantity) {
        return res.status(400).send("Please fill all the fields to update a product.");
    }
    let product;
    let existingProduct;
    try {
        product = await Product.findAll({ where: { productId: prodId, owner_user_id: OWNER_ID } });
    } catch (error) {
        console.log(error);
    }
    if (!product) {
        return res.status(204).json({ message: "No product found to be updated" });
    }
    try {
        existingProduct = await Product.findOne({
            where: {
                sku
            }
        })
    }
    catch (error) {
        console.log(error);



        let NEWSKU;
        try {
            NEWSKU = await Product.findOne({
                where: {
                    sku: sku
                }
            })
        }
        catch (error) {
            console.log(error);
        }

        if (NEWSKU.productId !== exisitingProduct.productId) {
            return res.status(400).json({ message: "SKU already exists" })
        }

    }
    if (existingProduct) {
        return res.status(400).json({ message: "Cannot update product with similar Sku" });
    }
    else {
        try {
            await Product.update({ name, description, sku, maufacturer, quantity }, { where: { productId: prodId, owner_user_id: OWNER_ID } })
                .then(result => {
                    console.log(result);
                    return res.status(201).json({ message: "Product Updated" });
                })
                .catch((err) => console.log(err));
        }
        catch (error) {
            console.log(error);
        }
    }
}
//Sequelize Update Product - PUT METHOD:

//Sequelize Update Product - PATCH METHOD:

const productUpdatePatch = async (req, res, next) => {
    const { name, description, sku, maufacturer, quantity } = req.body;
    const { prodId } = req.params;
    const OWNERID = req.OWNERID;
    console.log("USERID FROM PATCH UPDATE:", OWNERID)

    let exisitingProduct;

    try {
        exisitingProduct = await Product.findOne({
            where: {
                productId: prodId
            }
        });
    }
    catch (error) {
        console.log(error);
    }



    let NEWSKU;
    try {
        NEWSKU = await Product.findOne({
            where: {
                sku: sku
            }
        })
    }
    catch (error) {
        console.log(error);
    }

    if (NEWSKU !== null && NEWSKU.productId !== exisitingProduct.productId) {
        return res.status(400).json({ message: "SKU already exists" })
    }


    let PATCHUPDATE;
    try {
        PATCHUPDATE = await Product.update({
            name: name === undefined || name === "" ? exisitingProduct.name : name,
            description: description === undefined || description === "" ? exisitingProduct.description : description,
            sku: sku === undefined || sku === "" ? exisitingProduct.sku : sku,
            maufacturer: maufacturer === undefined || sku === "" ? exisitingProduct.maufacturer : maufacturer,
            quantity: quantity === undefined ? exisitingProduct.quantity : quantity
        }, {
            where: {
                productId: prodId,
                owner_user_id: OWNERID
            }
        });
    }
    catch (error) {
        console.log(error);
    }

    if (!PATCHUPDATE) {
        return res.status(400).json({ message: "Error updating the product" });
    }
    else {
        return res.status(201).json({ message: "Product updated" });
    }
}

//Sequelize Update Product - PATCH METHOD:


//Delete Test:
const productDelete = async (req, res, next) => {
    const { prodId } = req.params;
    const OWNERID = req.OWNERID;
    console.log("OWNERID FROM USERCONTROLLER FOR DELETE:", OWNERID);
    console.log("Product id: ", prodId);
    let deleteProduct;
    try {
        deleteProduct = await Product.findOne({
            where: {
                productId: prodId, owner_user_id: OWNERID
            }
        })
    }
    catch (err) {
        console.log(err);
    }
    if (!deleteProduct) {
        res.status(401).send(`Product with id:${prodId} is not found`)
    }

    try {
        await Product.destroy({
            where: {
                productId: prodId
            }
        })
            .then(() => {
                res.status(204).send("Product deleted!")
            })
            .catch((err) => {
                console.log(err);
            })
    }
    catch (error) {
        console.log(error);
    }
}
//Delete Test:


//Get all product:

const getAllProduct = async (req, res, next) => {
    await Product.findAll().then((result) => {
        res.status(200).send(result)
    }).catch(err => console.log(err))
}
//Get all product:

//Get Single Product:
const getSingleProduct = async (req, res, next) => {
    const { prodId } = req.params;
    let singleProductFound;
    try {
        singleProductFound = await Product.findOne({
            where: {
                productId: prodId
            }
        });
    }
    catch (error) {
        console.log(error);
    }
    if (!singleProductFound) {
        return res.status(400).json({ message: "No product found" });
    }
    else {
        return res.status(200).json({ message: "Product found", product_detail: singleProductFound });
    }
}
//Get Single Product:

//Product Routes:

//***************************** */


// Image Routes Start ***************************** Image Routes Start */

const uploadDocument = async (req, res, next) => {
    const { productId } = req.params;
    const { fileName, s3_bucketPath } = req.body;
    const imageName = req.file;
    const mimeType = req.file.mimetype;
    console.log("Image URL: ", imageName)
    console.log("Content-type or the mimetype:", mimeType);

    const bucketName = process.env.BUCKET_NAME;
    const bucketRegion = process.env.BUCKET_REGION;



    //Assigning random name to the originalname by using randomName function:
    const randomName = randomImageName();

    //Create S3 Object:

    const s3 = new S3Client({
      
        region: bucketRegion,
    });

    if (!imageName) {
        return res.status(404).json({ message: "No image file found" });
    }

    if (!fileName) {
        return res.status(400).json({ message: "Please fill or upload required paths" });
    }


    //Putting image into S3:

    const params = {
        Bucket: bucketName,
        Key: randomName,
        Body: req.file.buffer,
        ContentType: mimeType
    }

    const command = new PutObjectCommand(params);

    await s3.send(command);

    let uploaded_document
    try {
        uploaded_document = await Image.create({
            productId: productId,
            fileName: imageName.originalname,
            s3_bucketPath: randomName,
        });
    }
    catch (error) {
        console.log(error);
    }

    try {
        if (!uploaded_document) {
            return res.status(400).json("Failed to upload document");
        }
        else {
            return res.status(200).json({ message: "Uploaded the document sucessfully", document: uploaded_document });
        }
    }
    catch (error) {
        console.log(error);
    }
}


const getAllDocuments = async (req, res, next) => {
    // const { productId } = req.params

    let allDocument;
    try {
        allDocument = await Image.findAll();
    }
    catch (error) {
        console.log(error);
    }

    if (!allDocument) {
        return res.status(404).json({ message: "No documents found!" });
    }
    else {
        return res.status(200).json({ mesage: "Documents found", listOfAllDocuments: allDocument });
    }
}

const getSingleDocument = async (req, res, next) => {
    const { productId, imageId } = req.params;
    if (!productId && !imageId) {
        return res.status(400).json({ message: "Parameters not pased properly" });
    }

    let singleDocument;

    try {
        singleDocument = await Image.findOne({
            where: {
                productId: productId,
                imageId: imageId
            }
        })
    }
    catch (error) {
        console.log(error);
    }

    if (!singleDocument) {
        return res.status(400).json({ message: "No document found" });
    }
    else {
        return res.status(200).json({ message: "Document found", document: singleDocument });
    }

}

const deleteDocument = async (req, res, next) => {
    const { productId, imageId } = req.params;

    const bucketName = process.env.BUCKET_NAME;
    const bucketRegion = process.env.BUCKET_REGION;
    const accessKey = process.env.ACCESS_KEY;
    const secretKey = process.env.SECRET_KEY;

    const s3 = new S3Client({
        credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
        },
        region: bucketRegion,
    });

    let deleteImageName;
    //Find id of image from database and store it in a variable:
    try {
        deleteImageName = await Image.findOne({
            where: {
                imageId: imageId
            }
        });
    }
    catch (error) {
        console.log(error);
    }


    //If image is not present, give a response:
    if (!deleteImageName) {
        return res.status(404).json({ message: "Couldnt find image" });
    }
    else {
        const s3BucketPath = deleteImageName.s3_bucketPath;
        const params = {
            Bucket: bucketName,
            Key: s3BucketPath,
        }
        const command = new DeleteObjectCommand(params);
        await s3.send(command);
    }

    let imageDeletedSucessfully;
    //Delete Image from database:
    try {
        imageDeletedSucessfully = await Image.destroy({
            where: {
                imageId: imageId
            }
        });
        return res.status(204).json({ message: "Image deleted sucessfully!" });
    }
    catch (error) {
        console.log(error);
    }



}

// Image Routes End ***************************** Image Routes End */


module.exports = {
    getUsers,
    getAllUsers,
    addProduct,
    updateProduct,
    getProducts,
    deleteProduct,
    createProduct,
    productUpdate,
    productDelete,
    getAllProduct,
    getSingleProduct,
    userCreate,
    userUpdate,
    userGetAccount,
    productUpdatePatch,
    uploadDocument,
    getAllDocuments,
    getSingleDocument,
    deleteDocument
}