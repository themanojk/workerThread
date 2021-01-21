var Users = require("../model/User.js");
let ObjectId = require("mongodb").ObjectId;

module.exports.setRoutes = function (app) {
  app.get("/userInfo", async (req, res) => {
    try {
      console.log(req.userInfo);
      let userId = new ObjectId(req.userInfo.id);
      let user = await Users.findOne({ _id: userId });

      if (user) {
        user.profilePic = `${process.env.IMAGE_URL}${user.profilePic}`;

        return res.status(200).json({ msg: "User Info", data: user });
      } else {
        return res.status(404).json({ err: "User not found" });
      }
    } catch (err) {
      res.status(500).json({ err: err });
    }
  });

};
