const express = require('express');
const db = require('../Util/database');
const bcrypt = require('bcrypt');

//Todo:
//In the createUser function, check if the user already exists in the database.
//Add Authorisation for the user to login.
//Based on authorisation, add dynamic functionalities to update a user.


//Create User function:


const createUser = async (req, res, next) => {
    // Extract the user inputs and destructure them:
    const { email, password, firstName, lastName } = req.body;

    // Check if the email exists
    const emailAddrress = email.toLowerCase();
    const [result] = await db.query(`SELECT * FROM User where email = ?`, [emailAddrress]);
    if (result.length === 0) {
        // Generate salt for hashing:
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

                // Insert the user into the database
                db.execute('INSERT INTO User (email, password, firstName, lastName) VALUES (?, ?, ?, ?)', [emailAddrress, hashedPassword, firstName, lastName])
                    .then((result) => {
                        res.status(201).send("User Created!");
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        });
    } else {
        res.status(400).send("Email already exists");
    }
};

//Create User function:

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


//Function not working, fix it later:
//Function is working, add dynamic functionality:
const deleteUser = (req, res, next) => {
    // const { id } = req.body;
    // console.log(id);
    // if (!id) {
    //     throw new Error('No user found to be deleted!');
    // }
    // else {
    //     db.execute(`DELETE FROM User WHERE id = "12" LIMIT 1`)
    //         .then((result) => {
    //             res.status(202).send("User Deleted!");
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }
    db.execute("DELETE FROM User WHERE id = 15 LIMIT 1")
        .then((result) => {
            if (!result) {
                throw new Error("Nothing to be deleted in database!");
            }
            else {
                res.status(204).send("User Deleted");
            }
        })
        .catch(err => console.log(err));
}
//Function not working, fix it later:


//Update is working, add remaining checks and functionalities in the code:
const updateUser = (req, res, next) => {
    const { userId } = req.params;
    //Take user input to update the fields:
    const { email } = req.body
    //Check if email is null:
    if (!email) {
        throw new Error('Please fill the email field!');
    }
    else {
        db.execute(`UPDATE User SET email = "${email}", updated_at = NOW() WHERE id = ${userId}`)
            .then((result) => {
                res.status(200).send("User Updated!");
            })
            .catch(error => console.log(error));
    }
}
//Update is working, add remaining checks and functionalities in the code:




module.exports = {
    createUser,
    getUsers,
    deleteUser,
    updateUser,
    getAllUsers
}