const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema({
    city:{
        type:String
    },
    country:{
        type:String,
        default:"United States"
    },
    line1:{
        type:String
    },
    line2:{
        type:String
    },
    postal_code:{
        type:Number
    },
    state:{
        type:String
    }
})
const verificationDocument = new mongoose.Schema({
    back:{
        type:String
    },
    front:{
        type:String
    }
})
const dobSchema = new mongoose.Schema({
    day:{
        type:Number,
        default:1
    },
    month:{
        type:Number,
        default:1
    },
    year:{
        type:Number,
        default:1970
    }
})
const PaymentInfoSchema = new mongoose.Schema({
  email:{
      type:String,
      required:[true,'Email is required'],
      unique:true
  },
  first_name:{
      type:String,
      required:[true,'Full Name is required']
  },
  firebaseUID:{
      type:String
  },
  createdDate:{
      type:Date,
      default:Date.now()
  },
  last_name:{
      type:String,
      required:true
  },
  address:{
      type:addressSchema
  },
  businessType:{   
      type:String,
  },
  phone:{
      type:Number
  },
  dob:{
      type:dobSchema
  },
  ssn:{
      type:Number
  },
  state:{
      type:String
  },
  verification:{
    type:verificationDocument
  },
  industry:{
      type:String
  },
  businessWeb:{
      type:String
  },
  gender:{
      type:String
  }
});

module.exports = mongoose.model('PaymentInfo', PaymentInfoSchema);