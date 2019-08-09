var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    firstname : {type:String, require:true},
    lastname:{type:String, require:true},
    cpf : {type:String, require:true},
    email:{type:String, require:true},
    creation_dt:{type:Date, require:true}
});



module.exports = mongoose.model('RegisterCandidate',schema);