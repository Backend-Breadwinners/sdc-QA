const express = require('express');
const {getQuestions, postQuestion, postAnswer, questionHelpful, answerHelpful} = require('./controllers/questions');
const cors = require('cors');



const app = express();
app.use(express.json()); // => req.body
app.use(cors()) // Use this after the variable declaration



// Routes
app.get('/qa/questions', getQuestions);
app.post('/qa/questions', postQuestion);
app.post('/qa/questions/:question_id/answers', postAnswer);
app.put('/qa/questions/:question_id/helpful', questionHelpful);
// app.put('/qa/answers/:answer_id/helpful', answerHelpful);





app.listen(5000, () => console.log('server listening on port 5000'));

