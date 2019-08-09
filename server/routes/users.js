var express = require('express');
var router = express.Router();
var User = require('../models/user');
var async = require("async");

/* REGISTER New User */
router.post('/register', function (req, res, next) {
  

  addToDB(req, res);
});

/* Function to SAVE New user */
async function addToDB(req, res) {

  var user = new User({
    firstname: req.body.fname,
    lastname: req.body.lname,
    cpf: req.body.cpf,
    email: req.body.email,
    creation_dt: Date.now()
  });

  try {
    doc = await user.save();
    return res.status(201).json(doc);
  }
  catch (err) {
    return res.status(501).json(err);
  }
}



/* Register New user if not exist */
router.post('/registeruser', function(req, res, next) {
  async.waterfall([
    function(done) {

      User.findOne({ "$or" : [ { "email" : req.body.email }, { "cpf" : req.body.cpf } ] }, function(err, user) {
        if (user) {
          return res.json('failed');
        }
        else{
          addToDB(req, res);
        }
      });
    }
  ], function(err) {
    if (err) return res.status(501).json(err);
  });
});



function isValidUser(req,res,next){
  if(req.isAuthenticated()) next();
  else return res.status(401).json({message:'Unauthorized Request'});
}

module.exports = router;
