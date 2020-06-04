const express = require('express');
const bodyParser = require('body-parser');

const treatRouter = express.Router();

treatRouter.use(bodyParser.json());

treatRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the treats to you');
})
.post((req, res) => {
    res.end(`Will add the treat: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /treats');
})
.delete((req, res) => {
    res.end('Deleting all treats');
});

// route 
treatRouter.route('/:treatId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send details of the treat: ${req.params.treatId} to you`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /treats/${req.params.treatId}`);
})
.put((req, res) => {
    res.write(`Updating the treat: ${req.params.treatId}\n`);
    res.end(`Will update the treat: ${req.body.name}
        with description ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`Deleting treat: ${req.params.treatId}`);
});

module.exports = treatRouter;