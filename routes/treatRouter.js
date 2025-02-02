const express = require('express');
const bodyParser = require('body-parser');
const Treat = require('../models/treat');
const authenticate = require('../authenticate');
const cors = require('./cors');

const treatRouter = express.Router();

treatRouter.use(bodyParser.json());

//Used to Create, Read, or Delete a treat
treatRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Treat.find()
    .then(treats => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(treats);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Treat.create(req.body)
    .then(treat => {
        console.log('Treat Created ', treat);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(treat);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /treats');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Treat.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//Used to Read, Update, or Delete a specific treat
treatRouter.route('/:treatId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Treat.findById(req.params.treatId)
    .then(treat => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(treat);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /treats/${req.params.treatId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Treat.findByIdAndUpdate(req.params.treatId, {
        $set: req.body
    }, { new: true })
    .then(treat => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(treat);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Treat.findByIdAndDelete(req.params.treatId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = treatRouter;