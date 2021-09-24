const mongoose = require('mongoose');
const schema = mongoose.Schema;
const staticSchema = new schema({
    type: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    }
}, { timestamps: true })
module.exports = mongoose.model('static', staticSchema);

mongoose.model('static', staticSchema).find({}, (staticErr, staticRes) => {
    if (staticErr) {
        console.log("Default static content error", staticErr);
    } else if (staticRes.length != 0) {
        console.log("Default static content already created.")
    } else {
        var obj1 = {
            type: "AboutUs",
            title: "About Us",
            description: "This is page about the love."
        }
        var obj2 = {
            type: "PrivacyPolicy",
            title: "Privacy Policy",
            description: "This is privacy policy page."
        }
        var obj3 = {
            type: "ContactUs",
            title: "Contact Us",
            description: "This is contact us page."
        }
       
        mongoose.model('static', staticSchema).create(obj1, obj2, obj3,  (createErr, createRes) => {
            if (createErr) {
                console.log("Defualt static content creation error", createErr);
            } else {
                console.log("Successfullly default static content created.", createRes)
            }
        })
    }
})