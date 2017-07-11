var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    assignments = require('./assignment');

var template_schema = new schema({
  //username needs to be matric number; add verification method afterwards
	assignment_name:{
		type: String,
		required:true
	},
  	description:{
  		type:String,
  		required:true
  	},
	additional_material:String,
	prescription_url: String,
	deadline:Date
},{
	timeStamps: true
});

//expose user model
module.exports = mongoose.model('template', template_schema);
