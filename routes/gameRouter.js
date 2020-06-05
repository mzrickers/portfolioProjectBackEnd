const express = require('express');
const bodyParser = require('body-parser');
const Game = require('../models/game');

const gameRouter = express.Router();

gameRouter.use(bodyParser.json());

gameRouter.route('/')
.get((req, res, next) => {
    Game.find()
    .then(games => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(games);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Game.create(req.body)
    .then(game => {
        console.log('Game Created ', game);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(game);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /games');
})
.delete((req, res, next) => {
    Game.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

gameRouter.route('/:gameId')
.get((req, res, next) => {
    Game.findById(req.params.gameId)
    .then(game => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(game);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /games/${req.params.gameId}`);
})
.put((req, res, next) => {
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
.delete((req, res, next) => {
    Game.findByIdAndDelete(req.params.gameId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = gameRouter;