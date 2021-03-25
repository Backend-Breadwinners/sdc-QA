const pool = require('../db/db.js');
// const Attendee = require('../../db/models/Attendee');

const getQuestions = (req, res) => {
    // console.log('request_query: ', req.query);
    pool.getProductQuestions(req.query, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.send(results);
        }
    });
}

const postQuestion = (req, res) => {
    pool.postQuestion(req.body, (err, message) => {
        if (err) {
            console.log(err);
        } else {
            console.log(message);
            res.status(201).send(message);
        }
    });
}

const postAnswer = (req, res) => {
    pool.postAnswer(req.body, (err, message) => {
        if (err) {
            console.log(err);
        } else {
            console.log(message);
            res.status(201).send(message);
        }
    });
}

const questionHelpful = (req, res) => {
    pool.questionHelpful(req.params.question_id, (err, message) => {
        if (err) {
            console.log(err);
        } else {
            res.status(201).send(message);
        }
    })
}

const answerHelpful = (req, res) => {
    // pool.questionHelpful(req.params.question_id, (err, message) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         res.status(201).send(message);
    //     }
    // })
}

module.exports = {
    getQuestions,
    postQuestion,
    postAnswer,
    questionHelpful,
    answerHelpful,
};