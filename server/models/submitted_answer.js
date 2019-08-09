var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    question_id : {type:String, require:true},
    user_id:{type:String, require:true},
    posted_answer:{type:String, require:true},
    qtype : {type : String},
    creation_dt:{type:Date, require:true}
});



module.exports = mongoose.model('PostedAnswer',schema);