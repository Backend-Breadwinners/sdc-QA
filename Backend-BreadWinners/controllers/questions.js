const pool = require('../db/db.js');
// const Attendee = require('../../db/models/Attendee');

const getQuestions = (req, res) => {
    console.log('request_query: ', req.query);
    pool.getProductQuestions(req.query, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
            res.send(results);
        }
    });
}


module.exports = {
    getQuestions,
};