const Pool = require('pg').Pool;
require('dotenv').config();

const pool = new Pool({
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    port: process.env.PORT,
})


/*
Questions
id                serial NOT NULL,
 product_id        character varying(30) NOT NULL,
 body              character varying(500) NOT NULL,
 date_written      character varying(30) NOT NULL,
 asker_name        character varying(30) NOT NULL,
 asker_email       character varying(50) NOT NULL,
 reported      boolean NOT NULL,
 helpful       int NOT NULL,
 
Answers
question_id int NOT NULL,
 body        character varying(500) NOT NULL,
 date        character varying(30) NOT NULL,
 answer_name character varying(30) NOT NULL,
 answer_email character varying(100) NOT NULL,
 reported boolean NOT NULL,
 helpful int NOT NULL,
*/

const getProductQuestions = (data, cb) => {
    let count = data.count.toString();
    let product = data.product_id.toString();
    pool.query(`  
    SELECT jsonb_agg(questions) AS results
    FROM (
        SELECT
            questions.id AS question_id,
            questions.body,
            questions.helpful,
            questions.reported,
            questions.asker_name,
            questions.product_id,
            questions.asker_email,
            questions.date_written,
            (
                SELECT json_object_agg(id, nested_answers)
                FROM ( 
                    SELECT
                            answers.*,
                            (
                                    SELECT jsonb_build_object(nested_photos)
                                    FROM (
                                            SELECT
                                            photos.*
                                            FROM photos
                                            WHERE photos.answer_id = answers.id
                                    ) AS nested_photos
                            ) AS photos
                        FROM answers 
                        WHERE answers.question_id = questions.id
                ) AS nested_answers
            ) AS answers
        FROM questions
    ) AS questions
WHERE product_id = '${product}'
LIMIT '${count}'
    ;`)
        .then((results) => {
            // was considering creating everything on server side but the query was super close to finish.
            // console.log(results.rows[0]);
            results.rows[0].product_id = results.rows[0].results[0].product_id;
            // console.log(results.rows[0]);
            cb(null, results.rows[0]);
        })
        .catch((err) => {
            cb(err, null);
        });
}

const postQuestion = (data, cb) => {
    console.log('passed to db: ', data);
    const { body, name, email, product_id } = data;

    pool.query(`INSERT INTO questions(product_id,
        body, date_written, asker_name, asker_email, reported, helpful)
        VALUES($1, $2, current_timestamp, $3, $4, false, 0)
        `, [product_id, body, name, email])
        .then(() => {
            cb(null, 'Question Added!');
        })
        .catch((err) => {
            cb(err, null);
        })
}

const postAnswer = (data, cb) => {
    console.log('passed to db: ', data);
    const { body, name, email, question_id } = data;
    pool.query(`INSERT INTO answers(question_id,
        body, date, answer_name, answer_email, reported, helpful)
        VALUES($1, $2, current_timestamp, $3, $4, false, 0)
        `, [question_id, body, name, email])
        .then(() => {
            cb(null, 'Answer Added!');
        })
        .catch((err) => {
            cb(err, null);
        })
}

const questionHelpful = (data, cb) => {
    pool.query(`UPDATE questions SET helpful = helpful + 1 WHERE id = ($1)`, [data])
        .then(() => {
            cb(null, 'Helpful!')
        })
        .catch((err) => {
            cb(err, null);
        })
}

const answerHelpful = (data, cb) => {
    // pool.query(`UPDATE questions SET helpful = helpful + 1 WHERE id = ($1)`, [data]) 
    //     .then(() => {
    //         cb(null, 'Helpful!')
    //     })
    //     .catch((err) => {
    //         cb(err, null);
    //     })
}

module.exports = {
    pool,
    getProductQuestions,
    postQuestion,
    postAnswer,
    questionHelpful,
    answerHelpful,
};