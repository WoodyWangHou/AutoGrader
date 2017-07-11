var mongoose = require('mongoose'),
	schema = mongoose.Schema,

	student = require('./user'),
	template = require('./template'),
	submission = require('./submission')

var assignment_schema = new schema({
	// #Still need to be created during assignment creation.
	submission: {
			type: schema.Types.ObjectId,
			ref: 'submission'
			// required: true
		},
	template: {
			type: schema.Types.ObjectId,
			ref: 'template',
			required: true
		},
	student: {
		type: schema.Types.ObjectId,
		ref: 'student',
		required:true
	}
},{
	timeStamps: true
});

//creating the model of dish
var assignment = mongoose.model('assignment',assignment_schema);
// make this available to Node application
module.exports = assignment;
