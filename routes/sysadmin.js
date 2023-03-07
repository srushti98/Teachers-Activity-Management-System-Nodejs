var express = require('express');
var router = express.Router();
const bcrypt= require('bcryptjs');
const passport= require('passport');


let Sysadmin= require('../models/sysadmin');

router.get('/register',function (req,res) {
    res.render('adminregister');
});

router.post('/register',function (req,res) {
    const name=req.body.name;
    const email=req.body.email;
    const username=req.body.username;
    const password=req.body.password;
    const password2=req.body.password2;
    const code= req.body.code;

    req.checkBody('name','Name is required !!').notEmpty();
    req.checkBody('email','Email is required !!').notEmpty();
    req.checkBody('email','Email is not valid !!').isEmail();
    req.checkBody('username','Username is required !!').notEmpty();
    req.checkBody('code','Access-code is required !!').notEmpty();
    req.checkBody('password','password is required !!').notEmpty();
    req.checkBody('password2','password is not match!!').equals(req.body.password);

    let errors=req.validationErrors();

    if(errors){
        res.render('adminregister',{
            errors:errors
        });
    }else {

        let newUser=new Sysadmin({
            name:name,
            email:email,
            username:username,
            password:password,
            code:code
        });

        bcrypt.genSalt(10,function (err,salt) {

            bcrypt.hash(newUser.password,salt,function (err,hash) {
                if(err)         // HERE IS SOME CHANGE !!!!!!!!!
                {
                    console.log(err);
                }
                newUser.password=hash;
                newUser.save(function (err) {
                    if(err)
                    {
                        console.log(err);
                        return;
                    }
                    else{
                        req.flash('success','You are now successfully REGISTER and you may login now ..');
                        res.redirect('/sysadmin/login');
                    }

                });
            });
        });
    }


});



// login form
router.get('/login',function (req,res) {
    res.render('adminlogin1');
});



//login process
router.post('/login',function (req, res,next) {
    passport.authenticate('local',{
        //successRedirect: '/sidebar',
        //successRedirect: '/admin/search',
        //successRedirect: '/admin/search',
        successRedirect: '/expo/search',
        failureRedirect: '/sysadmin/login',
        failureFlash: true
    })(req, res,next);
});

//logout
router.get('/logout',function (req, res) {
    req.logout();
    req.flash('success','You are logged out');
    res.redirect('/sysadmin/login');
});


module.exports = router;