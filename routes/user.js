import express from 'express';
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';

const usersRouter = express.Router();
const secretKey = process.env.SECRET_KEY || "auth-app";

usersRouter.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

usersRouter.route('/register').post((req, res) => {
    const first = req.body.first;
    const last = req.body.last;
    const email = req.body.email;
    const phone = req.body.phone;
    const secret = req.body.secret;

    const newUser = new User({first, last, email, phone, secret});

    newUser.save()
        .then(() => res.json(newUser))
        .catch(err => res.status(400).json('Error: ' + err));
});

usersRouter.route('/login').get((req, res) => {
    jwt.verify(req.headers['authorization'], secretKey, (err, user) => {
        if (err) {
            res.sendStatus(403);
        } else {
            User.findOne({email: user.email}).exec()
                .then(user => {
                    res.json(user);
                }).catch(err => res.status(400).json('Error: ' + err));
        }
    })
});

usersRouter.route('/:id').delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(event => res.json('User deleted.'))
        .catch(err => res.status(400).json('Error ' + err));
});

usersRouter.route('/update').post((req, res) => {
    jwt.verify(req.headers['authorization'], secretKey, (err, user) => {
        if (err) {
            res.sendStatus(403);
        } else {
            const filter = {email: user.email};
            const update = {
                first: req.body.first,
                last: req.body.last,
                phone: req.body.phone
            };
            User.findOneAndUpdate(filter, update, {new: true})
                .then(user => {
                    res.json(user);
                }).catch(err => res.status(400).json('Error: ' + err));
        }
    })
});

export default usersRouter;