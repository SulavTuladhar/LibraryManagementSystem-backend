const jwt = require('jsonwebtoken');
const config = require('./../configs/index')
const connection = require('../db_config');

module.exports = function(req, res, next) {
    let token;
    if (req.headers['authorization'])
        token = req.headers['authorization']
    if (req.headers['x-access-token'])
        token = req.headers['x-access-token']
    if (req.query['token'])
        token = req.query['token']
    if (!token) {
        return next({
            msg: "Authentication Failed, Token not provided",
            status: 401
        })
    }
    
    // Token exists now validate
    jwt.verify(token, config.JWT_SECRECT, function(err, decoded) {
        if (err) {
            return next(err)
        }
        let sql;
        if(decoded._id){
            sql = `SELECT * FROM users WHERE username = "${decoded.username}" AND id = "${decoded._id}"`
        }else{
            sql = `SELECT * FROM admin WHERE username = "${decoded.username}"`
        }
        connection.query(sql, function(err, user) {
            if (err) {
                return next(err)
            }
            req.user = user[0]
            next();
        })
    })
}