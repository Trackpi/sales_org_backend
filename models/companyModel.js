const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    contact:{
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
    }
})

const company = new mongoose.model('company',companySchema)
module.exports = company;