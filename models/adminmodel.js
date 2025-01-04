const  mongoose  = require("mongoose");



const adminSchema=new mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true,
    },
    adminType: {
        type:String,
        required:true,
    }
})


const adminModel=new mongoose.model('admins',adminSchema)

module.exports=adminModel