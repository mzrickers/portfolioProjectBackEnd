const express = require('express');
const bodyParser = require('body-parser');

const gameRouter = express.Router();

gameRouter.use(bodyParser.json());

gameRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the games to you');
})
.post((req, res) => {
    res.end(`Will add the game: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /games');
})
.delete((req, res) => {
    res.end('Deleting all games');
});

// route 
gameRouter.route('/:gameId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send details of the game: ${req.params.gameId} to you`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /games/${req.params.gameId}`);
})
.put((req, res) => {
    res.write(`Updating the game: ${req.params.gameId}\n`);
    res.end(`Will update the game: ${req.body.name}
        with description ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`Deleting game: ${req.params.gameId}`);
});

module.exports = gameRouter;