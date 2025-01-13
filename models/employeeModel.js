const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    empId: {
        type: String,
        default:1,
        required: [true, 'Employee ID is required'],
        unique: true,
        sparse: true
    },
    phone: {
        type: Number,
        required: [true, 'Phone number is required'],
    },
    accNo: {
        type: String,
        required: [true, 'Account number is required'],
        unique: true
    },
    accName:{
        type:String,
        required:[true,'Account name is required'],
    },
    ifc: {
        type: String,
        required: [true, 'IFSC code is required'],

    },
    bank: {
        type: String,
        required: [true, 'Bank name is required']
    },
    branch: {
        type: String,
        required: [true, 'Branch name is required']
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum:['Employee', 'Manager'],
        default: "Employee"
    },
    password:{
        type:String,
        required:[true, 'Password is required'],
    },
    teamId:{
        type:String,
    },
    designation:{
        type:String
    },
    buisnessCard:{
        type:String
    },
    empIdCard:{
        type:String
    },
    offerletter:{
        type:String
    },
    address:{
        type:String
    },
    location:{
        type:String
    },
    bloodGrp:{
        type:String
    },
    dob:{
        type:Date
    },
    city:{
        type:String
    },
    pin:{
        type:String
    },
    deletedAt: {
        type:Date,
        default:null
    }
}, {
    timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;