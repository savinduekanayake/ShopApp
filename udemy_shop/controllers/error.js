exports.get404 = (req,res,next)=>{
    res.status(404).render('404',{layout:false, pageTitle:'Page not found', path:'/404'});
};