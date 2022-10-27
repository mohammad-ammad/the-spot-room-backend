//---INTIALIZED IMPORTS
const express = require("express");
const router = express.Router();

const {create} = require("../Controllers/StripeController/indexController")

router.route("/payment").post(create);

module.exports = router;