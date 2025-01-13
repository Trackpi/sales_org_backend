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
    designation:{
        type:String
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId, // Links to the Team model
        ref: 'Team',
        default: null, // Default to null for employees not assigned to any team
    },
}, {
    timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
