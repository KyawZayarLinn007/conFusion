const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const feedbackRouter = express.Router();

feedbackRouter.use(bodyParser.json());

feedbackRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.cors, (req, res, next) => {
    res.statusCode = 200;
    res.json(req.body);
})

module.exports = feedbackRouter;