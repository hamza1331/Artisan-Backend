const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    senderID:{
        type:String,
        required:true
    },
    receiverID:{
        type:String,
        required:true
    },
    text:{
        type:String
    },
    imageLink:{
        type:String
    },
    createdDate:{
        type:Date,
        default:Date.now()
    }
})

const ChatsSchema = new mongoose.Schema({
    messages:{
    type:[MessageSchema]
    },
    firebaseUID:{
    type:String,
    required:true
    }
});

module.exports = mongoose.model('Chats', ChatsSchema);