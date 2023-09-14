const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/myblog')
.then(()=> console.log('db 연결됨'))
.catch((err)=>console.log('db연결중 에러가 발생함', err.message||err));