const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    dob:{
        type: String,
     },
    blood:{
        type: String,
     },
    location:{
        type: String,
     },
    address:{
        type: String,
     },
    pinCode:{
        type: Number,
     },
    city:{
        type: String,
     },
    country:{
        type: String,
      
    },
    image:{
        type: String,
        
    },    
    userType:{
        type: String,
        required:true
    },    
    date: {
        type: Date,
        default:Date.now()
      }
});

const user = mongoose.model('user', userSchema);
module.exports = user;
