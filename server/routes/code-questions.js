var express = require('express');
var router = express.Router();
var CodeQuestion = require('../models/code-question');
var async = require("async");
var {ObjectID} = require('mongodb');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

/* GET Multiple Option Question List */
router.get('/dashboard', (req,res) =>{
  CodeQuestion.count().exec(function (err, count) {
    // Get a random entry
    var random = Math.floor(Math.random() * count)
  
    // Again query all users but only fetch one offset by our random #
    CodeQuestion.find().skip(random).limit(2).then((resultArray)=>{
        res.send(resultArray);
    },(err)=>{
        res.status(400).send(err);
    });
  })
});

/* GET Multiple Option Question List By ID */
router.get('/editcodequestion/:id',isValidUser, (req,res) =>{
  var id= req.params.id;
  if(!ObjectID.isValid(id)){
      return res.status(404).send();
  }

  CodeQuestion.findById(id).then((resultArray)=>{
      if(!resultArray){
        return res.status(404).send();
      }
      res.send(resultArray);
  },(err)=>{
      res.status(400).send(err);
  });
});

/* Update existing question */
router.post('/updatecodequestion',isValidUser, function(req, res) {
  CodeQuestion.findOneAndUpdate({_id:req.body.rid}, req.body, function (err, place) {
        res.send(place);
    });
});

/* Delete question*/
router.delete('/deletecodequestion/:id',isValidUser, function(req, res, next) {
  CodeQuestion.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* Validate the user authentication */
function isValidUser(req,res,next){
  if(req.isAuthenticated()) next();
  else return res.status(401).json({message:'Unauthorized Request'});
}

module.exports = router;
