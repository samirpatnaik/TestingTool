var express = require('express');
var router = express.Router();
var MultiQuestion = require('../models/multiple-option-questions');
var PostedAnswer =  require('../models/submitted_answer');
var {ObjectID} = require('mongodb');

/* ADD New Question */
router.post('/addanswer', function (req, res, next) {
  addToDB(req, res);
});

/* Function to SAVE New Answer Posted By Candidate */
async function addToDB(req, res) {
  var newanswer = new PostedAnswer({
    question_id : req.body.quizId,
    user_id:req.body.userId,
    posted_answer:req.body.answered,
    qtype: req.body.qtype,
    creation_dt: Date.now()
  });
  try {
    doc = await newanswer.save();
    return res.status(201).json(doc);
  }
  catch (err) {
    return res.status(501).json(err);
  }
}

/* GET Multiple Option Question List */
router.get('/dashboard', (req,res) =>{
  MultiQuestion.count().exec(function (err, count) {
    // Get a random entry
    var random = Math.floor(Math.random() * count)
  
    // Again query all users but only fetch one offset by our random #
    MultiQuestion.find().skip(random).limit(3).then((resultArray)=>{
        res.send(resultArray);
    },(err)=>{
        res.status(400).send(err);
    });
  })

  
});

/* GET Multiple Option Question List By ID */
router.get('/editmultiquestion/:id',isValidUser, (req,res) =>{
  var id= req.params.id;
  if(!ObjectID.isValid(id)){
      return res.status(404).send();
  }

  MultiQuestion.findById(id).then((resultArray)=>{
      if(!resultArray){
        return res.status(404).send();
      }
      res.send(resultArray);
  },(err)=>{
      res.status(400).send(err);
  });
});

/* Update existing question */
router.post('/updatemultiquestion',isValidUser, function(req, res) {
    MultiQuestion.findOneAndUpdate({_id:req.body.rid}, req.body, function (err, place) {
        res.send(place);
    });
});

/* Delete question*/
router.delete('/deletemultiquestion/:id',isValidUser, function(req, res, next) {
  MultiQuestion.findByIdAndRemove(req.params.id, req.body, function (err, post) {
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
