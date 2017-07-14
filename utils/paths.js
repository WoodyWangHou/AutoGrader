var path = require('path');

var RESOURCE_URL = {
	FILES: path.resolve('./public/files'),
	PRESCRIPTION : path.resolve('./public/files/prescription'),
	STUDENT_SUBMISSION: path.resolve('./public/files/submission')
};

module.exports = RESOURCE_URL;

