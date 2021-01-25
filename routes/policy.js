let Users = require("../model/User.js");
let UserAccount = require('../model/UserAccount');
let PolicyInfo = require('../model/PolicyInfo');
const User = require("../model/User.js");
let ObjectId = require("mongodb").ObjectId;

module.exports.setRoutes = function (app) {
    app.get("/searchViaUserName/:userName", async (req, res) => {
        try {

            let data = await UserAccount.aggregate([
                {
                    $match: {
                        accountName: { "$regex": new RegExp(req.params.userName, 'i') }
                    }
                },
                {
                    $lookup:
                    {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userInfo'
                    }
                },

                {
                    $lookup:
                    {
                        from: 'policy_infos',
                        localField: 'userId',
                        foreignField: 'userId',
                        as: 'policyInfo'
                    }
                },


            ])

            res.status(200).json({ msg: "Policy Info", data });

        } catch (err) {
            res.status(500).json({ err: err });
        }
    });

    app.get('/policyByUsers', async (req, res) => {
        let data = await User.aggregate([
            {
                $lookup:
                {
                    from: 'policy_infos',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'policyInfo'
                }
            },
            {
                $unwind: {
                    path: "$policyInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup:
                {
                    from: 'policy_categories',
                    localField: 'policyInfo.categoryId',
                    foreignField: '_id',
                    as: 'policyInfo.categoryInfo'
                }
            },
            { "$unwind": "$policyInfo.categoryInfo" },
            {
                $lookup:
                {
                    from: 'policy_carriers',
                    localField: 'policyInfo.companyId',
                    foreignField: '_id',
                    as: 'policyInfo.companyInfo'
                }
            },
            { "$unwind": "$policyInfo.companyInfo" },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    userType: 1,
                    phoneNumber: 1,
                    dob: 1,
                    address: 1,
                    state: 1,
                    gender: 1,
                    userType: 1,
                    'policyInfo._id': 1,
                    'policyInfo.policyNumber': 1,
                    'policyInfo.policyStartDate': 1,
                    'policyInfo.policyEndDate': 1,
                    'policyInfo.categoryInfo._id': 1,
                    'policyInfo.categoryInfo.categoryName': 1,
                    'policyInfo.companyInfo._id': 1,
                    'policyInfo.companyInfo.companyName': 1
                }
            }
        ]);

        res.status(200).json({ msg: "Users Info", data });
    })

};
