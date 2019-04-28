const moongose =require('mongoose');
const Schema = moongose.Schema;


const ideaSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    dets:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

Idea = moongose.model('Idea',ideaSchema);
module.exports = Idea;