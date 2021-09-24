const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcryptjs= require('bcryptjs');
const userSchema = new schema(
    {
        firstName: {
            type: String
        },

        lastName: {
            type: String
        },
        email:{
            type: String
        },
        mobileNumber:{
            type: String
        },
        countryCode:{
            type: String
        },
        userName:{
            type: String
        },
        password:{
            type: String
        },
        address:{
            type: String
        },
        dateOfBirth:{
            type: String
        },
        status: {
            type: String,
            enum: ["ACTIVE", "BLOCK", "DELETE"],
            default: "ACTIVE"
        },

        userType:{
            type: String,
            enum: ["ADMIN", "USER"],
            default: "USER"
        },
        otp: {
            type: String
        },
        otpTime: {
            type: String
        },
        otpVerification: {
            type: Boolean,
            default: false
        },
        emailVerification: {
            type: Boolean,
            default: false
        }
    },{timestamps: true}
)

module.exports= mongoose.model('user',userSchema);
mongoose.model("user", userSchema).findOne({ userType: "ADMIN" }, (error, result) => {
    if (error) {
        console.log("Internal server error");
    } else if (result) {
        console.log("ADMIN already exist");
    } else {
        var object = {
            firstName: "Sukesh",
            lastName: "Singh",
            email: "singhsukeshsk@gmail.com",
            mobileNumber: "8953483561",
            countryCode: "+91",
            userName: "Sukesh3561",
            password: bcryptjs.hashSync("12345"),
            address: " Noida",
            dateOfBirth: "06/12/1998",
            userType: "ADMIN",
        }
        mongoose.model("user", userSchema).create(object, (error, result) => {
            if (error) {
                console.log("Internal server error");
            }
            else {
                console.log("ADMIN successfully created");
            }
        })
    }
})

