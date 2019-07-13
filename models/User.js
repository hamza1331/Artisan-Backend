const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email:{
      type:String,
      required:[true,'Email is required']
  },
  fName:{
      type:String,
      rrequired:[true,'Full Name is required']
  },
  profilePic:{
      type:String
  },
  firebaseUID:{
      type:String,
      unique:true
  },
  isLoggedIn:{
      type:Boolean,
      default:false
  },
  createdDate:{
      type:Date,
      default:Date.now()
  },
  tokens:{
      type:[String]
  },
  country:{
      type:String
  }

});

module.exports = mongoose.model('Users', UserSchema);