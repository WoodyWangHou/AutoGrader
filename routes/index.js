var express = require('express');
var router = express.Router();
var verify = require('../utils/VerifyUser');

/* GET home page. */
router.route('/home').get(verify.verifyOrdinaryUser);
// router.route('/instructor/home').get(verify.verifyInstructorUser);
module.exports = router;
