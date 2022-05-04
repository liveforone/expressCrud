// <app.js> //
//==dependencies==//
const express = require('express');
const ejs = require('ejs');
const mysqlRouter = require('./routes/mysql');
const app = express();
const bodyParser = require('body-parser');


//==middle ware setting==//
app.set('view engine', 'ejs');  //뷰엔진으로 ejs사용
app.set('views', './views/');  //view 파일은 .views에 있다
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//==router setting==//
const formRouter = require('./routes/form');
const boardRouter = require('./routes/board');
app.use('/form', formRouter);
app.use('/mysql', mysqlRouter);
app.use('/board', boardRouter);


app.listen(3000);