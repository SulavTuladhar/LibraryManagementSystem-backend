const router = require('express').Router();
const connection = require('../db_config');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const config = require('./../configs/index')
const authenticate = require('./../middlewares/authenticate')
const isAdmin = require('./../middlewares/isAdmin')
// Create token 
function createToken(data) {
    let token = jwt.sign({
        _id: data.id,
        username: data.username
    }, config.JWT_SECRECT)
    return token
}

router.route('/login')
    .post(function(req, res, next) {
        console.log(req.body);
        var username = req.body.username;
        var password = req.body.password;
        let sql = `SELECT * FROM users WHERE username = ?`
        connection.query(sql, username, function(err, user) {
            console.log("What is user ho ta >> ", user.length);
            if (err) {
               return next(err)
            }
            if(user.length === 0){
                return next({
                    msg: "invalid Username",
                    status: 403  
                })
            }else{
                var isMatched = passwordHash.verify(password, user[0].password)
                if (isMatched) {
                    var token = createToken(user[0]);
                    res.json({
                        user: user[0],
                        token: token
                    })
                } else {
                    return next({
                        msg: "invalid Password",
                        status: 400
                    })
                }
            }
            //     console.log('user ko password >> ', user);
            
            
        })
    })

router.route('/adminLogin')
    .post(function(req, res, next) {
        var username = req.body.username;
        let sql = `SELECT * FROM admin WHERE username = ?`
        connection.query(sql, username, function(err, admin) {
            if (err) {
               return next(err)
            }
            if(admin.length == 0){
                return next({
                    msg: "invalid Username",
                    status: 403 
                })
            }
            console.log('admin >> ', admin);
            // Password verification
            var isMatched = passwordHash.verify(req.body.password, admin[0].password)
            if (isMatched) {
                var token = createToken(admin[0]);
                res.json({
                    user: admin[0],
                    token: token
                })
            } else {
                return next({
                    msg: "invalid Password",
                    status: 403
                })
            }

        })
    })


router.route('/adminRegister')
    .post(function(req,res,next){
        
        // There should only be one admin so first check if there is admin or not
        let sqlQuery = `SELECT * FROM admin`;
        connection.query(sqlQuery, function(err,admin){
            if(err){
                return next(err)
            }
            if(admin.length <= 0){
                var name = req.body.name;
                var password = passwordHash.generate(req.body.password);
                var username = req.body.username;
        
                let sql = `INSERT INTO admin (name, password, username) VALUES ("${name}", "${password}", "${username}")`;
                connection.query(sql, function(err, admin){
                    if(err){
                        next({
                            msg: err
                        })
                    }
                    res.json({
                        status: "Success",
                        data: admin
                    })
                })
            }else{
                return next({
                    msg: "Can't add more than 1 admin",
                    status: 403
                })
            }
        })

       
    })

router.route('/staffRegister')
    .post(authenticate, isAdmin, function(req, res, next) {
        var name = req.body.name;
        var dept = req.body.dept;
        var username = req.body.username;
        var email = req.body.email;
        var role = 'staff'
        var password = passwordHash.generate(req.body.password)
        let sql = `INSERT INTO users(name, dept, role, email, password, username) VALUES ("${name}", "${dept}", "${role}", "${email}", "${password}","${username}")`
        connection.query(sql, function(err, user) {
            if (err) {
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

router.route('/studentRegister')
    .post(authenticate, function(req, res, next) {
        var name = req.body.name;
        var dept = req.body.dept;
        var username = req.body.username;
        var email = req.body.email;
        var role = 'student'
        var password = passwordHash.generate(req.body.password)
        let sql = `INSERT INTO users(name, dept, role, email, password, username) VALUES ("${name}", "${dept}", "${role}", "${email}", "${password}","${username}")`
        connection.query(sql, function(err, user) {
            if (err) {
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

module.exports = router