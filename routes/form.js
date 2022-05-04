// <form.js> //
//==dependencies==//
const express = require('express');
const router = express.Router();


//==routing==//
router.get('/', (req, res, next) => {
    res.render('form.ejs', {
        name: '보더코딩', //ejs파일의 <%%>에 담길 변수
        blog: '보더 코딩의 블로그',
        homepage: '보더코딩의 홈페이지'
    }); //render를 통해 form 파일을 읽음
});

router.post('/', (req, res, next) => {
    res.json(req.body);
});

module.exports = router;