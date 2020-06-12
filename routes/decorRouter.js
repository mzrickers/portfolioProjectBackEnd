const express = require('express');
const bodyParser = require('body-parser');
const Decor = require('../models/decor');
const authenticate = require('../authenticate');

const decorRouter = express.Router();

decorRouter.use(bodyParser.json());

//Used to Create, Read, or Delete a decor
decorRouter.route('/')
.get((req, res, next) => {
    Decor.find()
    .then(decors => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(decors);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Decor.create(req.body)
    .then(decor => {
        console.log('Decor Created ', decor);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(decor);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /decors');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Decor.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//Used to Read, Update, or Delete a specific decor
decorRouter.route('/:decorId')
.get((req, res, next) => {
    Decor.findById(req.params.decorId)
    .then(decor => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(decor);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /decors/${req.params.decorId}`);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Decor.findByIdAndUpdate(req.params.decorId, {
        $set: req.body
    }, { new: true })
    .then(decor => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(decor);
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Decor.findByIdAndDelete(req.params.decorId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = decorRouter;