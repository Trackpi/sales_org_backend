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
        default:''
    },
    blood:{
        type: String,
        default:''
    },
    location:{
        type: String,
        default:''
    },
    address:{
        type: String,
        default:''
    },
    pinCode:{
        type: Number,
        default:''
    },
    city:{
        type: String,
        default:''
    },
    country:{
        type: String,
        default:''
    },
    image:{
        type: String,
        default:''
    },

    
});

const user = mongoose.model('user', userSchema);
module.exports = user;
