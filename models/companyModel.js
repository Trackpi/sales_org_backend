const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    legalname:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    contact: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type:String,
        default:"Company"
    },
    status:{
        type:String,
        default:"Active"
    }
}, {
    timestamps: true
});

const Company = new mongoose.model('company', companySchema);
module.exports = Company;