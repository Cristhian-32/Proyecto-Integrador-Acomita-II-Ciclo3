var express = require('express');
const { locals } = require('../app');
var router = express.Router();
var dbConn = require('../lib/db');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/*GET Login */
router.post('/iniciar', function (req, res, next) {
  user = req.body.user;
  password = req.body.password

  dbConn.query("select * from socio so, users us, junta_directiva jd where so.socio_id=jd.socio_id and jd.socio_id=us.user_junta_directiva_id and user_usuario='" + user + "' and user_password='" + password + "'", function (err, rows) {

    if (err) {
      req.flash('error', err);
      console.log(err);
    } else {
      console.log(rows);
      if (rows.length) {
        console.log(rows[0]["junta_directiva_cargo"]);
        console.log(rows[0]["socio_nombres"]);
        console.log(rows[0]["user_id"])
        req.session.ids = rows[0]["user_id"];
        req.session.cargo = rows[0]["junta_directiva_cargo"];
        req.session.name = rows[0]["socio_nombres"];
        res.redirect("dashboard");
      } else {
        req.flash('success', 'No exist')
        res.redirect("/sign");
      }
    }
  });
});

router.get('/dashboard', function (req, res, next) {
  if (!req.session.ids) {
    res.render('login/index');
  } else {
    res.locals.ids=req.session.ids;
    res.locals.cargo=req.session.cargo;
    res.locals.name=req.session.name;
    res.render('login/dashboard');
  }
});

/*Go to Login */
router.get('/sign', function (req, res, next) {
  // render to add.ejs
  res.render('login/index', {
  })
});

/*Exit to Login */
router.get('/logout', function (req, res) {
  req.session.destroy();
  
  //res.render('login/index');
  res.redirect("login/index");
});

module.exports = router;
