const router = require('express').Router();
const connection = require('../db_config');
const authenticate = require('../middlewares/authenticate');

router.route('/issued')
    .get(function(req,res,next){
        console.log("I am here");
        let sql = `SELECT * FROM books WHERE status = "issued"`
        connection.query(sql, function(err,books){
            if(err){
                return next(err)
            }
            console.log("books >>", books);
            res.json({
                data: books,
                status: 201
            })
        })
    })

    
router.route('/available')
.get(function(req,res,next){
    let sql = `SELECT * FROM books WHERE status = "available"`
    connection.query(sql, function(err,books){
        if(err){
            return next(err)
        }
        res.json({
            data: books,
            status: 201
        })
    })
})


router.route('/issue/:bid')
    .put(authenticate, function(req,res,next){
        console.log(req.body, req.params.bid);
        var return_date = req.body.return_date;
        var reader_id = req.body.reader_id;
        var status = 'issued';
        var bookId = req.params.bid;
        let sql = `UPDATE books SET return_date = "${return_date}", reader_id = "${reader_id}", status = "${status}" WHERE bid = ${bookId}`;
        connection.query(sql, function(err,book){
            if(err)
                return next(err)
            res.json({
                msg: "sucessfully issued",
                data: book
            })
            })
})
/* Updating the book status to available. */

router.route('/return/:bid')
    .put(authenticate, function(req,res,next){
        console.log('Book id >> ', req.params.bid);
        var return_date = "";
        var reader_id = "";
        var status = 'available';
        var bookId = req.params.bid;
      
        let sql = `UPDATE books SET return_date = "${return_date}", reader_id = "${reader_id}", status = "${status}" WHERE bid = ${bookId}`
        connection.query(sql, function(err,book){
            if(err){ 
                return next(err)
            }
            res.json({
                msg: 'Book Returned',
                data: book
            })
        })
    })

router.route('/')
    .get(function(req,res,next){
        let sql = `SELECT * FROM books`;
        connection.query(sql, function(err,books){
            if(err){
                return next(err)
            }
            res.json(books)
        })
    })
    .post(authenticate, function(req,res,next){
        var bid = req.body.bid;
        var name = req.body.name;
        var status = "available";
        // var return_date = req.body.return_date;
        // var reader_id = req.body.reader_id;

        var sql = `INSERT INTO books (bid, name, status) VALUES ("${bid}", "${name}", "${status}")`
        connection.query(sql, function(err,book){
            if(err){
                return next(err)
            }
            res.json({
                msg: "Successfully Added",
                status: 200
            })
        })
    })

router.route('/:id')
    .get(function(req,res,next){
        var id = req.params.id;
        var sql = `SELECT * FROM books WHERE bId = ?`

        connection.query(sql, id, function(err,book){
            if(err){
                return next(err)
            }
            res.json({
                data: book
            })
        })
    })

    .put(authenticate ,function(req,res,next){
        var name = req.body.name
        var bid = req.body.bid
        var id = req.params.id;
        var sql = `UPDATE books SET name = "${name}", bid = "${bid}" WHERE bid = "${id}" `

        connection.query(sql, function(err,book){
            if(err) return next(err)
            res.json({
                data: book
            })
        })
    })

    .delete(authenticate, function(req,res,next){
        var id = req.params.id;
    
        var sql = `DELETE FROM books WHERE bId = ?`
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