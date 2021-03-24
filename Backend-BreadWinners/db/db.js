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
    console.log(typeof data.product_id);
    let product = data.product_id.toString();
    const query1 = pool.query(`SELECT jsonb_build_object(
        'product_id', product_id,
        'results', json_agg(
            jsonb_build_object(
                'question_id', q.id,
                'question_body', q.body,
                'question_date', q.date_written,
                'asker_name', q.asker_name,
                'question_helpfulness', q.helpful,
                'reported', q.reported
            )
        )
    ) questions
    FROM questions q
    LEFT OUTER JOIN answers a ON q.id = a.question_id
    LEFT OUTER JOIN photos ON a.id = photos.answer_id
    WHERE product_id = '5'
    GROUP BY product_id
    ;`)
    const query2 = pool.query(`SELECT * FROM answers WHERE question_id = 36 LIMIT 5`) // <==== THIS IS JSUT A TEST FOR PROMISE ALL BUT WILL BE TRYING TO ACCESS ANSWERS TABLE
    const arrayOfQueries = [query1, query2];
    Promise.all(arrayOfQueries)
        .then((results) => {
            console.log(results[0].rows);
            // was considering creating everything on server side but the query was super close to finish.
            const obj = {}
             cb(null, results.rows);
        })
        .catch((err) => {
            cb(err, null);
        });
}

module.exports = {
    pool,
    getProductQuestions,
};