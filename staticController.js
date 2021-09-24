const staticModel = require('../models/staticModel');






module.exports={
    staticList: (req, res) => {
                try {
                    staticModel.find({ status: "ACTIVE" }, (error, result) => {
                        if (error) {
                            return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                        } else if (result.length == 0) {
                            return res.send({ responseCode: 404, responseMessage: "Data not Found" })
                        } else {
                            return res.send({ responseCode: 200, responseMessage: "Static data List", responseMessage: result })
                        }
                    })
                } catch (error) {
                    return res.send({ responseCode: 501, responseMessage: "Something went wrong" })
                }
    },
    staticView: (req, res) => {
                try {
                    var query = { $or: [{ type: req.params.type }, { type: req.body.type }] }
                    staticModel.findOne(query, (error, result) => {
                        if (error) {
                            return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                        } else if (!result) {
                            return res.send({ responseCode: 404, responseMessage: "data type not found" })
                        } else {
                            return res.send({ responseCode: 200, responseMessage: "Details fetched successfully", responseMessage: result })
                        }
                    })
                } catch (error) {
                    return res.send({ responseCode: 501, responseMessage: "Something went wrong" })
                }
    },
    editStatic: (req, res) => {
                try {
                    var query = { $or: [{ type: req.body.type }] }
                    staticModel.findOne(query, (error, result) => {
                        if (error) {
                            return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                        } else if (!result) {
                            return res.send({ responseCode: 404, responseMessage: "Data not found" })
                        }
                        else {
                            staticModel.findOneAndUpdate({ _id: result._id }, { $set: req.body }, { new: true }, (error, result) => {
                                if (error) {
                                    return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                                } else {
                                    return res.send({ responseCode: 200, responseMessage: "Data Updated successfully" })
                                }
                            })
                        }
                    })
                } catch (error) {
                    return res.send({ responseCode: 501, responseMessage: "Something went wrong" })
                }
 }
}