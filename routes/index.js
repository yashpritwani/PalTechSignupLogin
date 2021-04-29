var express = require('express');
var multer = require('multer');
var path = require('path');
var usrmdl = require('../datamodules/userdata');
var router = express.Router();
var userdata = usrmdl.find({});
var userdata = usrmdl.find({});
var jwt = require('jsonwebtoken');
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

function checkLogin(req,res,next){
  try {
    var userToken = localStorage.getItem('userToken');
    var decoded = jwt.verify(token, 'userToken');
  } catch(err) {
    res.redirect('/login');
  }
}

function checkLogin(req,res,next){
  try {
    var userToken = localStorage.getItem('userToken');
    var decoded = jwt.verify(token, 'userToken');
  } catch(err) {
    res.redirect('/login');
  }
}

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function chkEmailDup( req, res, next){
  var email=req.body.email;
  var chkexstemail = usrmdl.findOne({email:email});
 
  chkexstemail.exec((err,data)=>{
    if (err) {
      res.render('signup',{});
    }
    if (data){
     res.render('signup', {success: 'Email alreasy exists try with another email', msg:'Email already exists'});
    }
    console.log(req.email);
    return next();
  });
}

function chkNameDup( req, res, next){
  var name=req.body.name;
  var chkexstname = usrmdl.findOne({name:name});
  chkexstname.exec((err,data)=>{
    if (err) {
      res.render('signup',{success:''});
    }
    if (data){
     res.render('signup', {success: 'Name alreasy exists try with right name', msg:'Email already exists'});
    }
    console.log(req.name);
    return next();
  });
}

router.use(express.static(__dirname+"./public/"));

router.get('/', function (req , res , next )
{
  userdata.exec(function(err , data){
    if(err) throw err;
    res.render('signup',{records:data , success:''});
  });
});

router.get('/logout', function (req , res)
{
    localStorage.removeItem('userToken');
    localStorage.removeItem('loginUser');
    res.redirect('/myweb');
});

router.get('/lrslt', checkLogin , function (req , res)
{
    var records=localStorage.getItem('loginUser');
    res.render('lrslt', {records:data});
});

router.post('/signup',chkNameDup,chkEmailDup, function(req , res , next) {
  var name=req.body.name;
  var email=req.body.email;
  var cno=req.body.cno;
  var dob=req.body.dob;
  var password=req.body.password;
  var cpassword=req.body.cpassword;
  if(password != cpassword){
    res.render('signup', {success: 'Password and confirm password does not match'});
  }
  else {
    password = req.body.password;
    cpassword = req.body.cpassword;
    console.log(password);
    var userdetails = new usrmdl({
    name: req.body.name,
    email: req.body.email,
    cno: req.body.cno,
    dob: req.body.dob,
    password: req.body.password,
    cpassword: req.body.cpassword,
});

userdetails.save(function(err , res1){
  if(err) throw err;
  res.render('signup',{success:'SIGNED IN SUCCESSFULLY...PLEASE LOGIN TO CONTINUE'});
});
}
});

router.post('/login', function(req,res) {
  console.log(req.body);
  
  var fltrEmail = req.body.email;
  var fltrPass = req.body.password;
  if(fltrEmail != '' && fltrPass != '' ){
    var fltrParam = { $and:[{ email:fltrEmail },{ password:fltrPass }]};
  }
  else{
    var fltrParam ={};
  }
  var userfilter = usrmdl.findOne( fltrParam );
      userfilter.exec((err , data1 )=>{
        if(err) {
            res.render('signup',{success: 'Invalid usename or password'});
        }
        else {
        var getUserID = data1._id;
        var name = userfilter.findOne( {name : name});
        var token = jwt.sign({ userID : getUserID }, 'Login Token');
        localStorage.setItem('userToken', token);
        localStorage.setItem('loginUser', name);
        userdata.exec(function(err , data){
          if(err) throw err;
        res.render('lrslt',{record1:data1 , records:data});
      });
        }
      });
  });

module.exports = router;
