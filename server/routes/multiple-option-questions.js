var express = require('express');
var router = express.Router();
var MultiQuestion = require('../models/multiple-option-questions');
var PostedAnswer =  require('../models/submitted_answer');

/* ADD New Answer */
router.post('/addmultianswer', function (req, res, next) {
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



/* Validate the user authentication */
function isValidUser(req,res,next){
  if(req.isAuthenticated()) next();
  else return res.status(401).json({message:'Unauthorized Request'});
}

module.exports = router;
