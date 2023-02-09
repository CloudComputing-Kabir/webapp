const express = require('express');
const db = require('../Util/database');
const bcrypt = require('bcrypt');
const Product = require('../Models/product');
const User = require('../Models/user');
const sequelize = require('../Util/databaseSequelize');
const { get } = require('../Routes/userRoutes');


//TODO:
//->Refactor User using Sequelize.

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
        getUser = await User.findOne({
            where: {
                id: userId
            }
        })
    }
    catch (error) {
        console.log(error);
    }
    if (!getUser) {
        return res.status(400).json({ message: "No user found" });
    }
    else {
        return res.status(200).json({ message: `User with id:${userId} found`, user: getUser })
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
        await User.update({
            first_name: first_name, last_name: last_name, password: password, updatedAt: new Date()
        }, {
            where: {
                id: userId
            }
        })
            .then((result) => {
                return res.status(201).json({ message: "User Updated sucessfully", result: result })
            })
            .catch(err => console.log(err));
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
    const { userId } = req.params;
    const { name, description, sku, maufacturer, quantity } = req.body;

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
            owner_user_id: userId,
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
    const { prodId, userId } = req.params;
    if (!name || !description || !sku || !maufacturer || !quantity) {
        return res.status(400).send("Please fill all the fields to update a product.");
    }
    let product;
    let existingProduct;
    try {
        product = await Product.findAll({ where: { productId: prodId, owner_user_id: userId } });
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
            await Product.update({ name, description, sku, maufacturer, quantity }, { where: { productId: prodId, owner_user_id: userId } })
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
    console.log("Result:", typeof (name));
    const { prodId, userId } = req.params;

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




    console.log("Exisiting product", exisitingProduct);
    console.log("Object of exisiting produt", exisitingProduct.name, exisitingProduct.description, exisitingProduct.sku, exisitingProduct.maufacturer, exisitingProduct.quantity);

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
                owner_user_id: userId
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
    console.log("Product id: ", prodId);
    let deleteProduct;
    try {
        deleteProduct = await Product.findOne({
            where: {
                productId: prodId
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
    productUpdatePatch
}