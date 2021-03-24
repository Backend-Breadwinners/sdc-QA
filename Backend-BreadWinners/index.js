const express = require('express');
const {getQuestions} = require('./controllers/questions');



const app = express();
app.use(express.json()); // => req.body



// Routes
app.get('/qa/questions', getQuestions);





app.listen(3000, () => console.log('server listening on port 3000'));

