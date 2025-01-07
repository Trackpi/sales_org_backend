const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    empId:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    accNo:{
        type:String,
        required:true
    },
    ifc:{
        type:String,
        required:true
    },
    bank:{
        type:String,
        required:true
    },
    branch:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["Employee", "Manager"],
        default:"Employee"
    },
}
)
const employee = new mongoose.model('employees', employeeSchema)
module.exports = employee