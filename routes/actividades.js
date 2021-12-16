const e = require('express');
var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

//Listar Actividades
router.get('/', function (req, res, next) {
    if (!req.session.ids) {
        res.render('login/index');
    } else {
        dbConn.query("select * from actividades order by actividad_id asc", function (err, rows) {

            if (err) {
                req.flash('error', err);
                // render to views/books/index.ejs
                res.render('actividades', { data: '' });
                console.log(rows);
            } else {
                // render to views/books/index.ejs
                res.locals.ids=req.session.ids;
                res.locals.cargo = req.session.cargo;
                res.locals.name = req.session.name;
                res.render('actividades', { data: rows });
            }
        });
    }
});

module.exports = router;