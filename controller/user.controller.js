const router = require('express').Router();
const connection = require('../db_config');
const isAdmin = require('./../middlewares/isAdmin');
const passwordHash = require('password-hash')

router.route('/staffs')
    .get(isAdmin, function(req,res,next){
        let sql = `SELECT * FROM users WHERE role = ?`;
        connection.query(sql, 'staff', function(err,staffs){
            if(err){
                return next(err)
            }
            res.json({
                data: staffs
            })
        })
    })

router.route('/staffs/:id')  
    .get(isAdmin, function(req,res,next){
        let sql = `SELECT * FROM users WHERE role = ? AND id = ?`;
        connection.query(sql, ['staff', req.params.id], function(err,staffs){
            if(err){
                return next(err)
            }
            res.json({
                data: staffs
            })
        })
    })
    .put(isAdmin, function(req,res,next){
        var name = req.body.name;
        var dept = req.body.dept;
        var username = req.body.username;
        var email = req.body.email;
        var password = passwordHash.generate(req.body.password)
        var id = req.params.id
        let sql = `UPDATE users SET name = "${name}", username = "${username}", dept = "${dept}", email = "${email}", password = "${password}" WHERE id = "${id}" AND role = "staff"`
        connection.query(sql, function(err, user) {
            if (err) {
                console.log(err);
                next({
                    msg: err,
                })
            }
            res.json({
                status: "Success",
                data: user
            })
        })
    })
    .delete(isAdmin, function(req,res,next){
        var id = req.params.id;

        var sql = `DELETE FROM users WHERE id = ?`
        connection.query(sql, id, function(err,removed){
            if(err){
                return next(err)
            }
            res.json({
                msg: "successfully removed",
                status: 200
            })
        })
    })

router.route('/students')
    .get(function(req,res,next){
        let sql = `SELECT * FROM users WHERE role = ?`;
        connection.query(sql, 'student', function(err,student){
            if(err){
                return next(err)
            }
            res.json({
                data: student
            })
        })
    })

router.route('/students/:id')
    .get(function(req,res,next){
        console.log('req ko params ko id herdim na ta  >>', req.params.id);
        let sql = `SELECT * FROM users WHERE role = ? AND id = ?`;
        connection.query(sql, ['student', req.params.id], function(err,student){
            if(err){
                return next(err)
            }
            res.json({
                data: student
            })
        })
    })

    .put(function(req,res,next){
        var name = req.body.name;
        var dept = req.body.dept;
        var username = req.body.username;
        var email = req.body.email;
        var password = passwordHash.generate(req.body.password)
        var id = req.params.id
        let sql = `UPDATE users SET name = "${name}", username = "${username}", dept = "${dept}", email = "${email}", password = "${password}" WHERE id = "${id}" AND role = "student"`
        connection.query(sql, function(err, user) {
            if (err) {
                console.log(err);
                next({
                    msg: err,
                })
            }
            res.json({
                status: "Success",
                data: user
            })
        })
    })

    .delete(function(req,res,next){
        var id = req.params.id;

        var sql = `DELETE FROM users WHERE id = ?`
        connection.query(sql, id, function(err,removed){
            if(err){
                return next(err)
            }
            res.json({
                msg: "successfully removed",
                status: 200
            })
        })
    })
  

module.exports = router;