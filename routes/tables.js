const e = require('express');
var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

//Listar Datos de socios/ stand

router.get('/', function (req, res, next) {
    if (!req.session.ids) {
        res.render('login/index');
    } else {
        dbConn.query("select stn.stand_numero, ss.socio_nombres, ss.socio_ap_paterno, act.actividad_sancion_importe from asistencia ast, socio_stand st, actividades act, socio ss, stand stn where ast.asistencia_stand_id = st.socio_stand_stand_id and ast.asistencia_actividad_id = act.actividad_id and st.socio_stand_socio_id = ss.socio_id and stn.stand_id = st.socio_stand_stand_id and ast.asistencia_estado = '0' order by stand_id asc", function (err, rows) {

            if (err) {
            req.flash('error', err);
            // render to views/books/index.ejs
            res.render('tables', { data: '' });
            console.log(rows);
        } else {
            // render to views/books/index.ejs
            res.locals.ids = req.session.ids;
            res.locals.cargo = req.session.cargo;
            res.locals.name = req.session.name;
            res.render('tables', { data: rows });
        }
    });
    }
});


module.exports = router;