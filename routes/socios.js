const e = require('express');
var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

//Listar Socios
router.get('/', function (req, res, next) {
    if (!req.session.ids) {
        res.render('login/index');
    } else {
        dbConn.query("select * from socio order by socio_id asc", function (err, rows) {

            if (err) {
                req.flash('error', err);
                // render to views/books/index.ejs
                res.render('socios', { data: '' });
                console.log(rows);
            } else {
                // render to views/books/index.ejs
                res.locals.ids=req.session.ids;
                res.locals.cargo = req.session.cargo;
                res.locals.name = req.session.name;
                res.render('socios', { data: rows });
            }
        });
    }
});

//Listar Datos de socios/ stand

router.get('/table', function (req, res, next) {
    if (!req.session.ids) {
        res.render('login/index');
    } else {
        dbConn.query("select * from socio", "select * from multa", function (err, rows) {

            if (err) {
                req.flash('error', err);
                // render to views/books/index.ejs
                res.render('socios/tablas', { data: '' });
                console.log(rows);
            } else {
                // render to views/books/index.ejs
                res.locals.ids=req.session.ids;
                res.locals.cargo = req.session.cargo;
                res.locals.name = req.session.name;
                res.render('socios/tablas', { data: rows });
            }
        });
    }
});

// mostrar tabla de nuevo socio
router.get('/add', function (req, res, next) {
    if (!req.session.ids) {
        res.render('login/index');
    } else {
        // render to add.ejs
        res.locals.ids=req.session.ids;
        res.locals.cargo = req.session.cargo;
        res.locals.name = req.session.name;
        res.render('socios/add', {
            socio_codigo: '',
            socio_nombres: '',
            socio_ap_paterno: '',
            socio_ap_materno: '',
            socio_fecha_nacimiento: '',
            socio_direccion: '',
            socio_telefono: ''
        })
    }
});

// agregar nuevo socio
router.post('/add', function (req, res, next) {

    let socio_codigo = req.body.socio_codigo;
    let socio_nombres = req.body.socio_nombres;
    let socio_ap_paterno = req.body.socio_ap_paterno;
    let socio_ap_materno = req.body.socio_ap_materno;
    let socio_fecha_nacimiento = req.body.socio_fecha_nacimiento;
    let socio_direccion = req.body.socio_direccion;
    let socio_telefono = req.body.socio_telefono;
    let errors = false;

    if (socio_codigo.length === 0 || socio_nombres.length === 0 || socio_ap_paterno.length === 0 ||
        socio_ap_materno.length === 0 || socio_fecha_nacimiento.length === 0 || socio_direccion.length === 0 || socio_telefono.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Campos Incompletos");
        // render to add.ejs with flash message
        res.render('socios/add', {
            socio_codigo: socio_codigo,
            socio_nombres: socio_nombres,
            socio_ap_paterno: socio_ap_paterno,
            socio_ap_materno: socio_ap_materno,
            socio_fecha_nacimiento: socio_fecha_nacimiento,
            socio_direccion: socio_direccion,
            socio_telefono: socio_telefono
        })
    }

    // if no error
    if (!errors) {

        var form_data = {
            socio_codigo: socio_codigo,
            socio_nombres: socio_nombres,
            socio_ap_paterno: socio_ap_paterno,
            socio_ap_materno: socio_ap_materno,
            socio_fecha_nacimiento: socio_fecha_nacimiento,
            socio_direccion: socio_direccion,
            socio_telefono: socio_telefono
        }

        // insert query
        dbConn.query("insert into socio set ?", form_data, function (err, result) {
            //if(err) throw errform_data.
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('socios/add', {
                    socio_codigo: form_data.socio_codigo,
                    socio_nombres: form_data.socio_nombres,
                    socio_ap_paterno: form_data.socio_ap_paterno,
                    socio_ap_materno: form_data.socio_ap_materno,
                    socio_fecha_nacimiento: form_data.socio_fecha_nacimiento,
                    socio_direccion: form_data.socio_direccion,
                    socio_telefono: form_data.socio_telefono
                })
            } else {
                req.flash('success', 'Datos insertados correctamente');
                res.redirect('/socios');
            }
        })
    }
});

