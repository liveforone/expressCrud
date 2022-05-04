// <board.js> //
//==dependencies==//
const express = require('express');
const router = express.Router();
const mysql = require('mysql');


//==db connect, 설정 입력==//
const connection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : '비번',
    database : 'board' 
});


//==routing==//
router.get('/list', (req, res, next) => {
    res.redirect('/board/list/1');
});

//page 형식의 라우팅
router.get('/list/:page', (req, res, next) => {
    let page = req.params.page; //:page로 매핑할 req값
    let sql = "SELECT idx, name, title, date_format(modidate, '%Y-%m-%d %H:%i:%s') mididate, " +
        "date_format(regdate, '%Y-%m-%d %H:%i:%s') regdate from board";
        connection.query(sql, (err, rows) => { //select 쿼리문 날린 데이터를 rows 변수에 담는다
            if (err) console.error("err : " + err);
            res.render('list.ejs', {title : '게시판 리스트', rows : rows});
    });
});

router.get('/write', (req, res, next) => {
    res.render('write', {title : "게시판 글쓰기"});
});

router.post('/write', (req, res, next) => {
    let name = req.body.name;
    let title = req.body.title;
    let content = req.body.content;
    let passwd = req.body.passwd;
    let datas = [name, title, content, passwd];  //모든 데이터 배열로 묶기
    //req 객체로 body 속성에서 input 파라미터 가져오기
    let sql = "insert into board(name, title, content, regdate, modidate, passwd, hit) values(?, ?, ?, now(), now(), ?, 0)";
    connection.query(sql, datas, (err, rows) => {
        if (err) console.error("err : " + err);
        res.redirect('/board/list');
    });
});

router.get('/read/:idx', (req, res, next) => {
    let idx = req.params.idx;
    let sql = "SELECT idx, name, title, date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate, " +
        "date_format(regdate, '%Y-%m-%d %H:%i:%s') regdate, hit from board where idx=?";
        //한개의 글만조회하기때문에 마지막idx에 매개변수를 받는다
        connection.query(sql, [idx], (err, rows) => {
            if(err) console.error("err : " + err);
            res.render('read', {title : '글 상세보기', rows : rows[0]});  //첫번째행 한개의데이터만 랜더링 요청
        });
});

router.post('/update', (req, res, next) => {
    let idx = req.body.idx;
    let name = req.body.name;
    let title = req.body.title;
    let content = req.body.content;
    let passwd = req.body.passwd;
    let datas = [idx, name, title, content, passwd];

    let sql = "UPDATE board set name=?, title=?, content=?, modidate=now() where idx=? and passwd=?";
    connection.query(sql, datas, (err, result) => {
        if (err) console.error(err);
        //affectedRows  해당쿼리로 변경된수의 행 불러오기 0이면 업데이트 되지않으므로 비밀번호가 틀린것임
        if (result.affectedRows == 0) {  
            res.send("<script>alert('비밀번호가 일치하지 않습니다');history.back();</script>");
        } else {
            res.redirect('/board/read/' + idx);
        }
    });
});

// 게시글 리스트에 :page가 추가된것임
router.get('/page/:page', (req, res, next) => {
    let page = req.params.page;  // 현재 페이지는 params 을 req 요청받아옴
    let sql = "select idx, name, title, date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate, " +
        "date_format(regdate, '%Y-%m-%d %H:%i:%s') regdate, hit from board";

    connection.query(sql, (err, rows) => {
        if (err) console.error("err : " + err);
        res.render('page', {title : '글 목록', rows : rows, page : page, length : rows.length - 1, page_num : 10, pass : true});
        /*
        length 데이터 전체넘버 랜더링,
        -1을 한이유는 db에서는1부터지만 for문에서는 0부터 시작 ,
        page_num: 한페이지에 보여줄 갯수
        */
       console.log(rows.length - 1);
    });
});

router.post('/delete', (req, res, next) => {
    let idx = req.body.idx;
    let passwd = req.body.passwd;
    let datas = [idx, passwd];

    let sql = "delete from board where idx=? and passwd=?";
    connection.query(sql, datas, (err, result) => {
        if (err) console.error(err);
        if (result.affectedRows == 0) {
            res.send("<script>alert('패스워드가 일치하지 않습니다.');history.back();</script>");
        } else {
            res.redirect('/board/list');
        }
    });
});

module.exports = router;