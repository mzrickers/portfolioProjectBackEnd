const express = require('express');
const bodyParser = require('body-parser');
const Decor = require('../models/decor');

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
.post((req, res, next) => {
    Decor.create(req.body)
    .then(decor => {
        console.log('Decor Created ', decor);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(decor);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /decors');
})
.delete((req, res, next) => {
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
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /decors/${req.params.decorId}`);
})
.put((req, res, next) => {
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
.delete((req, res, next) => {
    Decor.findByIdAndDelete(req.params.decorId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

// Before Weekly Assignment
// decorRouter.route('/')
// .all((req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
// .get((req, res) => {
//     res.end('Will send all the decors to you');
// })
// .post((req, res) => {
//     res.end(`Will add the decor: ${req.body.name} with description: ${req.body.description}`);
// })
// .put((req, res) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /decors');
// })
// .delete((req, res) => {
//     res.end('Deleting all decors');
// });

// // route 
// decorRouter.route('/:decorId')
// .all((req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
// .get((req, res) => {
//     res.end(`Will send details of the decor: ${req.params.decorId} to you`);
// })
// .post((req, res) => {
//     res.statusCode = 403;
//     res.end(`POST operation not supported on /decors/${req.params.decorId}`);
// })
// .put((req, res) => {
//     res.write(`Updating the decor: ${req.params.decorId}\n`);
//     res.end(`Will update the decor: ${req.body.name}
//         with description ${req.body.description}`);
// })
// .delete((req, res) => {
//     res.end(`Deleting decor: ${req.params.decorId}`);
// });

module.exports = decorRouter;