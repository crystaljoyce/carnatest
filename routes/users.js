const express = require('express');
const usersRouter = express.Router();

const {createUser, getUser, getUserById, getUserByUsername, updateUser, getAllUsers} = require('../db')

const jwt = require('jsonwebtoken');
const {JWT_SECRET = 'nevertell'} = process.env;
const {requireUser, requireAdmin} = require('./utils');

usersRouter.post('/register', async (req, res, next) => {
    const {username, password, firstName, lastName, isAdmin=false, email} = req.body;

    try {
        const checkUser = await getUserByUsername(username);

        if (checkUser) {
            res.status(500).send({message: 'A user by that username already exists.'});
        } else if (password.length < 8) {
            res.status(500).send({message: 'Password must be a minimum of 8 characters.'});
        } else {

            const user = await createUser({firstName, lastName, email, isAdmin, username, password});
            const token = jwt.sign({
                id: user.id,
                username
            }, JWT_SECRET, {
                expiresIn: '1w'
            });

            res.send({
                user,
                token,
                message: 'Registered successfully'
            })
        }

    } catch (error) {
        next(error);
    }
})

usersRouter.post('/login', async (req, res, next) => {
    const {username, password} = req.body;

    if (!username || !password) {
        res.status(500).send({message: 'Please supply both a username and a password.'});
    }

    try {
        const user = await getUser({username, password});
        const token = jwt.sign({
            id: user.id,
            username
        }, JWT_SECRET, {
            expiresIn: '1w'
        });

        const passwordVerification = jwt.verify(token, JWT_SECRET);

        if (user && passwordVerification) {
            res.send({
                user,
                token,
                message: "You're logged in!"
            });
        } else {
            res.status(500).send({message: 'Username or password is incorrect.'});
        }

    } catch (error) {
        next(error);
    }
})

usersRouter.get('/me', async (req, res, next) => {
    try {
        const meData = await getUserById(req.user.id);
        res.send(meData);
    } catch (error) {
        next(error);
    }
})

usersRouter.get('/', requireAdmin, async (req, res, next) => {
    try {
        const users = await getAllUsers();

        res.send(users);
    } catch (error) {
        next(error);
    }
})

usersRouter.patch('/:userId', requireAdmin, async (req, res, next) => { 
    const { firstName, lastName, email, isAdmin, username, password} = req.body;
    const { userId } = req.params;

    const updateFields = {}; 

    if (firstName){
        updateFields.firstName = firstName
    }
    if(lastName){
        updateFields.lastName = lastName
    }
    if(email){
        updateFields.email = email
    }
    if(isAdmin === true || isAdmin === false){
        updateFields.isAdmin = isAdmin
    }
    if(username){
        updateFields.username = username
    }
    if(password){
        updateFields.password = password
    }
    try {
        const oldUser = await getUserById(userId);
        const user = await getUserByUsername(oldUser.username)

        if(user.id === Number(userId)){
            const updatedUser = await updateUser({id: userId, ...updateFields})

            res.send(updatedUser)
        } else {
            res.status(500).send({message: 'User update encountered an error.'});
        }

    } catch (error) {
        next(error)
    }
})


module.exports = usersRouter;
