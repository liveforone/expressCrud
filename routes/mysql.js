// <mysql.js> //
//==dependencies==//
const express = require('express');
const router = express.Router();
const mysql = require('mysql');


//==routing==//
router.get('/', (req, res, next) => {
    //==db설정==//
    let connection = mysql.createConnection({ 
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '비번',
        database: 'board'
    });
    //==접속과 동시에 연결설정에 대한 확인==//
    connection.connect((err) => {
        if (err) {
            res.render('mysql', {connect : '연결실패', err : err});
            console.error(err);
            throw err;
        } else {
            res.render('mysql', {connect : '연결성공', err : '없음'});
        }
    });
    connection.end();
});

module.exports = router;