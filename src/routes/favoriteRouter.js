const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const Favorites = require('../models/favorite');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .populate("user dishes")
    .then(favorites => {
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    let dishes = req.body.map(dish => dish._id);
    Favorites.findOne({user: req.user._id})
    .then(user => {
        if(user !== null){
            dishes.forEach(dish => {
                if(user.dishes.indexOf(dish) == -1){
                    user.dishes.push(dish);
                }
            })
            user.save()
            .then(favorite => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            })
            .catch(err => next(err));
        }else{
            Favorites.create({user: req.user._id, dishes})
            .then(favorite => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            })
            .catch(err => next(err));
        }
    })
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorites.deleteOne({user: req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
})

favoriteRouter.route("/:dishId")
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorites.findOne({user: req.user._id})
    .then(user => {
        if(user !== null){
            if(user.dishes.indexOf(req.params.dishId) == -1){
                user.dishes.push(req.params.dishId);
            }
            user.save()
            .then(favorite => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            })
            .catch(err => next(err));
        }else{
            Favorites.create({user: req.user._id, dishes: [req.params.dishId]})
            .then(favorite => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            })
            .catch(err => next(err));
        }
    })
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorites.findOne({user: req.user._id})
    .then(user => {
        let dishes = user.dishes.filter(dish => dish.toString() !== req.params.dishId.toString());
        user.dishes = dishes;
        user.save()
        .then(favorite => {
            Favorites.findById(favorite._id)
            .populate('user')
            .populate('dishes')
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        })
        .catch(err => next(err));
    })
})

module.exports = favoriteRouter;