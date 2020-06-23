const express = require('express');
const bodyParser = require('body-parser');
const Game = require('../models/game');
const authenticate = require('../authenticate');
const cors = require('./cors');

const gameRouter = express.Router();

gameRouter.use(bodyParser.json());


//Used to Create, Read, or Delete a game
gameRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Game.find()
    .populate('comments.author')
    .then(games => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(games);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Game.create(req.body)
    .then(game => {
        console.log('Game Created ', game);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(game);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /games');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Game.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//Used to Read, Update, or Delete a specific game
gameRouter.route('/:gameId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Game.findById(req.params.gameId)
    .populate('comments.author')
    .then(game => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(game);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /games/${req.params.gameId}`);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Game.findByIdAndUpdate(req.params.gameId, {
        $set: req.body
    }, { new: true })
    .then(game => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(game);
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Game.findByIdAndDelete(req.params.gameId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

// Used to Create, Read, or Delete comments from a specific game
gameRouter.route('/:gameId/comments')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Game.findById(req.params.gameId)
    .populate('comments.author')
    .then(game => {
        if (game) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(game.comments);
        } else {
            err = new Error(`Game ${req.params.gameId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Game.findById(req.params.gameId)
    .then(game => {
        if (game) {
            req.body.author = req.user._id;
            game.comments.push(req.body);
            game.save()
            .then(game => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(game);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Game ${req.params.gameId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /games/${req.params.gameId}/comments`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Game.findById(req.params.gameId)
    .then(game => {
        if (game) {
            for (let i = (game.comments.length-1); i >= 0; i--) {
                game.comments.id(game.comments[i]._id).remove();
            }
            game.save()
            .then(game => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(game);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Game ${req.params.gameId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

gameRouter.route('/:gameId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Game.findById(req.params.gameId)
    .populate('comments.author')
    .then(game => {
        if (game && game.comments.id(req.params.commentId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(game.comments.id(req.params.commentId));
        } else if (!game) {
            err = new Error(`Game ${req.params.gameId} not found`);
            err.status = 404;
            return next(err);    
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
 })
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /games/${req.params.gameId}/comments/${req.params.commentId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => 
{
    Game.findById(req.params.gameId)
    .then(game => 
    {
        if (game && game.comments.id(req.params.commentId)) 
        {
        if (game.comments.id(req.params.commentId).author._id.equals(req.user._id))
        { 
            if (req.body.rating) 
            {
                game.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.text) 
            {
                game.comments.id(req.params.commentId).text = req.body.text;
            }
            game.save()
            .then(game => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(game);
            })
            .catch(err => next(err));
        } else {
            const err = new Error('You are not authorized!');
            err.status = 403;
            return next(err);
        }
        } else if (!game) {
            err = new Error(`Game ${req.params.gameId} not found`);
            err.status = 404;
            return next(err);    
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
 })
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Game.findById(req.params.gameId)
    .then(game => 
    {
        if (game && game.comments.id(req.params.commentId)) 
        {
            const authorId = game.comments.id(req.params.commentId).author._id;
            if (authorId.equals(req.user._id))
            {
                game.comments.id(req.params.commentId).remove();
                game.save()
                .then(game => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(game);
                })
                .catch(err => next(err));
            } else {
                const err = new Error('You are not authorized');
                err.status = 403;
                return next(err);
            }
        } else if (!game) {
            err = new Error(`Game ${req.params.gameId} not found`);
            err.status = 404;
            return next(err);    
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
 });

module.exports = gameRouter;