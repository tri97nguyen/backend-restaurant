const express = require('express')
const favoriteRoute = express.Router()
const auth = require('../middlewares/auth')
const Favorites = require('../models/favorites')

/**
 * GET an authenticated user performs GET to get their list of favorites
 * cannot perform GET if not authenticated
 * get authenticated user's id to look up the favorite in db
 */

favoriteRoute.route('/')
    .all(auth.jwtAuthenticate)
    .get((req, res, next)=> {
        if (req.user) {
            Favorites.findOne({user: req.user._id})
                .then(fav => {
                    if (!fav) {
                        fav = Favorites.create({
                            user: req.user._id                            
                        })
                        .then(newFav => res.status(200).json(newFav))
                        .catch(error => next(error))
                    } else {
                        res.status(200).json(fav)
                    }
                })
                .catch(error => next(error))
        } else {
            next(new Error('something went wrong'))
        }
    })
    /**
     * POST user adds an array of favorite dishes via req.body
     * lookup favorite instance via user's id
     * add the new dishes to favorite's dishes field
     */
    .post((req, res, next) =>{
        if (req.user) {
            // todo
            Favorites.findOne({user: req.user._id})
            .then(fav => {
                if (!fav) {                        
                    fav = Favorites.create({
                        user: req.user._id,
                        dishes: req.body                         
                    })
                    .then(newFav => res.status(200).json(newFav))
                    .catch(error => next(error))
                } else {
                    console.log(`req.body is ${req.body}`)
                    console.log(`fav.dishes is ${fav.dishes}`)
                    req.body.forEach(dishId => {
                        if (fav.dishes.indexOf(dishId) === -1) {
                            fav.dishes.push(dishId)
                        }
                    })
                    fav.save()
                        .then(returnedfav => res.status(200).json(returnedfav))
                        .catch(error => next(error))                    
                }
            })
            .catch(error => next(error))        }
    })
    .delete((req, res, next) => {
        Favorites.findOne({user: req.user._id})
            .then(fav => {
                if (!fav) return next(new Error("you don't have any favorite dish"))
                fav.dishes = []
                fav.save()
                    .then(newFav => res.json(newFav))
                    .catch(error => next(error))
            })
            .catch(error => next(error))
    })

favoriteRoute.route('/:dishId')
    .all(auth.jwtAuthenticate)
    .post((req, res, next) => {
        if (req.user) {
            Favorites.findOne({user: req.user._id})
                .then(fav => {
                    if (!fav) {                        
                        fav = Favorites.create({
                            user: req.user._id,
                            dishes: [req.params.dishId]                            
                        })
                        .then(newFav => res.status(200).json(newFav))
                        .catch(error => next(error))
                    } else {
                        if (fav.dishes.indexOf(req.params.dishId) === -1) {
                            fav.dishes.push(req.params.dishId)
                            fav.save()
                                .then(returnedfav => res.status(200).json(returnedfav))
                                .catch(error => next(error))                              
                        } else return next(new Error('you already favorize this dish'))
                    }
                })
                .catch(error => next(error))
        } else {
            next(new Error('something went wrong'))
        }
    })
    .delete((req, res, next) => {
        if (req.user) {
            Favorites.findOne({user: req.user.id})
                .then(fav => {
                    if (!fav) return next(new Error('you have not had any favorite dishes'))
                    const index = fav.dishes.indexOf(req.params.dishId)
                    if (index === -1) return next(new Error('this dish is not your favorite'))
                    else {
                        fav.dishes.splice(index, 1)
                        fav.save()
                            .then(newFav => res.json(newFav))
                            .catch(error => next(error))
                    }
                })
                .catch(error => next(error))
        }
    })


module.exports = favoriteRoute