const moongose =require('mongoose');
const Schema = moongose.Schema;


const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

User = moongose.model('User',userSchema);
module.exports = User;