//Mostrar sección edit
router.get('/edit/(:socio_id)', function (req, res, next) {
    if (!req.session.ids) {
        res.render('login/index');
    } else {
        let socio_id = req.params.socio_id;
        dbConn.query("select * from socio where socio_id = " + socio_id, function (err, rows, fields) {
            if (err) throw err

            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'Book not found with id = ' + socio_id)
                res.redirect('/socios')
            }
            // if book found
            else {
                // render to edit.ejs
                res.locals.ids=req.session.ids;
                res.locals.cargo = req.session.cargo;
                res.locals.name = req.session.name;
                res.render('socios/edit', {
                    title: 'Editar Socio',
                    socio_id: rows[0].socio_id,
                    socio_codigo: rows[0].socio_codigo,
                    socio_nombres: rows[0].socio_nombres,
                    socio_ap_paterno: rows[0].socio_ap_paterno,
                    socio_ap_materno: rows[0].socio_ap_materno,
                    socio_fecha_nacimiento: rows[0].socio_fecha_nacimiento,
                    socio_direccion: rows[0].socio_direccion,
                    socio_telefono: rows[0].socio_telefono
                })
            }
        })
    }
});

// Editar registro de socios
router.post('/update/:socio_id', function (req, res, next) {

    let socio_id = req.params.socio_id;
    let socio_codigo = req.body.socio_codigo;
    let socio_nombres = req.body.socio_nombres;
    let socio_ap_paterno = req.body.socio_ap_paterno;
    let socio_ap_materno = req.body.socio_ap_materno;
    let socio_fecha_nacimiento = req.body.socio_fecha_nacimiento;
    let socio_direccion = req.body.socio_direccion;
    let socio_telefono = req.body.socio_telefono;
    let errors = false;

    if (socio_codigo.length === 0 || socio_nombres.length === 0 || socio_ap_paterno.length === 0 ||
        socio_ap_materno.length === 0 || socio_fecha_nacimiento.length === 0 || socio_direccion.length === 0 || socio_telefono.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('socios/edit', {
            socio_id: req.params.socio_id,
            socio_codigo: socio_codigo,
            socio_nombres: socio_nombres,
            socio_ap_paterno: socio_ap_paterno,
            socio_ap_materno: socio_ap_materno,
            socio_fecha_nacimiento: socio_fecha_nacimiento,
            socio_direccion: socio_direccion,
            socio_telefono: socio_telefono
        })
    }

    // if no error
    if (!errors) {
        var form_data = {
            socio_codigo: socio_codigo,
            socio_nombres: socio_nombres,
            socio_ap_paterno: socio_ap_paterno,
            socio_ap_materno: socio_ap_materno,
            socio_fecha_nacimiento: socio_fecha_nacimiento,
            socio_direccion: socio_direccion,
            socio_telefono: socio_telefono
        }
        // update query
        dbConn.query('update socio set ? where socio_id = ' + socio_id, form_data, function (err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('socios/edit', {
                    socio_id: req.params.socio_id,
                    socio_codigo: form_data.socio_codigo,
                    socio_nombres: form_data.socio_nombres,
                    socio_ap_paterno: form_data.socio_ap_paterno,
                    socio_ap_materno: form_data.socio_ap_materno,
                    socio_fecha_nacimiento: form_data.socio_fecha_nacimiento,
                    socio_direccion: form_data.socio_direccion,
                    socio_telefono: form_data.socio_telefono
                })
            } else {
                req.flash('success', 'Book successfully updated');
                res.redirect('/socios');
            }
        })
    }
});

// Eliminar socio
router.get('/delete/(:socio_id)', function (req, res, next) {

    let id = req.params.socio_id;

    dbConn.query('delete from socio where socio_id = ' + id, function (err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/socios')
        } else {
            // set flash message
            req.flash('success', 'Book successfully deleted! ID = ' + id)
            // redirect to books page
            res.redirect('/socios')
        }
    })
});



module.exports = router;