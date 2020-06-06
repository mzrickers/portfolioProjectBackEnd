const express = require('express');
const bodyParser = require('body-parser');
const Treat = require('../models/treat');

const treatRouter = express.Router();

treatRouter.use(bodyParser.json());

//Used to Create, Read, or Delete a treat
treatRouter.route('/')
.get((req, res, next) => {
    Treat.find()
    .then(treats => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(treats);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Treat.create(req.body)
    .then(treat => {
        console.log('Treat Created ', treat);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(treat);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /treats');
})
.delete((req, res, next) => {
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
.get((req, res, next) => {
    Treat.findById(req.params.treatId)
    .then(treat => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(treat);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /treats/${req.params.treatId}`);
})
.put((req, res, next) => {
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
.delete((req, res, next) => {
    Treat.findByIdAndDelete(req.params.treatId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


// Before Weekly Assignment
// treatRouter.route('/')
// .all((req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
// .get((req, res) => {
//     res.end('Will send all the treats to you');
// })
// .post((req, res) => {
//     res.end(`Will add the treat: ${req.body.name} with description: ${req.body.description}`);
// })
// .put((req, res) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /treats');
// })
// .delete((req, res) => {
//     res.end('Deleting all treats');
// });

// // route 
// treatRouter.route('/:treatId')
// .all((req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
// .get((req, res) => {
//     res.end(`Will send details of the treat: ${req.params.treatId} to you`);
// })
// .post((req, res) => {
//     res.statusCode = 403;
//     res.end(`POST operation not supported on /treats/${req.params.treatId}`);
// })
// .put((req, res) => {
//     res.write(`Updating the treat: ${req.params.treatId}\n`);
//     res.end(`Will update the treat: ${req.body.name}
//         with description ${req.body.description}`);
// })
// .delete((req, res) => {
//     res.end(`Deleting treat: ${req.params.treatId}`);
// });

module.exports = treatRouter;