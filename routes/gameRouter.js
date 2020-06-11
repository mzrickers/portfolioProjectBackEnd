const express = require('express');
const bodyParser = require('body-parser');
const Game = require('../models/game');
const authenticate = require('../authenticate');

const gameRouter = express.Router();

gameRouter.use(bodyParser.json());


//Used to Create, Read, or Delete a game
gameRouter.route('/')
.get((req, res, next) => {
    Game.find()
    .populate('comments.author')
    .then(games => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(games);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
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
.delete(authenticate.verifyUser, (req, res, next) => {
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
.get((req, res, next) => {
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
.put(authenticate.verifyUser, (req, res, next) => {
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
.delete(authenticate.verifyUser, (req, res, next) => {
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
.get((req, res, next) => {
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
.post(authenticate.verifyUser, (req, res, next) => {
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
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /games/${req.params.gameId}/comments`);
})
.delete(authenticate.verifyUser, (req, res, next) => {
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

// Used to Read, Update or Delete a specific comment
gameRouter.route('/:gameId/comments/:commentId')
.get((req, res, next) => {
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
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /games/${req.params.gameId}/comments/${req.params.commentId}`);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Game.findById(req.params.gameId)
    .then(game => {
        if (game && game.comments.id(req.params.commentId)) {
            if (req.body.rating) {
                game.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.text) {
                game.comments.id(req.params.commentId).text = req.body.text;
            }
            game.save()
            .then(game => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(game);
            })
            .catch(err => next(err));
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
.delete(authenticate.verifyUser, (req, res, next) => {
    Game.findById(req.params.gameId)
    .then(game => {
        if (game && game.comments.id(req.params.commentId)) {
            game.comments.id(req.params.commentId).remove();
            game.save()
            .then(game => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(game);
            })
            .catch(err => next(err));
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