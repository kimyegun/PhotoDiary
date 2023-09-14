const express = require('express');
require('dotenv').config();
require('./db');
require('express-async-errors');
const app = express();
const morgan = require('morgan');
const PORT = process.env.PORT || 4000;
const cors = require('cors');

//라우터 post
const postRouter = require('./routers/post');

app.use(cors({origin: 'http://localhost:3000'}));
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/post', postRouter);

//오류, 에러 출력
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});

app.listen(PORT, ()=> {
    console.log(`${PORT}번 포트로 서버가 실행됩니다.`);
});