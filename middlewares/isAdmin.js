module.exports = function(req,res,next){
    if(req.user.role){
        return next({
            msg: "You do not have permission to perform this action",
            status: 403
        })
    }else{  
        next();     
        
    }
}