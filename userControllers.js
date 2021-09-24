const userModel = require('../models/userModel');
const commonFunction = require('../commonFunction/commonFunction');
const nodemailer=require("nodemailer");
const bcryptjs = require('bcryptjs');
module.exports = {
    signUp: (req, res) => {
        try {
            var query = { $and: [{ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }, { userName: req.body.userName }] }, { status: { $ne: "DELETE" }, userType: "USER" }] }
            userModel.findOne(query, (error, result) => {
                if (error) {
                    return res.send({ responseCode: 500, responseMessage: "Internal server error." })
                } else if (result) {
                    if (result.email == req.body.email) {
                        return res.send({ responseCode: 409, responseMessage: "Email already exists." })
                    } 
                    else {
                        return res.send({ responseCode: 409, responseMessage: "Mobile number already exists." })
                    }

                } else {

                    
                    var otp = commonFunction.getOtp();
                    const obj = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        mobileNumber: req.body.mobileNumber,
                        countryCode: req.body.countryCode,
                        userName: req.body.firstName + (req.body.mobileNumber).tostring().slice(-4),
                        address: req.body.address,
                        dateOfBirth: req.body.dateOfBirth,
                        password: bcryptjs.hashSync(req.body.password,12),
                        otp: otp,
                        otpTime: new Date().getTime()
                    }
                    
                    new userModel(obj).save((saveErr, saveRes) => {
                        if (saveErr) {
                            return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                        } else {
                            var subject = "OTP and Gmail Verification";
                            var dbid = saveRes._id;
                            var text = `please verify your account by using OTP: ${otp} and Email with Email link : http://localhost:5050/user/emailVerify/${dbid}`;
                            commonFunction.sendMail(obj.email, subject, text, (emailErr, emailRes) => {
                                if (emailErr) {
                                    return res.send({ responseCode: 500, responseMessage: "Internal server error", responseResult: emailErr })
                                } else {
                                    return res.send({ responseCode: 200, responseMessage: "Signup successfully completed", responseResult: saveRes })
                                }
                            })
                        }
                    })
                }
            })
        } catch (error) {
            return res.send({ responseCode: 501, responseMessage: "Something went wrong" })
        }
    },
    otpVerify: (req, res) => {
        try {
            var query = { $and: [{ $or: [{ email: req.body.user }, { mobileNumber: req.body.user }, { userName: req.body.user }] }, { status: { $ne: "DELETE" }, userType: "USER" }] }
            userModel.findOne(query, (error, result) => {
                if (error) {
                    return res.send({ responseCode: 500, responseMessage: "Internal server error" });
                } else if (!result) {
                    
                    return res.send({ responseCode: 404, responseMessage: "User doesn't exist" });
                } else {
                    if (result.otpVerification == true) {
                        return res.send({ responseCode: 200, responseMessage: "otp already verified" });
                    } else {
                        var time = new Date().getTime();
                        var dbTime = result.otpTime;
                        var otp = result.otp;
                        console.log(otp);
                        var diff = time - dbTime;
                        console.log("differnce", diff)
                        if (diff > 180000) {
                            return res.send({ responseCode: 405, responseMessage: "Otp expired." })
                        } else {
                            if (otp == req.body.otp) {
                                userModel.findOneAndUpdate({ _id: result._id }, { $set: { otpVerification: true } }, { new: true }, (updateErr, updateRes) => {
                                    if (updateErr) {
                                        return res.send({ responseCode: 500, responseMessage: "Internal server error." })
                                    } else {
                                        return res.send({ responseCode: 200, responseMessage: "OTP verification successfully done." })
                                    }
                                })
                            }
                            else {
                                return res.send({ responseCode: 402, responseMessage: "OTP mismatch" })
                            }
                        }
                    }
                }
            })
        } catch (error) {
            return res.send({ responseCode: 501, responseMessage: "Something went wrong" })
        }
    },
    otpResend: (req, res) => {
        try {
            var query = { $and: [{ $or: [{ email: req.body.user }, { mobileNumber: req.body.user }, { userName: req.body.user }] }, { status: { $ne: "DELETE" }, userType: "USER" }] }
            userModel.findOne(query, (error, result) => {
                if (error) {
                    return res.send({ responseCode: 500, responseMessage: "Internal server error." })
                } else if (!result) {
                    return res.send({ responseCode: 404, responseMessage: "User not found" })
                } else {
                    var otp = commonFunction.getOtp();
                    var otpTime = new Date().getTime();
                    userModel.findOneAndUpdate({ _id: result._id }, { $set: { otpVerification: false, otp: otp, otpTime: otpTime } }, { new: true }, (updateErr, updateRes) => {
                        if (updateErr) {
                            return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                        } else {
                            var subject = "Resend OTP for Verification";
                            var text = `please use OTP to verify your account with: ${otp}`;
                            commonFunction.sendMail(updateRes.email, subject, text, (emailErr, emailRes) => {
                                if (emailErr) {
                                    return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                                } else {
                                    return res.send({ responseCode: 200, responseMessage: "New OTP sent on email." })
                                }
                            })
                        }
                    })
                }
            })
        } catch (error) {
            return res.send({ responseCode: 501, responseMessage: "Something went wrong" })
        }
    },
    emailVerify: (req, res) => {

        try {
            var query = { _id: req.params.id }
            userModel.findOne(query, (error, result) => {
                if (error) {
                    return res.send({ responseCode: 500, responseMessage: "Internal server error." })
                } else if (!result) {
                    return res.send({ responseCode: 404, responseMessage: "User not found" })
                } else {
                    if (result.emailVerification == true) {
                        return res.send({ responseCode: 200, responseMessage: "Email already verified" })
                    } else {
                        userModel.findOneAndUpdate({ _id: result._id }, { $set: { emailVerification: true } }, { new: true }, (updateErr, updateRes) => {
                            if (updateErr) {
                                return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                            } else {
                                return res.send({ responseCode: 200, responseMessage: "Email verification successfully done." })
                            }
                        })
                    }
                }
            })
        } catch (error) {
            return res.send({ responseCode: 501, responseMessage: "Something went wrong" })
        }
    },
    forgotPassword: (req, res)=>{
        try{
            let query = {
                $and:[{$or:[{phoneNumber: req.body.phoneNumber}, {email: req.body.email}]}, {status:"ACTIVE"}]
            }
            userModel.findOne(query, (findError, findResult)=>{
                if(findError){
                    return res.send({responseCode: 501, responseMessage: "Internal server error"});
                } else if(!findResult){
                    return res.send({responseCode: 404, responseMessage: "user does't exist"});
                } else{
                    let otp = commonFunction.getOtp();
                    let otpTime = new Date().getTime();
                    userModel.findByIdAndUpdate({_id: findResult._id}, {$set:{otp: otp, otpTime: otpTime, otpVerify: false}}, {new: true}, (updateError, updateResult)=>{
                        if(updateError){
                            return res.send({responseCode: 501, responseMessage: "Internal server error"});
                        } else{
                            let subject = "verify your otp";
                            let text = `Dear ${findResult.firstName +" "+ findResult.lastName}, Please verify your otp: ${otp}`;
                            commonFunction.sendMail(findResult.email, subject, text, (sendMailError, sendMailResult)=>{
                                if(sendMailError){
                                    return res.send({responseCode: 501, responseMessage: "Internal server error"});
                                } else{
                                    return res.send({responseCode: 200, responseMessage: "Password Forgot successfully...."});
                                }
                            });
                        }
                    });
                }
            });
        } catch(error){
            return res.send({responseCode: 500, responseMessage: "server error"});
        }
    },
    resetPassword: (req, res)=>{
        try{
            let query = {
                $and:[{$or:[{phoneNumber: req.body.phoneNumber}, {email: req.body.email}]}, {status:"ACTIVE"}]
            }
            userModel.findOne(query, (findError, findResult)=>{
                if(findError){
                    return res.send({responseCode: 501, responseMessage: "Internal server error"});
                } else if(!findResult){
                    return res.send({responseCode: 404, responseMessage: "user does't exist"});
                } else{
                    if(findResult.otpVerify != true){
                        let otpTimeDifference = (new Date().getTime()) - findResult.otpTime;
                        if(otpTimeDifference <= (5 * 60 * 1000)){
                            if(req.body.password == req.body.confirmPassword){
                                userModel.findByIdAndUpdate({_id: findResult._id}, {$set:{otpVerify: true, password:bcryptjs.hashSync (req.body.password,145)}}, {new: true}, (updateError, updateResult)=>{
                                    if(updateError){
                                        return res.send({responseCode: 501, responseMessage: "Internal server error"});
                                    } else{
                                        return res.send({responseCode: 200, responseMessage: "Password reseted successfully....", responseResult: updateResult});
                                    }
                                });
                            } else{
                                return res.send({responseCode: 404, responseMessage: "Password and Confirm Password does't match"});
                            }
                        } else{
                            return res.send({responseCode: 401, responseMessage: "otp time has been expired, Please try again....."});
                        }
                    } else{
                        return res.send({responseCode: 402, responseMessage: "Password already reseted...."});
                    }
                }
            });
        } catch(error){
            return res.send({responseCode: 500, responseMessage: "server error"});
        }
    },
    userLogin: (req, res) => {
            try {
                var query = { $and: [{ $or: [{ email: req.body.user }, { mobileNumber: req.body.user }, { userName: req.body.user }] }, { status: { $ne: "DELETE" }, userType: "USER" }] }
                userModel.findOne(query, (error, result) => {
                    if (error) {
                        return res.send({ responseCode: 500, responseMessage: "Internal server error", responseMessage: error })
                    } else if (!result) {
                        return res.send({ responseCode: 404, responseMessage: "Data not found" })
                    } else {
                        if (result.otpVerification == true && result.emailVerification == true) {
                            Match = bcryptjs.compareSync(req.body.password, result.password)
                            if (Match == true) {
                                return res.send({ responseCode: 200, responseMessage: "You have successfully logged in." })
                            } else {
                                return res.send({ responseCode: 200, responseMessage: "You have entered wrong password." })
                            }
                        } else {
                            return res.send({ responseCode: 404, responseMessage: "First, you have to verify your account." })
                        }
                    }
                })
            } catch (error) {
                return res.send({ responseCode: 501, responseMessage: "Something went wrong" })
            }
     },

    editProfile: (req, res)=>{
                try{
                    let query1 = {
                        $and:[{_id: req.userId}, {userType: "USER"}]
                    }
                    userModel.findOne(query1, (findError, findResult)=>{
                        console.log(findResult)
                        if(findError){
                            return res.send({responseCode: 500, responseMessage: "Internal server error"});
                        } else if(!findResult){
                            return res.send({responseCode: 409, responseMessage: "User does't exist"});
                        } else{
                            let query2 = {
                                $and: [{$or:[{phoneNumber: req.body.phoneNumber}, {email: req.body.email}]}, {_id: {$ne: findResult._id}}, {status: {$ne: "DELETE"}}]
                            }
                            userModel.findOne(query2, (checkError, checkResult)=>{
                                if(checkError){
                                    return res.send({responseCode: 500, responseMessage: "Internal server error"});
                                } else if(checkResult){
                                    if(checkResult.phoneNumber == req.body.phoneNumber){
                                        return res.send({responseCode: 404, responseMessage: "Phone Number is already exist"});
                                    } else if(checkResult.email == req.body.email){
                                        return res.send({responseCode: 404, responseMessage: "Email is already exist"});
                                    }
                                } else{
                                    userModel.findByIdAndUpdate({_id: findResult._id}, {$set: req.body}, {new: true}, (updateError, updateResult)=>{
                                        if(updateError){
                                            return res.send({responseCode: 500, responseMessage: "Internal server error"});
                                        } else{
                                            return res.send({responseCode: 200, responseMessage: "Profile has been eddited successfully...", responseResult: updateResult});
                                        }
                                    });
                                }
                            });
                        }
                    });
                } catch(error){
                    return res.send({responseCode: 500, responseMessage: "Server error"});
                }
    },
    userView: (req, res) => {
                try {
                    var query = {
                        $or: [{ type: req.body.type }, { title: req.body.title }, { description: req.body.description },
                        {email: req.params.user }, { mobileNumber: req.params.user }, { userName: req.params.user }]
                    }
                    userModel.findOne(query, (error, result) => {
                        console.log(result);
                        if (error) {
                            return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                        }
                        else if (!result) {
                            return res.send({ responseCode: 404, responseMessage: "User not found" })
                        } else {
                            return res.send({ responseCode: 200, responseMessage: "Details fetched successfully", responseMessage: result })
                        }
                    })
                } catch (error) {
                    return res.send({ responseCode: 501, responseMessage: "Something went wrong" })
                }
     },
     
     userList: (req, res) => {
        try {
            userModel.find({ userType: "USER" }, (error, result) => {
                if (error) {
                    return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                } else if (result.length == 0) {
                    return res.send({ responseCode: 404, responseMessage: "Data not Found" })

                } else {
                    return res.send({ responseCode: 200, responseMessage: "Users List", responseMessage: result })

                }
            })
        } catch (error) {
            return res.send({ responseCode: 501, responseMessage: "Something went wrong" })
        }
    }
 }

        




    


