var express = require('express');
var router = express.Router();
var CodeQuestion = require('../models/code-question');

var PostedAnswer =  require('../models/submitted_answer');

/* ADD New Question */
router.post('/addcodeanswer', function (req, res, next) {
  addToDB(req, res);
});

/* Function to SAVE New Answer Posted By Candidate */
async function addToDB(req, res) {
  var newanswer = new PostedAnswer({
    question_id : req.body.quizId,
    user_id:req.body.userId,
    posted_answer:req.body.answered,
    posted_output: req.body.output,
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

/* Validate the user authentication */
function isValidUser(req,res,next){
  if(req.isAuthenticated()) next();
  else return res.status(401).json({message:'Unauthorized Request'});
}

module.exports = router;
