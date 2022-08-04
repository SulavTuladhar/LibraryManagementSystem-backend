const router = require('express').Router();

// Importing 
const AuthRouter = require('./controller/auth.controller')
const BookRouter = require('./controller/book.controller')
const UserRouter = require('./controller/user.controller')

// middlewares
const authenticate = require('./middlewares/authenticate')
const isAdmin = require('./middlewares/isAdmin')

router.use('/auth', AuthRouter)
router.use('/user', authenticate,  UserRouter)
router.use('/book',  BookRouter)

module.exports = router;