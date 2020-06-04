const express = require('express');
const bodyParser = require('body-parser');

const decorRouter = express.Router();

decorRouter.use(bodyParser.json());

decorRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the decors to you');
})
.post((req, res) => {
    res.end(`Will add the decor: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /decors');
})
.delete((req, res) => {
    res.end('Deleting all decors');
});

// route 
decorRouter.route('/:decorId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send details of the decor: ${req.params.decorId} to you`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /decors/${req.params.decorId}`);
})
.put((req, res) => {
    res.write(`Updating the decor: ${req.params.decorId}\n`);
    res.end(`Will update the decor: ${req.body.name}
        with description ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`Deleting decor: ${req.params.decorId}`);
});

module.exports = decorRouter;