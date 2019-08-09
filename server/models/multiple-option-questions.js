var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    question_title : {type:String, require:true},
    answer1:{type:String, require:true},
    answer2:{type:String, require:true},
    answer3:{type:String, require:true},
    answer4:{type:String},
    answer5:{type:String},
    correctanswer:{type:String},
    allowtime:{type:Number},
    qtype : {type : String, default : 'multi'},
    creation_dt:{type:Date, require:true}
});



module.exports = mongoose.model('MultipleOptionQuestion',schema);